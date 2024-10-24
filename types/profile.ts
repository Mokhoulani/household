import { Account } from '../store/auth/action';
import { Household } from './Household';

export type Profile = {
  id: number;
  name: string;
  isOwner: boolean;
  isRequest: boolean;
  HouseholdId: number | undefined;
  Household: Household;
  Account: Account;
  AccountId: string;
  AvatarId: number;
};

export type CreateProfilePayload = Omit<
  Profile,
  'id' | 'AccountId' | 'Account' | 'Household'
>;
export type ProfileDto = Pick<Profile, 'isOwner' | 'isRequest'>;

export type CreateProfile = Household & ProfileDto;
