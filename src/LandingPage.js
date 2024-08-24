import React, { useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const navigate = useNavigate();
  const [showPrices, setShowPrices] = useState(false);

  const togglePrices = () => {
    setShowPrices(!showPrices);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500 to-purple-500 flex flex-col items-center justify-center text-white">
      <header className="w-full py-6 bg-opacity-75 bg-indigo-700">
        <div className="container mx-auto flex justify-between items-center px-6">
          <div className="flex items-end">
            <div className="text-3xl font-bold">Noten Rechner</div>
            <div className="text-sm ml-2 mb-1">ein Tool von Luis Hutterli</div>
          </div>
          <nav>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/auth")}
            >
              Login
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold mb-4">Willkommen bei Noten Rechner</h1>
        <p className="text-xl mb-8">
          Dein ultimatives Werkzeug zur effizienten Verwaltung und Berechnung von Noten.
        </p>
        <p className="text-lg mb-8">
          Mit uns kannst du deine Noten einfach und schnell festhalten, <br />
          Auswerten und Visualisieren lassen. <br />
        </p>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => navigate("/auth")}
        >
          Jetzt starten
        </Button>
        <p className="text-sm mt-4">
          <strong>Hinweis:</strong> Diese Anwendung befindet sich derzeit in der Beta-Phase.
        </p>
        <section className="mt-12">
          <Button
            variant="contained"
            color="secondary"
            onClick={togglePrices}
          >
            Preise anzeigen
          </Button>
          {showPrices && (
            <div className="mt-4 flex flex-col items-center">
              <div className="bg-white text-black p-6 rounded-lg shadow-lg">
                <h3 className="text-2xl font-bold mb-2">Standard</h3>
                <p className="mb-2">Alle Funktionen, Keine Werbung ...</p>
                <p className="mb-2">Monatlich: <b>1.00 Fr.</b></p>
                <p className="mb-2">Jährlich: <b>10.00 Fr.</b></p>
                <Button variant="contained" color="primary" onClick={() => navigate("/auth")}>
                  Starten
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>
      <footer className="w-full py-6 bg-opacity-75 bg-indigo-700">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Noten Rechner von Luis Hutterli. Alle Rechte vorbehalten.</p>
          <div className="mt-4">
            <a href="/impressum" className="text-white mx-2 underline">Impressum</a>
            <a href="/privacy" className="text-white mx-2 underline">Datenschutzrichtlinie</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;