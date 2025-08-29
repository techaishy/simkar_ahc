import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth, { DefaultUser } from "next-auth";

// Extend tipe User, Session, JWT
declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;
  }

  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}

const users = [
  {
    id: "1",
    name: "Admin",
    email: "admin",
    password: "admin123",
    role: "admin",
  },
  {
    id: "2",
    name: "Teknisi",
    email: "teknisi",
    password: "teknisi123",
    role: "teknisi",
  },
  {
    id: "3",
    name: "Manager",
    email: "manager",
    password: "manager123",
    role: "manager",
  },
  {
    id: "4",
    name: "Owner",
    email: "owner",
    password: "owner123",
    role: "owner",
  },
];

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = users.find(
          (u) =>
            u.email === credentials?.email &&
            u.password === credentials?.password
        );

        if (user) {
          const { ...safeUser } = user;
          return safeUser;
        }

        return null;
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) session.user.role = token.role;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  debug: process.env.NODE_ENV === "development",
});

export { handler as GET, handler as POST };
