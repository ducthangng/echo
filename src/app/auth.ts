import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";

const useSecureCookies = process.env.NODE_ENV === "production";

export const { handlers, signIn } = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID as string,
      clientSecret: process.env.AUTH_GITHUB_SECRET as string,
    }),
  ],

  cookies: {
    sessionToken: {
      // Tên cookie thay đổi tùy theo môi trường HTTP hay HTTPS
      name: useSecureCookies
        ? "__Secure-authjs.session-token"
        : "authjs.session-token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
        // Dấu chấm ở đầu '.ducthang.dev' giúp cookie xài được cho cả subdomain
        domain: useSecureCookies ? ".ducthang.dev" : "localhost",
      },
    },
  },
});
