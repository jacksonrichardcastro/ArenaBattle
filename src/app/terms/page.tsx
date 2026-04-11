import styles from '../page.module.css';

export default function TermsOfService() {
  return (
    <div className="container" style={{ padding: '3rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className={styles.title} style={{ marginBottom: '2rem' }}>Terms of Service</h1>
      <div style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
        <p><strong>Effective Date:</strong> Today</p>
        
        <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
        <p>By accessing or using the Wagyr platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, simply do not use the platform.</p>

        <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>2. Eligibility</h2>
        <p>You must be at least 18 years of old to use this platform. You are solely responsible for ensuring your participation in skill-based wagering is legal in your local jurisdiction. This platform is expressly strictly for games of skill.</p>

        <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>3. Match Resolutions & Escrow</h2>
        <p>Upon accepting a challenge, entry fees from both parties are held in a secure escrow. Both players must report the match result truthfully. If there is a dispute, administrators will resolve the dispute based on video/image evidence provided. Administrator decisions are final. If an administrator issues a mutual cancel order, entry fees are refunded.</p>

        <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>4. Fees</h2>
        <p>Wagyr takes a flat 10% platform fee from the total gross prize pool of any finalized, non-canceled match.</p>

        <h2 style={{ color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>5. Withdrawals</h2>
        <p>Withdrawal processing is currently handled manually. By submitting a withdrawal request, you consent to an administrator contacting you to fulfill the payout via an external peer-to-peer payment merchant (e.g. PayPal).</p>
      </div>
    </div>
  );
}
