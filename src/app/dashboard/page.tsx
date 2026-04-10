import styles from './page.module.css';
import { getCurrentUser, getActiveChallenges, resolveMatch } from '@/lib/actions';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  const activeMatches = await getActiveChallenges();

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Welcome, {user.username}</h1>
      
      {activeMatches.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', color: 'var(--accent-gold)' }}>Action Required: Active Matches</h2>
          <div className={styles.historyList}>
            {activeMatches.map(match => {
              const opponent = match.creatorId === user.id ? match.opponent : match.creator;
              
              const isDisputed = match.status === 'DISPUTED';
              // Check if user already reported
              const uReported = match.creatorId === user.id ? match.creatorResult : match.opponentResult;

              return (
                <div key={match.id} className={`card ${styles.historyCard}`} style={{ borderLeftColor: isDisputed ? 'var(--danger)' : 'var(--accent-gold)', flexDirection: 'column', alignItems: 'stretch' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div className={styles.historyInfo}>
                      <div className={styles.historyGame}>{match.game} <span style={{ fontSize: '0.8rem', color: isDisputed ? 'var(--danger)' : 'var(--text-muted)' }}>[{match.status}]</span></div>
                      <div className={styles.historyOpponent}>vs {opponent?.username}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Prize: ${(match.entryFee * 2).toFixed(2)}</div>
                    </div>

                    {!isDisputed && !uReported && (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <form action={resolveMatch.bind(null, match.id, true)}>
                          <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>I Won</button>
                        </form>
                        <form action={resolveMatch.bind(null, match.id, false)}>
                          <button type="submit" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>I Lost</button>
                        </form>
                      </div>
                    )}
                    {!isDisputed && uReported && (
                      <span className="text-secondary" style={{ fontSize: '0.9rem' }}>Awaiting opponent...</span>
                    )}
                  </div>

                  {isDisputed && (
                    <div style={{ background: 'var(--bg-primary)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--danger)' }}>
                      <p style={{ color: 'var(--danger)', fontSize: '0.9rem', marginBottom: '1rem', fontWeight: 600 }}>MATCH DISPUTED. Please upload proof of the result (e.g. Scoreboard Screenshot).</p>
                      
                      <form action={uploadEvidence} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <input type="hidden" name="challengeId" value={match.id} />
                        <input type="file" name="evidenceFile" accept="image/*" required style={{ color: 'white' }} />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>Submit Proof</button>
                      </form>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className={styles.dashboardGrid}>
        {/* Wallet Overview */}
        <div className={`card ${styles.walletCard}`}>
          <h2 className={styles.cardHeader}>Wallet Balance</h2>
          <div className={styles.balanceAmount}>${user.walletBalance.toFixed(2)}</div>
          <p className={styles.balanceStatus}>+ $0.00 this week</p>
          <div className={styles.walletActions}>
            <button className="btn btn-gold" style={{ flex: 1 }}>Deposit</button>
            <button className="btn btn-outline" style={{ flex: 1 }}>Withdraw</button>
          </div>
        </div>

        {/* Player Stats */}
        <div className={`card ${styles.statsCard}`}>
          <h2 className={styles.cardHeader}>Lifetime Stats</h2>
          <div className={styles.statsGrid}>
            <div className={styles.statBox}>
              <div className={styles.statValue}>14</div>
              <div className={styles.statLabel}>Wins</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>2</div>
              <div className={styles.statLabel}>Losses</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>87%</div>
              <div className={styles.statLabel}>Win Rate</div>
            </div>
            <div className={styles.statBox}>
              <div className={styles.statValue}>$120.50</div>
              <div className={styles.statLabel}>Total Earned</div>
            </div>
          </div>
        </div>
      </div>

      {/* Match History */}
      <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Recent Matches</h2>
      <div className={styles.historyList}>
        {[
          { id: 1, opponent: 'SniperElite', game: 'Call of Duty: MW3', result: 'WIN', amount: '+$50.00', date: 'Today' },
          { id: 2, opponent: 'HoopsLegend', game: 'NBA 2K24', result: 'LOSS', amount: '-$10.00', date: 'Yesterday' },
          { id: 3, opponent: 'MessiFan10', game: 'EA Sports FC 24', result: 'WIN', amount: '+$15.00', date: 'Apr 2' },
        ].map(match => (
          <div key={match.id} className={`card ${styles.historyCard}`}>
            <div className={styles.historyInfo}>
              <div className={styles.historyGame}>{match.game}</div>
              <div className={styles.historyOpponent}>vs {match.opponent}</div>
            </div>
            <div className={styles.historyResult}>
              <span className={`${styles.resultBadge} ${match.result === 'WIN' ? styles.win : styles.loss}`}>
                {match.result}
              </span>
              <span className={styles.historyAmount} style={{ color: match.result === 'WIN' ? 'var(--success)' : 'var(--danger)' }}>
                {match.amount}
              </span>
              <span className={styles.historyDate}>{match.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
