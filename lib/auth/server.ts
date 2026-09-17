import { adminAuth } from '../firebase-admin';
import { cookies } from 'next/headers';

export const auth = {
  getSession: async () => {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get('firebaseToken')?.value;
      
      if (token) {
        // Owner Direct PIN / Root Session verification
        if (token.startsWith('owner-session-')) {
          return {
            data: {
              session: { id: "yusuf-root-session" },
              user: {
                id: "00000000-0000-0000-0000-000000000000",
                name: "Yusuf B. Situmorang",
                email: "yusufbsitumorang@gmail.com"
              }
            }
          };
        }

        const decodedToken = await adminAuth.verifyIdToken(token);
        
        // Server-side email restriction
        const allowedEmails = ['yusufbsitumorang@gmail.com'];
        if (!decodedToken.email || !allowedEmails.includes(decodedToken.email)) {
          console.warn(`Blocked unauthorized access attempt from: ${decodedToken.email}`);
          return null;
        }

        return {
          data: {
            session: { id: decodedToken.uid },
            user: {
              id: "00000000-0000-0000-0000-000000000000",
              name: decodedToken.name || 'Yusuf B. Situmorang',
              email: decodedToken.email
            }
          }
        };
      }
    } catch (e) {
      console.warn("Firebase auth verification failed", e);
    }
    
    return null;
  }
};
