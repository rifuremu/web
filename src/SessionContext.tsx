import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Session } from './types';

const initialSession: Session = {
  raw_text: '',
  emotion_tag: '',
  need_tag: '',
  concept_tag: '',
  goal_emotion_tag: null,
  valence: 'negative',
};

interface SessionContextType {
  session: Session;
  updateSession: (partial: Partial<Session>) => void;
  resetSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}

export function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session>(initialSession);

  const updateSession = (partial: Partial<Session>) => {
    setSession((prev) => ({ ...prev, ...partial }));
  };

  const resetSession = () => {
    setSession(initialSession);
  };

  return (
    <SessionContext.Provider value={{ session, updateSession, resetSession }}>
      {children}
    </SessionContext.Provider>
  );
}
