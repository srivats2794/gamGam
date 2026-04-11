import { UserProfile } from '../types/user';
import { mockUser, mockHasCompletedOnboarding } from '../mock/user.mock';

let _profile: UserProfile = { ...mockUser };
let _hasCompletedOnboarding = mockHasCompletedOnboarding;

export async function getProfile(): Promise<UserProfile> {
  return { ..._profile };
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  _profile = { ...profile };
  _hasCompletedOnboarding = true;
}

export async function hasCompletedOnboarding(): Promise<boolean> {
  return _hasCompletedOnboarding;
}
