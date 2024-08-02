import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { createSubscriptionCheckout } from "../stripe";
import { CircularProgress } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";

function InitSubscription() {
    const [user] = useAuthState(auth);

    useEffect(() => {
        const initiateSubscription = async () => {
            if (!user) return;
            try {
                const origin = window.location.origin;
                const priceId = "price_1Pj34CP5WX35vts0B5Eo4be7";
                const url = await createSubscriptionCheckout(user.uid, priceId, origin);
                console.log("Redirecting to: ", url);
                window.location.href = url;
            } catch (error) {
                console.error("Error initiating subscription: ", error);
            }
        };

        initiateSubscription();
    }, [user]);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <CircularProgress />
        </div>
    );
}

export default InitSubscription;