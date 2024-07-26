import React, { useState } from 'react';
import SubscriptionScreen from './SubscriptionScreen';
import "../AuthForm.css";
import InitialSettingsScreen from './InitialSettingsScreen';
import { useNavigate } from 'react-router-dom';

const Onboarding = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    const next = () => {
        setCurrentStep(currentStep + 1);
    };

    return (
        <div>
            {currentStep === 0 && <SubscriptionScreen onNext={next} />}
            {currentStep === 1 && <InitialSettingsScreen onNext={next} />}
            {currentStep === 2 && navigate("/")}
        </div>
    );
};

export default Onboarding;