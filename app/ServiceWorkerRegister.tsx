"use client";
import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js?v=20261004", {
          scope: "/",
          updateViaCache: "none",
        });
        await registration.update();
        if (registration.waiting) registration.waiting.postMessage({ type: "SKIP_WAITING" });
      } catch (error) {
        console.error("OMO service worker registration failed:", error);
      }
    };
    register();
  }, []);
  return null;
}