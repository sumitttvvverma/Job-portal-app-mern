import React from 'react'
import {Navigate} from 'react-router-dom'
import { useAuth } from '../store/useAuth'
import { Children } from 'react';

//not used anywhere
const PublicRoute = () => {
    const {token}=useAuth();
    if(token){
        return <Navigate to='/dashboard'/>
    }else{
        return Children
    }
}

export default PublicRoute