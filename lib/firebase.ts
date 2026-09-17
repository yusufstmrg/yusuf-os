import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

// Clean provider with standard authentication scopes
// (Workspace integrations can request extended scopes on-demand without breaking primary login)
provider.addScope('email');
provider.addScope('profile');
provider.setCustomParameters({ prompt: 'select_account' });

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const allowedEmails = ['yusufbsitumorang@gmail.com'];
      if (user.email && allowedEmails.includes(user.email)) {
        const token = await user.getIdToken();
        document.cookie = `firebaseToken=${token}; path=/; max-age=86400; SameSite=Lax; Secure`;
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken || token);
      } else {
        await auth.signOut();
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    
    // Private OS Restriction: Only allow specific email
    const allowedEmails = ['yusufbsitumorang@gmail.com'];
    if (!result.user.email || !allowedEmails.includes(result.user.email)) {
      await auth.signOut();
      throw new Error("Akses ditolak: Alamat email tidak diizinkan masuk ke Private OS.");
    }

    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (credential?.accessToken) {
      cachedAccessToken = credential.accessToken;
    }

    // Set a cookie so the server knows we're logged in.
    const token = await result.user.getIdToken();
    document.cookie = `firebaseToken=${token}; path=/; max-age=86400; SameSite=Lax; Secure`;

    return { user: result.user, accessToken: cachedAccessToken || token };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
  document.cookie = 'firebaseToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  window.location.href = '/';
};
