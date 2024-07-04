import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';

const Header = () => {
    const [user] = useAuthState(auth);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            console.log("Logged out successfully");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <header className="flex justify-between items-center p-4 bg-gray-800 text-white" onMouseLeave={() => setDropdownOpen(false)}>
            <div className="logo">My Site</div>
            <div className="user-section relative">
                {user?.photoURL ? (
                    <img
                        src={user.photoURL}
                        alt="User"
                        className="w-10 h-10 rounded-full cursor-pointer"
                        onClick={toggleDropdown}
                    />
                ) : (
                    <FontAwesomeIcon
                        icon={faUserCircle}
                        className="w-10 h-10 text-white cursor-pointer"
                        onClick={toggleDropdown}
                    />
                )}
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                        <button type="button" className="w-full block px-4 py-2 text-sm text-start text-red-500 hover:bg-gray-200" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;