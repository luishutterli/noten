import React, { useState } from "react";
import { auth } from "./firebase";
import { createSubscriptionCheckout } from "./stripe";
import {
    CircularProgress,
    Button,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";

// All features and if they are implemented (should show up)
const allFeatures = {
    Statistiken: false,
    "Teilen von Zeugnissen": false,
    Werbefrei: false,
    "Einfaches Zeugnis erstellen": true,
    "Zeugnis mit Fach Gruppen und Gewichtungen": false,
    "Erstellen von eigenen Fächern": true,
    "Erstellen von Fach Gruppen": false,
    "Alle vorgefertigten Fachstrukturen (Semester)": true,
};

const basicFeatures = ["❌", "❌", "❌", "✅", "❌", "✅", "❌", "❌"];
const standardFeatures = ["✅", "✅", "✅", "✅", "✅", "✅", "✅", "✅"];

const basicEnabled = false;

// TODO: Update with real price ids
const priceIds = {
    basic: "price_1PrRJvP5WX35vts0gbtOi6mR",
    basicYearly: "price_1PrRJvP5WX35vts0qJaRcejw",
    standard: "price_1PtSM3P5WX35vts07fvFJukQ",
    standardYearly: "price_1PrRJrP5WX35vts0Fk8WvHce",
};

function InitSubscription() {
    const [user] = useAuthState(auth);
    const [loading, setLoading] = useState(false);

    const handleSubscription = async (priceId) => {
        if (!user) return;
        setLoading(true);
        try {
            const origin = window.location.origin;
            const url = await createSubscriptionCheckout(
                user.uid,
                priceId,
                origin,
                "promo_1PzM6IP5WX35vts0ivZ0ddHN"
            );
            console.log("Redirecting to: ", url);
            window.location.href = url;
        } catch (error) {
            console.error("Error initiating subscription: ", error);
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <div className="w-full h-full -z-20 bg-gradient-to-b from-indigo-500 to-indigo-800" />
                <div className="flex justify-center items-center h-screen">
                    <CircularProgress />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full -z-20 bg-gradient-to-b from-indigo-500 to-indigo-800">
            <div className="flex flex-col justify-center items-center h-dvh">
                <div className="bg-indigo-400 bg-opacity-50 backdrop-blur-lg rounded-lg m-1 p-5">
                    <h2 className="text-2xl font-bold m-2 mb-4 text-white">
                        Wähle ein Abo
                    </h2>
                    <div className="flex flex-wrap justify-center">
                        {basicEnabled && (
                            <Card className="m-5">
                                <CardContent>
                                    <Typography variant="h5" component="div">
                                        Basic
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary">
                                        {Object.keys(allFeatures).map(
                                            (feature, index) => {
                                                if (!allFeatures[feature])
                                                    return null;
                                                return (
                                                    <span key={feature}>
                                                        {basicFeatures[index]}{" "}
                                                        {feature} <br />
                                                    </span>
                                                );
                                            },
                                        )}
                                    </Typography>
                                    <div className="flex flex-col space-y-2">
                                        <Button
                                            variant="contained"
                                            onClick={() =>
                                                handleSubscription(
                                                    priceIds.basic,
                                                )
                                            }>
                                            <Typography fontWeight="bold">
                                                0.50 CHF / Monat
                                            </Typography>
                                        </Button>
                                        <Button
                                            variant="contained"
                                            style={{
                                                backgroundColor: "#40D151",
                                            }}
                                            onClick={() =>
                                                handleSubscription(
                                                    priceIds.basicYearly,
                                                )
                                            }>
                                            <Typography fontWeight="bold">
                                                5.50 CHF / Jahr
                                            </Typography>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                        <Card className="m-5 transform scale-105">
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    Standard{" "}
                                    <span className="italic">Werbefrei</span>
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary">
                                    {Object.keys(allFeatures).map(
                                        (feature, index) => {
                                            if (!allFeatures[feature])
                                                return null;
                                            return (
                                                <span key={feature}>
                                                    {standardFeatures[index]}{" "}
                                                    {feature} <br />
                                                </span>
                                            );
                                        },
                                    )}
                                </Typography>
                                <div className="flex flex-col space-y-2">
                                    <Button
                                        variant="contained"
                                        onClick={() =>
                                            handleSubscription(
                                                priceIds.standard,
                                            )
                                        }>
                                        <Typography fontWeight="bold">
                                            <span className="line-through text-red-500">
                                                1.25 CHF
                                            </span>{" "}
                                            1.00 CHF / Monat
                                        </Typography>
                                    </Button>
                                    <Button
                                        variant="contained"
                                        style={{ backgroundColor: "#40D151" }}
                                        onClick={() =>
                                            handleSubscription(
                                                priceIds.standardYearly,
                                            )
                                        }>
                                        <Typography fontWeight="bold">
                                            10.00 CHF / Jahr
                                        </Typography>
                                    </Button>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        className="text-red-500">
                                        20% Rabatt bis zum 1. Oktober! 🎉 <br />
                                        Geltend für die ersten 4 Monate.
                                    </Typography>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InitSubscription;
