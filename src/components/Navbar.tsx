'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContainer}`}>
        <Link href="/" className={styles.logo} onClick={() => setIsOpen(false)}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.logoIcon}>
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
          </svg>
          <span className="text-gradient">Wagyr.gg</span>
        </Link>
        
        {/* Desktop Links */}
        <div className={styles.navLinks}>
          <Link href="/lobby" className={styles.link}>The Lobbies</Link>
          <Link href="/wallet" className={styles.link}>Wallet</Link>
        </div>

        {/* Desktop Actions */}
        <div className={styles.navActions}>
          {session ? (
            <Link href="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>{session.user?.name}</Link>
          ) : (
            <Link href="/login" className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Log In</Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button className={styles.menuBtn} onClick={() => setIsOpen(!isOpen)} aria-label="Toggle Navigation">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div className={`${styles.mobileMenu} ${isOpen ? styles.open : ''}`}>
        <Link href="/lobby" className={styles.mobileLink} onClick={() => setIsOpen(false)}>The Lobbies</Link>
        <Link href="/wallet" className={styles.mobileLink} onClick={() => setIsOpen(false)}>Wallet</Link>
        {session ? (
          <Link href="/dashboard" className={`${styles.mobileLink} text-gradient`} onClick={() => setIsOpen(false)}>Dashboard</Link>
        ) : (
          <Link href="/login" className={`${styles.mobileLink} text-gradient`} onClick={() => setIsOpen(false)}>Log In</Link>
        )}
      </div>
    </nav>
  );
}
