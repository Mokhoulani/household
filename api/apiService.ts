import initializeToken from './initialToken';

const API_URL = 'http://188.151.47.88:5147/api/';

interface ApiError extends Error {
  status: number;
}

class ApiService {
  private token: string | null = null;
  private headers: Headers;

  constructor() {
    this.headers = new Headers({
      'Content-Type': 'application/json',
    });
  }

  async initialize(): Promise<void> {
    const accessToken = await initializeToken();
    this.setAuthToken(accessToken || null);
  }

  private setAuthToken(token: string | null): void {
    this.token = token;
    if (token) {
      this.headers.set('Authorization', `Bearer ${token}`);
    } else {
      this.headers.delete('Authorization');
    }
  }

  private async request<T>(method: string, endpoint: string, body?: object): Promise<T> {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers: this.headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = new Error(`HTTP error! status: ${response.status}`) as ApiError;
      error.status = response.status;
      throw error;
    }

    const data = (await response.json()) as T;
    return data;
  }

  async post<T>(endpoint: string, body: object): Promise<T> {
    return this.request<T>('POST', endpoint, body);
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  }

  async put<T>(endpoint: string, body: object): Promise<T> {
    return this.request<T>('PUT', endpoint, body);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>('DELETE', endpoint);
  }
}

const apiService = new ApiService();
export default apiService;

export async function initializeApp() {
  await apiService.initialize();
}