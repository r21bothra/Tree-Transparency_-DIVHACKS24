import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  signInWithPopup,
  sendSignInLinkToEmail,
  GoogleAuthProvider,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import { auth, firestore } from "./firebase.js";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { useUserStore } from "@/store/user.js";

// import { collection, addDoc } from "firebase/firestore";

const UserContext = createContext({});

export const useUserContext = () => useContext(UserContext);

export const UserContextProvider = ({ children }) => {
  const provider = new GoogleAuthProvider();

  const { userStore, setUser: setUserStore } = useUserStore();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState();
  const [error, setError] = useState();
  const [emailSent, setEmailSent] = useState(false);
  const [readyToRedirect, setReadyToRedirect] = useState(false);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (res) => {
      res ? setUser(res) : setUser(null);
      setError();
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    signInWithPopup(auth, provider)
      .then(async (result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;

        // The signed-in user info.
        const loggedUser = result.user;

        let data = {
          id: loggedUser.id,
          name: loggedUser.displayName,
          email: loggedUser.email,
          photoURL: loggedUser.photoURL,
          createdAt: loggedUser.metadata.createdAt,
          creationDate: Timestamp.fromDate(
            new Date(loggedUser.metadata.creationTime)
          ),
          lastLogin: Timestamp.fromDate(
            new Date(loggedUser.metadata.lastSignInTime)
          ),
        };

        try {
          // Add the login data to the database
          const docRef = doc(firestore, "Users", loggedUser.email);
          await setDoc(docRef, data, { merge: true });
          // window.localStorage.setItem("userData", JSON.stringify(data));
          setUserStore(data);
          setUser({ ...data });
        } catch (e) {
          // console.error("Error saving the data: ", e);
        }

        setReadyToRedirect(true);
      })
      .catch((err) => {
        // Handle Errors here.
        const errorCode = err.code;
        const errorMessage = err.message;
        // The email of the user's account used.
        const email = err.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(err);
        // ...
        setError(
          errorCode == "auth/network-request-failed"
            ? "Please check your internet connection"
            : errorMessage
        );
      });
  };

  const passwordLessLogin = (email) => {
    setLoading(true);
    const actionCodeSettings = {
      // URL you want to redirect back to. The domain (www.example.com) for this
      // URL must be in the authorized domains list in the Firebase Console.
      url: "http://localhost:3000/login",
      // This must be true.
      handleCodeInApp: true,
    };

    sendSignInLinkToEmail(auth, email, actionCodeSettings)
      .then(() => {
        // The link was successfully sent. Inform the user.
        // Save the email locally so you don't need to ask the user for it again
        // if they open the link on the same device.
        window.localStorage.setItem("emailForSignIn", email);

        setEmailSent(true);
      })
      .catch((err) => {
        const errorCode = err.code;
        const errorMessage = err.message;
        setError(
          errorCode == "auth/network-request-failed"
            ? "Please check your internet connection"
            : errorMessage
        );
      });
  };

  const handlePasswordlessRedirect = (url) => {
    if (isSignInWithEmailLink(auth, url)) {
      // Additional state parameters can also be passed via URL.
      // This can be used to continue the user's intended action before triggering
      // the sign-in operation.
      // Get the email if available. This should be available if the user completes
      // the flow on the same device where they started it.
      let email = window.localStorage.getItem("emailForSignIn");

      if (!email) {
        // User opened the link on a different device. To prevent session fixation
        // attacks, ask the user to provide the associated email again. For example:
        email = window.prompt("Please provide your email for confirmation");
        // console.log(email);
      }

      // The client SDK will parse the code from the link for you.
      signInWithEmailLink(auth, email, url)
        .then(async (result) => {
          // Clear email from storage.
          // window.localStorage.removeItem('emailForSignIn');
          // You can access the new user via result.user

          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser

          // The signed-in user info.
          const loggedUser = result.user;

          let data = {
            id: loggedUser.id,
            email: loggedUser.email,
            photoURL: loggedUser.photoURL,
            createdAt: loggedUser.metadata.createdAt,
            creationDate: Timestamp.fromDate(
              new Date(loggedUser.metadata.creationTime)
            ),
            lastLogin: Timestamp.fromDate(
              new Date(loggedUser.metadata.lastSignInTime)
            ),
          };

          try {
            // Add the login data to the database
            const docRef = doc(firestore, "Users", loggedUser.email);

            await setDoc(docRef, data, { merge: true });
            // window.localStorage.setItem("userData", JSON.stringify(data));
            setUserStore(user);
            setUser({ data });
          } catch (e) {
            // console.error("Error saving the data: ", e);
          }

          setReadyToRedirect(true);
        })
        .catch((err) => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
          const errorMessage = err.message;
          const errorCode = err.code;
          setError(
            errorCode == "auth/network-request-failed"
              ? "Please check your internet connection"
              : errorMessage
          );
        });
    }
  };

  const changeDisplayName = async (name) => {
    await updateProfile(auth.currentUser, {
      displayName: name,
    }).catch((err) => {
      // An error occurred
      const errorMessage = err.message;
      const errorCode = err.code;
      setError(
        errorCode == "auth/network-request-failed"
          ? "Please check your internet connection"
          : errorMessage
      );
    });
  };

  const logOutUser = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((err) => {
        // An error happened.
        const errorMessage = err.message;
        setError(errorMessage);
      });
  };

  const contextValue = {
    user,
    loading,
    error,
    emailSent,
    readyToRedirect,
    setEmailSent,
    logOutUser,
    loginWithGoogle,
    setError,
    passwordLessLogin,
    handlePasswordlessRedirect,
    changeDisplayName,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};
