"use client";

import { useEffect } from "react";

// Enregistre le service worker cote client pour rendre l'app installable.
export function RegisterServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Installation impossible (navigateur non compatible) : on ignore.
      });
    }
  }, []);

  return null;
}
