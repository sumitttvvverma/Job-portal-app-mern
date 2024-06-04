import React,{ useEffect,useState} from 'react'
import {Navigate} from 'react-router-dom'
import { useAuth } from '../store/useAuth';
import Dashboard from '../pages/Dashboard';

const PrivateRoute = () => {
    const {token}=useAuth();
    const [user, setUser] = useState("");
   
    //for getUser
    const getUser=async()=>{
    try {
        const response = await fetch("http://localhost:6680/api/v1/user/getUser",{
          method: "POST",
          headers:{
            Authorization:`Bearer ${token}`,
        },
        });
        console.log(response);
        
        if(response.ok){
            const Ndata= await response.json();
            console.log("getUser--data",Ndata.data);
            setUser(Ndata.data)
        }else{
            localStorage.clear();
        }
    } catch (error) {
        localStorage.clear()
        console.log(error)
    }
}

useEffect(()=>{
    if(!user){
        getUser();
    }
})

if(token){
    return <Dashboard/>
}else{
    return <Navigate to="/login"/>
}


}

export default PrivateRoute;