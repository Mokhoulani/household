import { Account } from '../store/auth/action';

export type SavingData = {
  accessToken: string;
  refreshToken: string;
  account: Account;
  expiresAt: number;
};
