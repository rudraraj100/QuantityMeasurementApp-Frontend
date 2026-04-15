import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('quanment_token');

    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  async get<T>(endpoint: string): Promise<T> {
    return await firstValueFrom(
      this.http.get<T>(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders()
      })
    );
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    return await firstValueFrom(
      this.http.post<T>(`${this.baseUrl}${endpoint}`, body, {
        headers: this.getHeaders()
      })
    );
  }

  async put<T>(endpoint: string, body: unknown): Promise<T> {
    return await firstValueFrom(
      this.http.put<T>(`${this.baseUrl}${endpoint}`, body, {
        headers: this.getHeaders()
      })
    );
  }

  async delete<T>(endpoint: string): Promise<T> {
    return await firstValueFrom(
      this.http.delete<T>(`${this.baseUrl}${endpoint}`, {
        headers: this.getHeaders()
      })
    );
  }

  async login(payload: LoginRequest): Promise<AuthResponse> {
    return await this.post<AuthResponse>('/auth/login', payload);
  }

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    return await this.post<AuthResponse>('/auth/register', payload);
  }

  async getGoogleAuthSuccess(token: string): Promise<AuthResponse> {
    return await this.get<AuthResponse>(`/auth/success?token=${encodeURIComponent(token)}`);
  }

  getGoogleLoginUrl(): string {
    return `${this.baseUrl}/oauth2/authorization/google`;
  }

  async getCurrentUser(): Promise<User> {
    return await this.get<User>('/auth/me');
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.get<User>(`/api/v1/users/email/${encodeURIComponent(email)}`);
    } catch (error: any) {
      if (error?.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async createUser(user: User): Promise<User> {
    return await this.post<User>('/api/v1/users', user);
  }
}