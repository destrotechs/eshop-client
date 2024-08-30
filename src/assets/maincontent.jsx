import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from './sidebar';
import Navbar from './navbar';
import { useSelector } from 'react-redux';
const MainContent = ({children})=>{
    const authState = useSelector((state) => state.auth);
return(
    <div className='ml-4 mr-4'>
        {children}
    </div>

)
}
export default MainContent;