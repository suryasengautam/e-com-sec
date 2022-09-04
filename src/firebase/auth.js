// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth ,createUserWithEmailAndPassword , signInWithEmailAndPassword , signOut, updateProfile,onAuthStateChanged} from "firebase/auth";
import { createContext, useContext, useEffect,useState } from "react";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIavVVoFJIuZu9Uhu0znMoOH1JA7WovTA",
  authDomain: "surya-commerce.firebaseapp.com",
  projectId: "surya-commerce",
  storageBucket: "surya-commerce.appspot.com",
  messagingSenderId: "1060133209955",
  appId: "1:1060133209955:web:7abd61bc507a75bad8b556"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const  AuthContext = createContext()
const AuthProvider = ({children}) => {
    const auth = useProvideAuth()
    return <AuthContext.Provider value = {auth}>
        {children}
    </AuthContext.Provider>
}

function useProvideAuth(){
    const [user,setUser] = useState(null)
    const signUp = (email,password,displayName) => createUserWithEmailAndPassword(auth,email,password).then(({user}) => {
        updateProfile(user,{displayName})
        setUser(user)
        return user

    });
    const signIn = (userName,password) => signInWithEmailAndPassword(auth,userName,password).then(({user}) => {
        setUser(user)
        return user
    })
    const  signOutUser = () => signOut(auth).then(() => setUser(null))

    useEffect(() => {
        const unsubsubscibe = onAuthStateChanged(auth,(user) => {
            user ? setUser(user) : setUser(null)
        })
        return () => unsubsubscibe();
    },[])
    return {
        signIn,signOut : signOutUser,signUp,user
    }

}
export const useAuth = () => useContext(AuthContext)
export default AuthProvider;