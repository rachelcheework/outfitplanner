import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import supabase from "../supabase-client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  userError: string | null;
  isUserLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  useEffect(() => {
    async function getInitialSession() {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        setUserError(error.message);
        setIsUserLoading(false);
        return;
      }

      setSession(data.session);
      setIsUserLoading(false);
    }

    getInitialSession();
    
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const user = session?.user ?? null;

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  
    if (error) {
      setUserError(error.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        userError,
        isUserLoading,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
}