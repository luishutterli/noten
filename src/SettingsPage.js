import React, { useState, useCallback, useEffect } from "react";
import { auth, firestore, getUserClaims } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { loadSettings, settings } from "./settings";
import { CircularProgress } from "@mui/material";

function HalftermSelection({ predefinedHalfterms, initialHalfterm, onSave }) {
    const [selectedHalfterm, setSelectedHalfterm] = useState(
        initialHalfterm || "",
    );
    const [newHalfterm, setNewHalfterm] = useState("");

    const handleSave = () => {
        if (newHalfterm) {
        } else {
            if (selectedHalfterm === "") return;
            onSave(selectedHalfterm);
        }
    };

    return (
      <div className="halfterm-selection p-4 bg-white shadow-md rounded-md">
        <h2 className="text-xl font-bold mb-4">
          Wähle oder erstelle ein neues Semester
        </h2>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Semester</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={selectedHalfterm}
            onChange={(e) => setSelectedHalfterm(e.target.value)}
          >
            <option value="">Wähle ein Semester</option>
            {predefinedHalfterms.map((halfterm) => {
              const displayedName = halfterm.startsWith("um_")
                ? halfterm.substring(3)
                : halfterm;
              return (
                <option key={halfterm} value={halfterm}>
                  {displayedName}
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-4 bg-gray-200 opacity-50 p-2 rounded-md">
          <label className="block text-gray-700 mb-2">Oder erstelle ein neues:</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter new halfterm"
            value={newHalfterm}
            onChange={(e) => setNewHalfterm(e.target.value)}
            disabled
          />
        </div>
        <button
          className="w-full bg-blue-500 text-white p-2 rounded-md"
          onClick={handleSave}
          type="button"
        >
          Speichern
        </button>
      </div>
    );
}

function SettingsPage() {
    const [user] = useAuthState(auth);

    const [preMadeHalfterms, setPreMadeHalfterms] = useState([]);
    const [userHalfterms, setUserHalfterms] = useState([]);

    const [customClaims, setCustomClaims] = useState(null);
    const [loadingClaims, setLoadingClaims] = useState(true);
    const [loadingSettings, setLoadingSettings] = useState(true);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // User claims
    const fetchCustomClaims = useCallback(async () => {
        if (!user) return;
        setLoadingClaims(true);
        const claims = await getUserClaims();
        console.log("Claims:", claims);

        if (!claims.stripeRole) {
            navigate("/");
            return;
        }

        setCustomClaims(claims);
        setLoadingClaims(false);
    }, [user, navigate]);

    useEffect(() => {
        fetchCustomClaims();
    }, [fetchCustomClaims]);

    // Settings
    const checkSettings = useCallback(async () => {
        if (!user?.emailVerified) return;
        await loadSettings();
        if (settings.halfterm !== undefined) {
            console.log("Settings loaded:", settings);

            if (settings.halfterm === null) {
                navigate("/onboarding");
            }
            setLoadingSettings(false);
        }
    }, [navigate, user]);

    useEffect(() => {
        checkSettings();
    }, [checkSettings]);

    const fetchPreMadeHalfterms = useCallback(async () => {
        try {
            const q = query(
                collection(firestore, "subjects"),
                where("premade", "==", true),
                where("type", "==", "halfterm"),
            );
            const querySnapshot = await getDocs(q);
            const halftermsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setPreMadeHalfterms(halftermsData);
            setLoading(false);
            console.log("Fetched halfterms:", halftermsData.length);
        } catch (error) {
            console.error("Error fetching halfterms: ", error);
        }
    }, []);

    const fetchUserHalfterms = useCallback(async () => {
        setLoading(true);
        try {
            const q = query(
                collection(firestore, "subjects"),
                where("uid", "==", user.uid),
                where("type", "==", "halfterm"),
                where("premade", "==", false),
            );
            const querySnapshot = await getDocs(q);
            const halftermsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setUserHalfterms(halftermsData);
            setLoading(false);
            console.log("Fetched halfterms:", halftermsData.length);
        } catch (error) {
            console.error("Error fetching halfterms: ", error);
        }
    }, [user]);

    useEffect(() => {
        fetchPreMadeHalfterms();
        fetchUserHalfterms();
    }, [fetchPreMadeHalfterms, fetchUserHalfterms]);

    if (!user || loadingClaims || loadingSettings || loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <CircularProgress />
            </div>
        );
    }

    return (
        <div className="settings-page p-4">
            <h1 className="text-2xl font-bold mb-4">Einstellungen</h1>
            <HalftermSelection
                predefinedHalfterms={preMadeHalfterms
                    .concat(userHalfterms)
                    .map((halfterm) => halfterm.name)}
                initialHalfterm={settings.halfterm}
                onSave={(halfterm) => {
                    settings.halfterm = halfterm;
                }}
            />
        </div>
    );
}

export default SettingsPage;
