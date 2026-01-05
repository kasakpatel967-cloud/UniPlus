
import { User, AuthSession } from '../types';

// Simulated Argon2id hashing
const secureHash = async (text: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text + "BVM_SALT_2025");
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

const ACCESS_TOKEN_EXPIRY = 5 * 60 * 1000; // 5 Minutes for security
const REFRESH_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 Hours

export const authService = {
  // Brute force protection state
  attempts: new Map<string, { count: number, lastAttempt: number }>(),

  async login(studentId: string, password: string): Promise<AuthSession> {
    const accounts = JSON.parse(localStorage.getItem('uniplus_accounts') || '[]');
    const now = Date.now();
    
    // Check Brute Force
    const attempt = this.attempts.get(studentId);
    if (attempt && attempt.count >= 5 && now - attempt.lastAttempt < 30000) {
      throw new Error("PULSE_LOCKED: Security protocols active. ID locked for 30s.");
    }

    const hashedInput = await secureHash(password);
    // Strict matching on studentId only
    const account = accounts.find((acc: any) => 
      acc.studentId === studentId && acc.passwordHash === hashedInput
    );

    if (!account) {
      const prev = attempt || { count: 0, lastAttempt: 0 };
      this.attempts.set(studentId, { count: prev.count + 1, lastAttempt: now });
      throw new Error("INVALID_CREDENTIALS: ID/Password mismatch in campus database.");
    }

    // Reset attempts on success
    this.attempts.delete(studentId);

    // Issue rotated tokens
    return this.createSession(account.profile);
  },

  async signup(userData: User, password: string): Promise<AuthSession> {
    const accounts = JSON.parse(localStorage.getItem('uniplus_accounts') || '[]');
    
    if (accounts.some((acc: any) => acc.studentId === userData.studentId)) {
      throw new Error("IDENTITY_EXISTS: This Student ID is already registered.");
    }

    const passwordHash = await secureHash(password);
    const newAccount = { email: userData.email, studentId: userData.studentId, passwordHash, profile: userData };
    
    accounts.push(newAccount);
    localStorage.setItem('uniplus_accounts', JSON.stringify(accounts));

    return this.createSession(userData);
  },

  createSession(user: User): AuthSession {
    const session: AuthSession = {
      accessToken: `at_${Math.random().toString(36).substring(2)}`,
      refreshToken: `rt_${Math.random().toString(36).substring(2)}`,
      expiresAt: Date.now() + ACCESS_TOKEN_EXPIRY,
      user
    };
    
    localStorage.setItem('uniplus_session', JSON.stringify(session));
    return session;
  },

  async refreshSession(): Promise<AuthSession | null> {
    const sessionStr = localStorage.getItem('uniplus_session');
    if (!sessionStr) return null;
    
    const session: AuthSession = JSON.parse(sessionStr);
    console.log("Rotating Pulse Session...");
    
    // Simulate server-side rotation
    return this.createSession(session.user);
  },

  logout() {
    localStorage.removeItem('uniplus_session');
  },

  getSession(): AuthSession | null {
    const sessionStr = localStorage.getItem('uniplus_session');
    if (!sessionStr) return null;
    
    const session: AuthSession = JSON.parse(sessionStr);
    return session;
  }
};
