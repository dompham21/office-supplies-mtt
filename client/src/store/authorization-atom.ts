import { atom } from 'jotai';
import Cookies from 'js-cookie';
import { AUTH_CRED } from '../utils/constants'

export function checkIsLoggedIn() {
  const token = Cookies.get(AUTH_CRED);
  if (!token) return false;
  return true;
}
export const authorizationAtom = atom(checkIsLoggedIn());
