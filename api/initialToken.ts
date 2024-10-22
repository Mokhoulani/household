import * as SecureStore from 'expo-secure-store';
import { SavingData } from '../types/SavingData';

async function getAccountData(): Promise<SavingData | null> {
  const accountDataString = await SecureStore.getItemAsync('accountData');
  return accountDataString ? JSON.parse(accountDataString) : null;
}

export default async function initializeToken(): Promise<string | undefined> {
  const accountData = await getAccountData();
  console.log('accountData', accountData);
  return accountData?.accessToken;
}
