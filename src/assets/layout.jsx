import  React   from 'react';
import Navbar from './navbar';
import Sidebar from './sidebar';
import MainContent from './maincontent';
import { logout } from '../auth/authSlice';
import { useSelector, useDispatch } from 'react-redux';
const MainLayout = ({children})=>{
    const dispatch = useDispatch();
    const { isLoggedIn, user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        // Perform any additional logout logic if needed
        dispatch(logout());
    };
    return(
        <div className="bg-gray-100">
            <Navbar isLoggedIn={isLoggedIn} user={user} onLogout={handleLogout}/>
            <MainContent>
            {children}
            </MainContent>
        </div>
        
        
    )
}

export default MainLayout;