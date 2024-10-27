import { Account } from '../store/auth/action';
import { Household } from './Household';

export type Profile = {
  id: number;
  name: string;
  isOwner: boolean;
  isRequest: boolean;
  householdId: number | undefined;
  Household: Household | null;
  Account: Account;
  accountId: string;
  avatarId: number;
};

export type CreateProfilePayload = Omit<
  Profile,
  'id' | 'AccountId' | 'Account' | 'Household'
>;
export type ProfileDto = Pick<Profile, 'isOwner' | 'isRequest'>;

export type CreateProfile = Household & ProfileDto;
