import Link from 'next/link';
import styles from './page.module.css';
import { getOpenChallenges, acceptChallenge } from '@/lib/actions';

export default async function Lobby() {
  const openChallenges = await getOpenChallenges();

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>The Lobby</h1>
          <p className="text-secondary">Find an opponent and put your money where your skills are.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Create Challenge</button>
      </header>

      <div className={styles.filters}>
        <button className={`${styles.filterBtn} ${styles.active}`}>All Games</button>
        <button className={styles.filterBtn}>Sports</button>
        <button className={styles.filterBtn}>Shooters</button>
        <div className={styles.searchBar}>
          <input type="text" placeholder="Search user or game..." className={styles.searchInput} />
        </div>
      </div>

      <div className={styles.challengesGrid}>
        {openChallenges.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No open challenges right now. Create one!</p>
        ) : openChallenges.map(challenge => (
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
                  ${(challenge.entryFee * 2).toFixed(2)}
                </span>
              </div>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.userSection}>
                <div className={styles.avatar}></div>
                <div>
                  <div className={styles.username}>{challenge.creator.username}</div>
                  <div className={styles.userStats}>New User</div>
                </div>
              </div>
              <div className={styles.actionSection}>
                <div className={styles.entryFee}>Entry: ${challenge.entryFee.toFixed(2)}</div>
                <form action={acceptChallenge.bind(null, challenge.id)} style={{ display: 'inline' }}>
                  <button type="submit" className={`btn btn-gold ${styles.joinBtn}`}>Accept Match</button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
