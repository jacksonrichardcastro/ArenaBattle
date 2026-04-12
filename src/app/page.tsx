import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.glowBlob}></div>
        <div className={`container ${styles.heroContainer}`}>
          <h1 className={`animate-fade-in ${styles.title}`}>
            Play Your Favorite Games.<br />
            <span className="text-gradient">Win Real Cash.</span>
          </h1>
          <p className={`animate-fade-in ${styles.subtitle}`} style={{ animationDelay: '0.1s' }}>
            Wagyr is the premier head-to-head esports platform. Challenge opponents in 
            Madden, NBA 2K, FC 26, and Call of Duty. Skill-based matchmaking guarantees a fair fight.
          </p>
          <div className={`animate-fade-in ${styles.ctaGroup}`} style={{ animationDelay: '0.2s' }}>
            <Link href="/lobby" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Find a Match
            </Link>
            <Link href="/leaderboards" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              View Leaderboards
            </Link>
          </div>
          
          <div className={`animate-fade-in ${styles.badges}`} style={{ animationDelay: '0.3s' }}>
            <div className={styles.badge}><span className={styles.dot}></span> 24/7 Matchmaking</div>
            <div className={styles.badge}><span className={styles.dot}></span> Instant Payouts</div>
            <div className={styles.badge}><span className={styles.dot}></span> Anti-Cheat Secured</div>
          </div>
        </div>
      </section>

      {/* Featured Games Section */}
      <section className={styles.gamesSection}>
        <div className="container">
          <h2 className={styles.sectionTitle}>Featured Titles</h2>
          <div className={styles.gamesGrid}>
            {[
              { title: 'Madden NFL 24', category: 'Sports', color: 'blue' },
              { title: 'NBA 2K24', category: 'Sports', color: 'gold' },
              { title: 'EA Sports FC 26', category: 'Sports', color: 'green' },
              { title: 'Call of Duty: MW3', category: 'Shooter', color: 'red' },
            ].map((game) => (
              <div key={game.title} className={`card ${styles.gameCard}`}>
                <div className={styles.gameCategory}>{game.category}</div>
                <h3 className={styles.gameTitle}>{game.title}</h3>
                <div className={styles.gameAction}>
                  <Link href="/lobby" className="btn btn-outline">Join Lobby</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
