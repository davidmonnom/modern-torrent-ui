import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const authorizedEmails =
        process.env.NEXTAUTH_AUTHORIZED_EMAILS?.split(",");

      if (user.email && authorizedEmails?.includes(user.email)) {
        return true;
      } else {
        return false;
      }
    },
  },
} as AuthOptions;
