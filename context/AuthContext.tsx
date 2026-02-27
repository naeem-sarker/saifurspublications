"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/auth';
import Image from 'next/image';
import { syncUserWithDB } from '@/actions/userActions';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const userData = {
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName,
                    photoURL: firebaseUser.photoURL,
                };

                await syncUserWithDB(userData);
                setUser(firebaseUser)
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logOut = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, logOut }}>
            {loading ? <div className="flex h-screen items-center justify-center">
                <Image src={"/saifurs.svg"} width={64} height={64} alt='Saifurs Publications' />
            </div> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);