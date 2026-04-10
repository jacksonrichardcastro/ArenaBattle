import Link from 'next/link';
import styles from './page.module.css';
import { getOpenChallenges } from '@/lib/actions';
import LobbyRealtimeClient from '@/components/LobbyRealtimeClient';

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

      <LobbyRealtimeClient initialChallenges={openChallenges} />
    </div>
  );
}
