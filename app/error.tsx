"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("OMO runtime error:", error);
  }, [error]);

  return (
    <main className="shell">
      <section className="game panel">
        <div className="eyebrow">OMO • SOMETHING HAPPENED</div>
        <h1>Your life hit a glitch.</h1>
        <p className="intro">
          OMO could not render this part of your life. Your saved game is kept in your browser.
        </p>
        <button className="primary wide" onClick={() => reset()}>
          TRY AGAIN →
        </button>
        <button className="primary wide" onClick={() => window.location.reload()}>
          RELOAD GAME →
        </button>
      </section>
    </main>
  );
}
