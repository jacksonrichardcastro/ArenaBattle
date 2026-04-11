import styles from '../page.module.css';

export default function PrivacyPolicy() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className={styles.title} style={{ marginBottom: '2rem' }}>Privacy Policy</h1>
      <div style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
        <p><strong>Effective Date:</strong> Today</p>

        <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
        <p>We strictly collect the necessary information to process skill-based wagering and account generation. This includes: Email address, chosen usernames, encrypted passwords, and financial ledger items associated with Stripe.</p>

        <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use It</h2>
        <p>We use this information explicitly to provide the Wagyr matchmaking services and ensure proper monetary payouts. We do not sell your personal data to ad networks.</p>
        
        <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. Financial Processing</h2>
        <p>All credit card transactions are handled strictly by Stripe. We do NOT store your full credit card information on our servers at any time.</p>
        
        <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>4. Data Deletion</h2>
        <p>You may request account or data deletion at any time by contacting our administrators.</p>
      </div>
    </div>
  );
}
