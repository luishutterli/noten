import React from "react";

function Impressum() {
    const commonStyle = {
        margin: "0 !important",
        padding: "0 !important",
        lineHeight: "1.3 !important"
    };

    return (
        <div>
            <h2 style={{ ...commonStyle, margin: "0 0 15px !important" }}>Verantwortliche Instanz:</h2>
            <p style={commonStyle}>Luis Hutterli</p>
            <p style={commonStyle}>Bärenstrasse 24</p>
            <p style={commonStyle}>8280 Kreuzlingen</p>
            <p style={{ ...commonStyle, margin: "0 0 15px !important" }}>Schweiz</p>
            <p style={{ ...commonStyle, margin: "0 0 15px !important" }}>
                <strong>E-Mail:</strong>
                <a href="mailto:lshutterli@gmail.com">lshutterli@gmail.com</a>
            </p>
            <p style={{ ...commonStyle, margin: "0 0 15px !important" }}>
                <strong>Telefonnummer:</strong> +41 79 874 04 48
            </p>
            <p style={commonStyle}>
                <strong>Vertretungsberechtigte Personen:</strong>
            </p>
            <p style={{ ...commonStyle, margin: "0 0 15px !important" }}>Luis Hutterli</p>
            <p style={{ ...commonStyle, margin: "0 0 15px !important" }}>
                <strong>Name der Firma:</strong> Luis Hutterli
            </p>
            <h3 style={commonStyle}>Haftungsausschluss:</h3>
            <p style={{ ...commonStyle, margin: "0 0 15px !important" }}>Der Verfasser übernimmt keine Verantwortung für die Richtigkeit, Genauigkeit, Aktualität, Zuverlässigkeit und Vollständigkeit der Informationen auf dieser Webseite. Haftungsansprüche gegen den Verfasser wegen Schäden materieller oder immaterieller Natur, die durch den Zugriff, die Nutzung oder Nichtnutzung der veröffentlichten Informationen, durch Missbrauch der Verbindung oder durch technische Störungen entstanden sind, werden ausgeschlossen. Alle Angebote sind freibleibend und unverbindlich. Der Verfasser behält sich ausdrücklich vor, Teile der Seiten oder das gesamte Angebot ohne separate Ankündigung zu verändern, zu ergänzen, zu löschen oder die Veröffentlichung zeitweise oder endgültig einzustellen.</p>
            <h3 style={commonStyle}>Haftungsausschluss für Inhalte und Links:</h3>
            <p style={{ ...commonStyle, margin: "0 0 15px !important" }}>Verweise und Links auf Webseiten Dritter liegen ausserhalb unseres Verantwortungsbereichs. Eine Haftung für solche Webseiten wird vollumfänglich abgelehnt. Der Zugang und die Nutzung solcher Webseiten erfolgen auf eigene Gefahr des Nutzers oder der Nutzerin.</p>
            <h3 style={commonStyle}>Urheberrechtserklärung:</h3>
            <p style={{ ...commonStyle, margin: "0 0 15px !important" }}>
                Das Urheberrecht sowie alle anderen Rechte an den Inhalten, Bildern, Fotos und anderen Dateien auf der Webseite gehören ausschliesslich Luis Hutterli oder den ausdrücklich benannten Rechtsinhabern. Die Gestaltung dieser Angaben erfolgte mit Unterstützung durch den <a href="https://dartera.ch/impressum-generator-schweiz/">dartera Impressum-Generator.</a> Jede Art der Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der Grenzen des Urheberrechts bedürfen der vorherigen schriftlichen Zustimmung des jeweiligen Rechteinhabers.
            </p>
        </div>
    );
}

export default Impressum;