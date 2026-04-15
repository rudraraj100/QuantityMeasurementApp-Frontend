import { Injectable, signal } from '@angular/core';
import { AuthResponse, SessionUser, User } from '../models/models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly storageKey = 'quanment_user';
  private readonly tokenKey = 'quanment_token';

  private readonly sessionUserSignal = signal<SessionUser | null>(this.readSessionUserFromStorage());
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(this.tokenKey));

  private readSessionUserFromStorage(): SessionUser | null {
    const raw = sessionStorage.getItem(this.storageKey);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as SessionUser;
    } catch {
      return null;
    }
  }

  getSessionUser(): SessionUser | null {
    return this.sessionUserSignal();
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  isLoggedIn(): boolean {
    return this.tokenSignal() !== null && this.sessionUserSignal() !== null;
  }

  storeSessionUser(user: Pick<User, 'id' | 'name' | 'email'>): void {
    if (user.id == null) return;

    const sessionUser = { id: user.id, name: user.name, email: user.email } satisfies SessionUser;
    sessionStorage.setItem(this.storageKey, JSON.stringify(sessionUser));
    this.sessionUserSignal.set(sessionUser);
  }

  storeAuthSession(auth: Pick<AuthResponse, 'id' | 'name' | 'email' | 'token'>): void {
    localStorage.setItem(this.tokenKey, auth.token);
    this.tokenSignal.set(auth.token);
    this.storeSessionUser({ id: auth.id, name: auth.name, email: auth.email });
  }

  logout(): void {
    sessionStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.tokenKey);
    this.sessionUserSignal.set(null);
    this.tokenSignal.set(null);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .filter(Boolean)
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  getFirstName(name: string): string {
    return name.split(' ').filter(Boolean)[0] ?? '';
  }
}