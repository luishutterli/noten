import React, { useState, useEffect } from "react";
import { Button, Snackbar } from "@mui/material";

const CookieConsent = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setOpen(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      message={
        <span>
          Wir verwenden Cookies, um unsere Website zu verbessern. Durch deinen Besuch stimmst du zu.{" "}
          <a href="/privacy" style={{ color: "#fff", textDecoration: "underline" }}> Mehr erfahren</a>
        </span>
      }
      action={
        <Button color="secondary" size="small" onClick={handleAccept}>
          Zustimmen
        </Button>
      }
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    />
  );
};

export default CookieConsent;