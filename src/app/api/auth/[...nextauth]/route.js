import NaverProvider from "next-auth/providers/naver";
import GoogleProvider from "next-auth/providers/google";
import NextAuth from "next-auth";
import db from '@/app/lib/mongodb'

export const authOptions = {
  providers: [
    //네이버
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET
    }),
    //구글
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {

      const client = await db(); // 몽고디비에 저장
      const result = await client.collection('member').find({}).toArray(); // member서버 데이터들 전체를 찾아 (find)

      const filter = result.filter(member=>member.email === user.email); // 멤버서버 안에 email === 방금 로그인 한 애랑 email 같냐?
      if(!filter.length){ // 같은 email 한개도 없으면
          await client.collection('member').insertOne({ email:user.email}); // member서버에 새이메일 추가
      }
      return true // 같은 email 있으면 아래쪽 실행
    },
    async redirect({ url, baseUrl }) {
      return url
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