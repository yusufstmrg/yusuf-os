import { adminAuth } from '../firebase-admin';
import { cookies } from 'next/headers';

export const auth = {
  getSession: async () => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('firebaseToken')?.value;
      
      if (token) {
        const decodedToken = await adminAuth.verifyIdToken(token);
        return {
          data: {
            session: { id: decodedToken.uid },
            user: { id: decodedToken.uid, name: decodedToken.name || 'User', email: decodedToken.email || '' }
          }
        };
      }
    } catch (e) {
      console.warn("Firebase auth verification failed", e);
    }
    
    // Fallback mock session for local development
    return {
      data: {
        session: { id: "mock-session" },
        user: { id: "00000000-0000-0000-0000-000000000000", name: "Mock User", email: "mock@example.com" }
      }
    };
  }
};
