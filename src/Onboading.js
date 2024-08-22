import React, { useCallback, useEffect, useState } from "react";
import { auth, firestore, getUserClaims } from "./firebase";
import { settings } from "./settings"; 
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Typography } from "@mui/material";
import SimpleHalftermEditorCard from "./components/SimpleHalftermEditorCard";

function Onboarding() {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(true);
    const [customClaims, setCustomClaims] = useState(null);
    const [halfterms, setHalfterms] = useState([]);
    const [selectedHalfterm, setSelectedHalfterm] = useState(null);
    const [showEditorCard, setShowEditorCard] = useState(false);
    const navigate = useNavigate();

    // Fetching function
    const fetchCustomClaims = useCallback(async () => {
        if (!user) return;
        const claims = await getUserClaims();
        console.log("Claims:", claims);
        setCustomClaims(claims);
        setLoading(false);
    }, [user]);
    
    const fetchHalfterms = useCallback(async () => {
        try {
            const q = query(collection(firestore, "subjects"), where("premade", "==", true),where("type", "==", "halfterm"));
            const querySnapshot = await getDocs(q);
            const halftermsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setHalfterms(halftermsData);
            setLoading(false);
            console.log("Fetched halfterms:", halftermsData.length);
        } catch (error) {
            console.error("Error fetching halfterms: ", error);
        }
    }, []);
    
    // Fetch data
    useEffect(() => {
        setLoading(true);
        fetchCustomClaims();
    }, [user, fetchCustomClaims]);

    useEffect(() => {
        fetchHalfterms();
    }, [fetchHalfterms]);

    const handleMadeHalfterm = async () => {
        if (!selectedHalfterm) return;
        settings.halfterm = selectedHalfterm;
        setLoading(true);
        await new Promise(r => setTimeout(r, 100));
        navigate("/");
    };

    const handleNewHalfterm = async (name) => {
        settings.halfterm = name;
        setLoading(true);
        await new Promise(r => setTimeout(r, 100));
        navigate("/");
    };



    if (loading || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    const isBasicSubscription = customClaims?.stripeRole === "basic";

    return (
        <div className="w-full h-full -z-20 bg-gradient-to-b from-indigo-500 to-indigo-800">
            {showEditorCard && (
                <div className="backdrop">
                    <SimpleHalftermEditorCard onCancel={() => setShowEditorCard(false)} user={user} handle={handleNewHalfterm} />
                </div>
            )}
            <div className="flex flex-col justify-center items-center h-dvh">
                <div className="bg-indigo-400 bg-opacity-50 backdrop-blur-lg rounded-lg m-1 p-5">
                    <h2 className="text-2xl font-bold m-2 mb-4 text-white">Welche Fächer?</h2>
                    <div className="flex flex-wrap justify-center">
                        <div className={`bg-white bg-opacity-75 rounded-lg m-2 p-4 w-80 flex flex-col justify-between ${isBasicSubscription ? 'opacity-50' : ''}`}>
                            <div className="mb-2">
                                <h3 className="text-xl font-semibold mb-2">Wähle eine vorgefertigte Fachstruktur</h3>
                                <p className="text-sm mb-4">Wähle eines der von uns gefertigten Fachstrukturen.</p>
                                <select className="border border-gray-300 rounded-md p-2" defaultValue="d" onChange={(e) => setSelectedHalfterm(e.target.value)} disabled={isBasicSubscription}>
                                    <option value="d" disabled>Fachstruktur / Semester</option>
                                    {halfterms.map(halfterm => (
                                        <option key={halfterm.id} value={halfterm.name}>{halfterm.name}</option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                variant="contained"
                                onClick={handleMadeHalfterm}
                                disabled={isBasicSubscription}>
                                <Typography fontWeight="bold">
                                    Fachstruktur wählen
                                </Typography>
                            </Button>
                        </div>
                        <div className="bg-white bg-opacity-75 rounded-lg m-2 p-4 w-80 flex flex-col justify-between">
                            <div className="mb-2">
                                <h3 className="text-xl font-semibold mb-2">Erstelle deine eigene Fachstruktur</h3>
                                <p className="text-sm mb-4">Stelle dir deine Fächer selbst zusammen.</p>
                            </div>
                            <Button
                                variant="contained"
                                disabled={false}
                                onClick={() => setShowEditorCard(true)}>
                                <Typography fontWeight="bold">
                                    Fachstruktur erstellen
                                </Typography>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Onboarding;