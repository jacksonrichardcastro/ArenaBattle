'use server';

import { prisma } from './prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { revalidatePath } from 'next/cache';

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  return await prisma.user.findUnique({
    where: { email: session.user.email },
  });
}

export async function getOpenChallenges() {
  return await prisma.challenge.findMany({
    where: { status: 'OPEN' },
    include: { creator: { select: { username: true, id: true } } },
    orderBy: { createdAt: 'desc' }
  });
}

export async function getActiveChallenges() {
  const user = await getCurrentUser();
  if (!user) return [];

  return await prisma.challenge.findMany({
    where: {
      status: { in: ['ACCEPTED', 'DISPUTED'] },
      OR: [
        { creatorId: user.id },
        { opponentId: user.id }
      ]
    },
    include: {
      creator: { select: { username: true, id: true } },
      opponent: { select: { username: true, id: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
}

export async function processDeposit(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const amount = parseFloat(formData.get('amount') as string);
  if (amount <= 0 || isNaN(amount)) throw new Error();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { walletBalance: { increment: amount } }
    }),
    prisma.transaction.create({
      data: { userId: user.id, type: 'DEPOSIT', amount: amount }
    })
  ]);

  revalidatePath('/wallet');
  revalidatePath('/dashboard');
  
}

export async function processWithdrawal(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const amount = parseFloat(formData.get('amount') as string);
  if (amount <= 0 || isNaN(amount)) throw new Error();

  if (user.walletBalance < amount) {
    throw new Error();
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { walletBalance: { decrement: amount } }
    }),
    prisma.transaction.create({
      data: { userId: user.id, type: 'WITHDRAWAL', amount: -amount }
    })
  ]);

  revalidatePath('/wallet');
  revalidatePath('/dashboard');
  
}

export async function createChallenge(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const game = formData.get('game') as string;
  const format = formData.get('format') as string || 'Standard';
  const platform = formData.get('platform') as string || 'Crossplay';
  const entryFee = parseFloat(formData.get('entryFee') as string);

  if (user.walletBalance < entryFee) throw new Error();

  // Deduct fee and create challenge
  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { walletBalance: { decrement: entryFee } }
    }),
    prisma.challenge.create({
      data: { game, format, platform, entryFee, creatorId: user.id }
    }),
    prisma.transaction.create({
      data: { userId: user.id, type: 'ENTRY_FEE', amount: -entryFee }
    })
  ]);

  revalidatePath('/lobby');
  
}

export async function acceptChallenge(challengeId: string) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge || challenge.status !== 'OPEN') throw new Error();
  if (challenge.creatorId === user.id) throw new Error();
  if (user.walletBalance < challenge.entryFee) throw new Error();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { walletBalance: { decrement: challenge.entryFee } }
    }),
    prisma.challenge.update({
      where: { id: challengeId },
      data: { status: 'ACCEPTED', opponentId: user.id }
    }),
    prisma.transaction.create({
      data: { userId: user.id, type: 'ENTRY_FEE', amount: -challenge.entryFee }
    })
  ]);

  revalidatePath('/lobby');
  revalidatePath('/dashboard');
  
}

export async function resolveMatch(challengeId: string, iWon: boolean) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge || challenge.status !== 'ACCEPTED') throw new Error();

  const isCreator = user.id === challenge.creatorId;
  const resultStr = iWon ? "WON" : "LOST";

  // Register the user's result
  const updatedChallenge = await prisma.challenge.update({
    where: { id: challengeId },
    data: isCreator ? { creatorResult: resultStr } : { opponentResult: resultStr }
  });

  // Check state
  const cRes = updatedChallenge.creatorResult;
  const oRes = updatedChallenge.opponentResult;

  if (cRes && oRes) {
    if ((cRes === "WON" && oRes === "LOST") || (cRes === "LOST" && oRes === "WON")) {
      // They agree! Payout winner.
      const winnerId = cRes === "WON" ? challenge.creatorId : challenge.opponentId!;
      const prize = challenge.entryFee * 2;

      await prisma.$transaction([
        prisma.challenge.update({
          where: { id: challengeId },
          data: { status: 'COMPLETED', winnerId }
        }),
        prisma.user.update({
          where: { id: winnerId },
          data: { walletBalance: { increment: prize } }
        }),
        prisma.transaction.create({
          data: { userId: winnerId, type: 'PRIZE_PAYOUT', amount: prize }
        })
      ]);
    } else {
      // Conflict! 
      await prisma.challenge.update({
        where: { id: challengeId },
        data: { status: 'DISPUTED' }
      });
    }
  }

  revalidatePath('/dashboard');
  
}

export async function getMessages() {
  return await prisma.message.findMany({
    orderBy: { createdAt: 'asc' },
    take: 50,
    include: { user: { select: { username: true } } }
  });
}

export async function postMessage(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error();

  const text = formData.get('text') as string;
  if (!text || text.trim() === '') throw new Error();

  await prisma.message.create({
    data: { text, userId: user.id }
  });
  
  
}

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function uploadEvidence(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  const file = formData.get('evidenceFile') as File | null;
  const challengeId = formData.get('challengeId') as string;

  if (!file) throw new Error("No file uploaded");
  if (!challengeId) throw new Error("No challenge ID");

  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge || challenge.status !== 'DISPUTED') {
    throw new Error("Challenge must be disputed to upload evidence");
  }

  const filename = `${challengeId}-${user.id}-${file.name.replace(/\s+/g, '_')}`;

  const { data, error } = await supabase.storage
    .from('evidence')
    .upload(filename, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    console.error("Supabase Upload Error: ", error);
    throw new Error("Failed to upload evidence.");
  }

  const { data: publicUrlData } = supabase.storage
    .from('evidence')
    .getPublicUrl(filename);

  await prisma.disputeEvidence.create({
    data: {
      fileUrl: publicUrlData.publicUrl,
      challengeId,
      userId: user.id
    }
  });

  revalidatePath('/dashboard');
  revalidatePath('/admin');
  
}

export async function adminResolveMatch(formData: FormData) {
  const user = await getCurrentUser();
  if (user?.email !== 'admin@example.com') throw new Error("Unauthorized");

  const challengeId = formData.get('challengeId') as string;
  const winnerId = formData.get('winnerId') as string;

  const challenge = await prisma.challenge.findUnique({ where: { id: challengeId } });
  if (!challenge || challenge.status !== 'DISPUTED') throw new Error("Invalid");

  const prize = challenge.entryFee * 2;

  await prisma.$transaction([
    prisma.challenge.update({
      where: { id: challengeId },
      data: { status: 'COMPLETED', winnerId }
    }),
    prisma.user.update({
      where: { id: winnerId },
      data: { walletBalance: { increment: prize } }
    }),
    prisma.transaction.create({
      data: { userId: winnerId, type: 'PRIZE_PAYOUT', amount: prize }
    })
  ]);

  revalidatePath('/admin');
  revalidatePath('/dashboard');
}
