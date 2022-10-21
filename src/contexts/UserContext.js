import userEvent from '@testing-library/user-event';
import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import React, { createContext, useEffect, useState } from 'react';
import app from '../firebase/firebase.init';

const auth = getAuth(app);
export const AuthContext = createContext();

const UserContext = ({ children }) => {
    const googleProvider = new GoogleAuthProvider();

    const [user, setUser] = useState({});

    const [loading, setLoading] = useState(true);

    // 1. create user
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    // 2. update name
    const updateName = (name) => {
        return updateProfile(auth.currentUser, { displayName: name })
    }

    // 3. Verify Email
    const verifyEmail = () => {
        setLoading(true);
        return sendEmailVerification(auth.currentUser)
    }

    // 4. google SignIn/login
    const signinWithGoogle = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider)
    }

    // 5. logout
    const userlogOut = () => {
        return signOut(auth)
    }


    // 6. signin/login with email&password
    const logIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }



    // 7. resetPassword
    const resetPassword=(email)=>{
        return sendPasswordResetEmail(auth, email)
    }


    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        })
        return () => {
            unsubscribe();
        }
    }, [])


    const authInfo = { user, createUser, updateName, verifyEmail, signinWithGoogle, userlogOut, logIn,  resetPassword, loading}


    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default UserContext;