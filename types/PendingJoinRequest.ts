import { Profile } from './profile';

export interface PendingJoinRequest {
  id: number;
  householdId: number;
  accountId: string;
  name: string;
  requestedAt: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  acceptedAt?: string;
  rejectedAt?: string;
  profile: Profile;
}

export type CreateJoinRequestPayload = Pick<
  PendingJoinRequest,
  'message' | 'householdId' | 'profile'
>;

export type AcceptJoinRequestPayload = Pick<
  PendingJoinRequest,
  'householdId' | 'accountId'
>;

export type AcceptJoinRequestResponse = {
  householdId: number;
  profile: Profile;
  requestedAt: string;
};

export type RejectJoinRequestPayload = Pick<
  PendingJoinRequest,
  'householdId' | 'accountId'
>;

export type RejectJoinRequestResponse = Pick<
  PendingJoinRequest,
  'householdId' | 'accountId' | 'rejectedAt' | 'status' | 'id'
>;
