import React, {useEffect, useState} from 'react';
import Sidebar from './SideBar';
//import RecentDemands from '../demandas/RecentDemands';
import {jwtDecode} from "jwt-decode";
import {Outlet} from "react-router-dom";

const MainScreen = ({ setAuthenticated }) => {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            try{
                const decode = jwtDecode(token);
                setUserRole(decode.cargo);
            } catch (erro){
                localStorage.removeItem( 'token')
            }
        }

    }, []);


    return (
        <div style={{ display: 'flex' }}>
            <Sidebar setAuthenticated={setAuthenticated} useRole={userRole}/>
            <Outlet context={{ userRole }}/>
        </div>
    );
};

export default MainScreen;
