"use client";

import { createSession, logoutAction } from '@/actions/authActions';
import { auth } from '@/lib/firebase/firebase-client';
import { onIdTokenChanged, signOut, User } from 'firebase/auth';
import Image from 'next/image';
import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
    user: User | null;
    role: "ADMIN" | "MODERATOR" | "USER" | null;
    logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    role: null,
    logOut: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<"ADMIN" | "CLIENT" | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const idToken = await firebaseUser.getIdToken();

                    const result = await createSession(idToken);

                    if (result.success) {
                        setUser(firebaseUser);
                        setRole(result.role as any);
                    }
                } catch (error) {
                    console.error("Auth sync failed:", error);
                }
            } else {
                setUser(null);
                setRole(null);
                await logoutAction();
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logOut = async () => {
        try {
            setLoading(true);
            await signOut(auth);
            await logoutAction();
            window.location.href = "/";
        } catch (error) {
            console.error("Logout failed:", error);
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, role, logOut }}>
            {loading ? (
                <div className="flex h-screen items-center justify-center bg-white">
                    <div className="animate-pulse">
                        <Image
                            src="/saifurs.svg"
                            width={100}
                            height={100}
                            alt='Saifurs Publications'
                            priority
                        />
                    </div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);