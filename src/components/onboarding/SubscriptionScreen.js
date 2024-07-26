import React from 'react';
import PropTypes from 'prop-types';

const SubscriptionScreen = ({ onNext }) => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 text-center">
                <h2 className="text-3xl font-bold mb-6">Dein Abo</h2>
                <div className="mb-4">
                    <div className="bg-gray-200 p-4 rounded-lg mb-4">
                        <h3 className="text-xl font-bold">Standard</h3>
                        <p className="text-gray-600">Alle aktuellen & die meisten neuen Features.</p>
                        <p className="text-gray-700 font-semibold">2.50 CHF/Monat</p>
                    </div>
                    <div className="bg-gray-200 p-4 rounded-lg mb-4">
                        <h3 className="text-xl font-bold">Standard Semester</h3>
                        <p className="text-gray-600">Alle aktuellen & die meisten neuen Features.</p>
                        <p className="text-gray-700 font-semibold">15 CHF/Semester *</p>
                    </div>
                </div>
                <div className="text-sm text-left">
                    <p className="text-gray-600">Du kannst dein Abo jederzeit kündigen.</p>
                    <p className="text-gray-600">* Ein Semester gilt jeweils 6 Monate.</p>
                </div>
                <button onClick={onNext} className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Weiter
                </button>
            </div>
        </div>
    );
};

SubscriptionScreen.propTypes = {
    onNext: PropTypes.func.isRequired,
};


export default SubscriptionScreen;