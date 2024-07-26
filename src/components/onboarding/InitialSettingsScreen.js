import React from "react";

const InitialSettingsScreen = ({ onNext }) => {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="w-full max-w-md bg-white shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 text-center">
                <h2 className="text-3xl font-bold mb-6">Deine Einstellungen</h2>
                <div className="mb-4">
                    <div className="bg-gray-200 p-4 rounded-lg mb-4">
                        <h3 className="text-xl font-bold">Klassenstuffe</h3>
                        <p className="text-gray-600">Wähle einer der fertigen Klassen-Konfigurationen:</p>
                        <select className="w-full rounded-lg p-2 mt-2">
                            <option>2i HS</option>
                            <option>2i FS</option>
                        </select>
                    </div>
                </div>
                <button onClick={onNext} className="mt-6 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                    Weiter
                </button>
            </div>
        </div>
    );
}

export default InitialSettingsScreen;