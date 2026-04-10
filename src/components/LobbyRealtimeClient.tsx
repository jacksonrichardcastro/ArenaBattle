'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import styles from '../app/lobby/page.module.css';
import { acceptChallenge } from '@/lib/actions';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LobbyRealtimeClient({ initialChallenges }: { initialChallenges: any[] }) {
  const [challenges, setChallenges] = useState(initialChallenges);

  useEffect(() => {
    // Make sure we have URL and Key to attempt socket connection
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        return;
    }

    const channel = supabase.channel('public:Challenge')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'Challenge' }, (payload) => {
        
        console.log('Realtime Event:', payload);
        
        if (payload.eventType === 'INSERT') {
          // A new challenge just appeared! Slide it into state.
          // Note: In a production app, we would also fetch the creator's username via a join,
          // but for instant feedback we can append a default shape or refetch.
          setChallenges((prev) => [
            {
                ...payload.new,
                creator: { username: "Live Opponent" } // Placeholder until refetched
            }, 
            ...prev
          ]);
        } else if (payload.eventType === 'UPDATE') {
          // Challenge accepted or deleted
          setChallenges((prev) => 
            prev.map(c => c.id === payload.new.id ? { ...c, ...payload.new } : c)
                .filter(c => c.status === 'OPEN') // Hide if it was accepted
          );
        } else if (payload.eventType === 'DELETE') {
          setChallenges((prev) => prev.filter(c => c.id !== payload.old.id));
        }
      })
      .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
              console.log("Supabase WebSockets connected securely.");
          }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className={styles.challengesGrid}>
      {challenges.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No open challenges right now. Create one!</p>
      ) : challenges.map((challenge) => (
        <div key={challenge.id} className={`card ${styles.challengeCard}`}>
          <div className={styles.cardHeader}>
            <div className={styles.gameInfo}>
              <span className={styles.gameName}>{challenge.game}</span>
              <span className={styles.formatBadge}>{challenge.format}</span>
              <span className={styles.platformBadge}>{challenge.platform}</span>
            </div>
            <div className={styles.prizePool}>
              <span className={styles.prizeLabel}>Win:</span>
              <span className="text-gradient-gold" style={{ fontSize: '1.5rem', fontWeight: 800 }}>
                ${((challenge.entryFee || 0) * 2).toFixed(2)}
              </span>
            </div>
          </div>

          <div className={styles.cardBody}>
            <div className={styles.userSection}>
              <div className={styles.avatar}></div>
              <div>
                <div className={styles.username}>{challenge.creator?.username || 'Opponent'}</div>
                <div className={styles.userStats}>New User</div>
              </div>
            </div>
            <div className={styles.actionSection}>
              <div className={styles.entryFee}>Entry: ${(challenge.entryFee || 0).toFixed(2)}</div>
              <form action={acceptChallenge.bind(null, challenge.id)} style={{ display: 'inline' }}>
                <button type="submit" className={`btn btn-gold ${styles.joinBtn}`}>Accept Match</button>
              </form>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
