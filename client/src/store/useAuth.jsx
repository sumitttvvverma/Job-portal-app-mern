import React, { createContext, useState,useEffect, useContext } from 'react';

//1st work
export const AuthContext=createContext();


//2nd for to wrap main component by Provider 
export const AuthProvider=({children})=>{
    const [token, setToken] = useState(localStorage.getItem("token"))
    
    const storeTokenInLS=(serverToken)=>{       //4th ,set the localStore
        setToken(serverToken);                 
        return localStorage.setItem("token",serverToken);   //key-value
    }


   //exlint-disable-next-line react/prop-type
   return ( <AuthContext.Provider value={{storeTokenInLS,token}}>
    {children}
   </AuthContext.Provider> )  //Now import AuthProvider to main file and wrap it by its Provider
}

export const useAuth=()=>{                     //3rd using useContext
    const authContextValue = useContext(AuthContext);
    if(!authContextValue){
        throw new Error("useAuth used outside of the provider")
    }
    return authContextValue;
}