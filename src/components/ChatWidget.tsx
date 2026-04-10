'use client';

import { useState, useEffect, useRef } from 'react';
import { getMessages, postMessage } from '@/lib/actions';
import { useSession } from 'next-auth/react';
import styles from './ChatWidget.module.css';

type MessageType = Awaited<ReturnType<typeof getMessages>>[number];

export default function ChatWidget() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Poll for messages
  useEffect(() => {
    if (!isOpen) return;

    let interval: ReturnType<typeof setInterval>;
    
    // Initial fetch
    getMessages().then(m => {
      setMessages(m);
      scrollToBottom();
    });

    // Poll every 5 seconds
    interval = setInterval(async () => {
      const m = await getMessages();
      setMessages(m);
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleAction = async (formData: FormData) => {
    if (!session) return;
    
    const text = formData.get('text') as string;
    if (!text || text.trim() === '') return;
    
    // Optimistic UI update
    const optimisticMessage = {
      id: Math.random().toString(),
      text,
      userId: (session.user as any).id,
      createdAt: new Date(),
      user: { username: session.user?.name || 'You' }
    };
    
    setMessages(prev => [...prev, optimisticMessage as any]);
    
    const form = document.getElementById('chatForm') as HTMLFormElement;
    form.reset();

    await postMessage(formData);
  };

  return (
    <>
      <div className={styles.toggleBtn} onClick={() => setIsOpen(!isOpen)}>
        💬 Shoutbox
      </div>
      
      {isOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.header}>
            <span style={{ fontWeight: 600 }}>Live Shoutbox</span>
            <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>×</button>
          </div>
          
          <div className={styles.messagesContainer}>
            {messages.length === 0 ? (
              <p className={styles.empty}>No messages yet. Be the first to talk smack!</p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={styles.message}>
                  <span className={styles.username}>{msg.user.username}:</span>
                  <span className={styles.text}>{msg.text}</span>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {session ? (
            <form id="chatForm" action={handleAction} className={styles.inputArea}>
              <input type="text" name="text" placeholder="Type a message..." className={styles.input} required />
              <button type="submit" className={styles.sendBtn}>Send</button>
            </form>
          ) : (
            <div className={styles.inputArea} style={{ justifyContent: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Login to chat</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
