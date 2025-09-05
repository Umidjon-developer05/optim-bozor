import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      phone?: string;
      phone1?: string;
    } & DefaultSession["user"];
    currentUser?: {
      _id: string;
      email: string;
      fullName: string;
      phone?: string;
      phone1?: string;
      role: string;
      [key: string]: any;
    };
    pendingOAuth?: { email?: string | null; fullName?: string | null };
  }

  interface User extends DefaultUser {
    id: string;
    phone?: string;
    phone1?: string;
    role?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    phone?: string;
    phone1?: string;
    pendingOAuth?: { email?: string | null; fullName?: string | null };
  }
}
