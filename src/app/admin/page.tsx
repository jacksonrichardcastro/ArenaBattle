import { getCurrentUser, adminResolveMatch } from '@/lib/actions';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Image from 'next/image';

export default async function AdminDashboard() {
  const user = await getCurrentUser();
  if (user?.email !== 'admin@example.com') {
    redirect('/');
  }

  const disputes = await prisma.challenge.findMany({
    where: { status: 'DISPUTED' },
    include: {
      creator: true,
      opponent: true,
      evidence: { include: { user: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--danger)' }}>Admin: Dispute Resolution</h1>
      
      {disputes.length === 0 ? (
        <p className="text-secondary">No active disputes.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {disputes.map(dispute => (
            <div key={dispute.id} className="card" style={{ border: '1px solid var(--danger)' }}>
              <h2>{dispute.game} - ${dispute.entryFee * 2} Prize Pool</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', marginTop: '1rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ flex: 1, borderRight: '1px solid var(--bg-tertiary)', paddingRight: '1rem' }}>
                  <h3 style={{ color: 'var(--accent-gold)' }}>Creator: {dispute.creator.username}</h3>
                  <p>Reported: {dispute.creatorResult || 'None'}</p>
                  <form action={adminResolveMatch} style={{ marginTop: '1rem' }}>
                    <input type="hidden" name="challengeId" value={dispute.id} />
                    <input type="hidden" name="winnerId" value={dispute.creatorId} />
                    <button type="submit" className="btn btn-outline" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>Force Win for Creator</button>
                  </form>
                </div>
                
                <div style={{ flex: 1, paddingLeft: '1rem' }}>
                  <h3 style={{ color: 'var(--accent-blue)' }}>Opponent: {dispute.opponent?.username}</h3>
                  <p>Reported: {dispute.opponentResult || 'None'}</p>
                  <form action={adminResolveMatch} style={{ marginTop: '1rem' }}>
                    <input type="hidden" name="challengeId" value={dispute.id} />
                    <input type="hidden" name="winnerId" value={dispute.opponentId!} />
                    <button type="submit" className="btn btn-outline" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>Force Win for Opponent</button>
                  </form>
                </div>
              </div>

              <h3>Uploaded Evidence</h3>
              {dispute.evidence.length === 0 ? (
                <p className="text-secondary">No evidence provided yet.</p>
              ) : (
                <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', marginTop: '1rem' }}>
                  {dispute.evidence.map(ev => (
                    <div key={ev.id} style={{ minWidth: '300px', background: 'var(--bg-primary)', padding: '0.5rem', borderRadius: 'var(--radius-md)' }}>
                      <p style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Uploaded by: {ev.user.username}</p>
                      {/* Using standard img for external uploads if not configured in next components */}
                      <img src={ev.fileUrl} alt="Evidence" style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-sm)' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
