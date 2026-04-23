import KakaoProvider from "next-auth/providers/kakao";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";

export const authOptions = {
  providers: [
    //카카오
    KakaoProvider({
        clientId: process.env.KAKAO_CLIENT_ID,
        clientSecret: process.env.KAKAO_CLIENT_SECRET
    }),
    //구글
    GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    async session({ session, user, token }) {
      return session
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      return token
    }
  }
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };