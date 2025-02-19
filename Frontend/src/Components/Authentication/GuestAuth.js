/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode"
import { useNavigate } from 'react-router-dom';

const GuestAuth = () => {

    const navigate = useNavigate()

    useEffect(()=>{
        const token = Cookies.get('studioSasvatLoggedInUserToken')
        const userData = Cookies.get('studioSasvatLoggedInUser')

        if (!token && !userData) {
            navigate('/')
        }
    },[])

    return (
        <></>
    )
}

export default GuestAuth