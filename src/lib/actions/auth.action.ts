"use server"; 

import { db, auth } from "../../../firebase/admin";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    const userRecord = await db.collection('users').doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: 'Looks like user already exists. Please sign in instead!',
      };
    }

    await db.collection('users').doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: 'Your account was created successfully. Please sign in!',
    };
  } catch (e: any) {
    console.error('Error creating a user for you.', e);

    if (e.code === 'auth/email-already-exists') {
      return {
        success: false,
        message: 'This email is already linked to an account.',
      };
    }

    return {
      success: false,
      message: 'Failed to create an account. Please refresh the page and try again.',
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: 'User does not exist. Please create an account instead.',
      };
    }

    await setSessionCookie(idToken);
    return NextResponse.redirect('/dashboard'); // Add a success message or additional info if needed
  } catch (e) {
    console.error('Sign-in error', e);
    return {
      success: false,
      message: 'Failed to sign in. Please try again.',
    };
  }
}

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  try {
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: ONE_WEEK * 1000,
    });

    console.log('Setting session cookie:', sessionCookie);

    cookieStore.set('session', sessionCookie, {
      maxAge: ONE_WEEK,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });
  } catch (e) {
    console.error('Error setting session cookie', e);
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session')?.value;

  if (!sessionCookie) return null;

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    const UserRecord = await db.collection('users').doc(decodedClaims.uid).get();

    if (!UserRecord.exists) return null;

    return {
      ...UserRecord.data(),
      id: UserRecord.id,
    } as User;
  } catch (e) {
    console.error('Error verifying session cookie', e);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();
  return !!user;
}

// ** Sign-out Logic: Clear session cookie and reset user state **
export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('session', { path: '/' });
}

export async function signOut() {
  try {
    await clearSessionCookie(); // Clear the session cookie on sign-out
    return {
      success: true,
      message: 'Successfully signed out!',
    };
  } catch (e) {
    console.error('Error during sign-out', e);
    return {
      success: false,
      message: 'Failed to sign out. Please try again.',
    };
  }
}


