import styles from '../dashboard/page.module.css';
import { getCurrentUser, processDeposit, processWithdrawal } from '@/lib/actions';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';

export default async function Wallet({ searchParams }: { searchParams: Promise<{ success?: string, canceled?: string }> }) {
  const params = await searchParams;
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px' }}>
      {params.success && (
        <div style={{ background: 'var(--success)', color: 'black', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', fontWeight: 'bold' }}>
          Payment successful! Your funds have been securely added to your wallet lockbox.
        </div>
      )}
      {params.canceled && (
        <div style={{ background: 'var(--danger)', color: 'white', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '2rem', fontWeight: 'bold' }}>
          Payment canceled. Your card was not charged.
        </div>
      )}
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Wallet & Cashier</h1>
      
      <div className={`card ${styles.walletCard}`} style={{ marginBottom: '2rem' }}>
        <h2 className={styles.cardHeader}>Available to Withdraw</h2>
        <div className={styles.balanceAmount}>${user.walletBalance.toFixed(2)}</div>
      </div>

      <div className={styles.dashboardGrid}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Deposit Funds</h3>
          <form action={processDeposit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Amount ($)</label>
              <input type="number" name="amount" defaultValue={20} required style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--bg-tertiary)', color: 'white', borderRadius: 'var(--radius-md)' }} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>Add Funds via Card</button>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>Secure payments processing.</p>
          </form>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontFamily: 'var(--font-heading)' }}>Withdraw Winnings</h3>
          <form action={processWithdrawal} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Amount ($)</label>
              <input type="number" name="amount" max={user.walletBalance} defaultValue={user.walletBalance} style={{ width: '100%', padding: '0.75rem', background: 'var(--bg-primary)', border: '1px solid var(--bg-tertiary)', color: 'white', borderRadius: 'var(--radius-md)' }} />
            </div>
            <button type="submit" className="btn btn-outline" style={{ width: '100%', marginTop: '0.5rem' }}>Request Payout to Bank</button>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>Payouts are processed within 24-48 hours.</p>
          </form>
        </div>
      </div>
      
      {/* Transaction History Ledger */}
      <h2 style={{ marginTop: '3rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Transaction History</h2>
      {transactions.length === 0 ? <p className="text-secondary">No transactions yet.</p> : (
        <div className={styles.historyList}>
          {transactions.map(t => (
            <div key={t.id} className={`card ${styles.historyCard}`}>
              <div className={styles.historyInfo}>
                <div style={{ fontWeight: '600' }}>{t.type}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.createdAt.toLocaleString()}</div>
              </div>
              <div className={styles.historyAmount} style={{ color: t.amount > 0 ? 'var(--success)' : 'var(--danger)' }}>
                {t.amount > 0 ? '+' : ''}{t.amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
