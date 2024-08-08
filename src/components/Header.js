import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import { createCustomerPortalLink } from "../stripe";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faCog, faSignOutAlt, faCreditCard } from "@fortawesome/free-solid-svg-icons";
import { IconButton, Avatar } from "@mui/material";

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

    const handlePortalLink = async (priceId) => {
        if (!user) return;
        try {
            const origin = window.location.origin;
            const url = await createCustomerPortalLink(origin);
            console.log("Redirecting to: ", url);
            window.location.href = url;
        } catch (error) {
            console.error("Error initiating portal link: ", error);
        }
    };

    return (
        <header className="flex justify-between items-center p-4 bg-gray-800 text-white" onMouseLeave={() => setDropdownOpen(false)}>
            <div className="logo">Noten Rechner</div>
            <div className="user-section relative">
                <IconButton onClick={toggleDropdown} tabIndex={0}>
                    <span className="mr-2 text-white">{user?.displayName}</span>
                    {user?.photoURL ? (
                        <Avatar src={user.photoURL} alt="User" />
                    ) : (
                        <Avatar>
                            <FontAwesomeIcon icon={faUserCircle} />
                        </Avatar>
                    )}
                </IconButton>
                {dropdownOpen && (
                    <div className="absolute right-0 mt-2 py-2 w-48 bg-white rounded-md shadow-xl z-20">
                        <button type="button" className="w-full block px-4 py-2 text-sm text-start text-blue-500 hover:bg-gray-200">
                            <FontAwesomeIcon icon={faCog} className="mr-2" /> Einstellungen
                        </button>
                        <button type="button" className="w-full block px-4 py-2 text-sm text-start text-blue-500 hover:bg-gray-200" onClick={handlePortalLink}>
                            <FontAwesomeIcon icon={faCreditCard} className="mr-2" /> Abonnement
                        </button>
                        <button type="button" className="w-full block px-4 py-2 text-sm text-start text-red-500 hover:bg-gray-200" onClick={handleLogout}>
                            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" /> Ausloggen
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;