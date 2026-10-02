"use client";

import { useEffect, useMemo, useState } from "react";

type Choice = {
  title: string;
  text: string;
  cash?: number;
  energy?: number;
  happiness?: number;
  skills?: number;
  reputation?: number;
};

type Save = {
  player?: any;
  actionsLeft?: number;
  week?: number;
  log?: string[];
  version?: number;
};

const CHOICES: Choice[] = [
  { title: "Put in the work", text: "Spend the day building your career or business.", cash: 5000, energy: -18, skills: 4, reputation: 1 },
  { title: "Network", text: "Meet someone who could change your next opportunity.", cash: 3000, energy: -8, happiness: 3, reputation: 4 },
  { title: "Take care of yourself", text: "Slow down, recover and protect your energy.", energy: 10, happiness: 7 }
];

function money(n: number) {
  return new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(n);
}

export default function GameLoop() {
  const [save, setSave] = useState<Save | null>(null);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [notice, setNotice] = useState("");

  const load = () => {
    try {
      const raw = localStorage.getItem("omo-save-v1");
      if (raw) setSave(JSON.parse(raw));
    } catch {}
  };

  useEffect(() => {
    load();
    const onStorage = () => load();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const player = save?.player;
  const actionAvailable = Number(save?.actionsLeft ?? 0) > 0;

  const chapter = useMemo(() => {
    if (!player) return "Before the first move";
    if (player.retired) return "Legacy chapter";
    if (player.age < 28) return "The Foundation";
    if (player.age < 35) return "The Climb";
    if (player.age < 45) return "The Build";
    return "The Legacy";
  }, [player]);

  const applyChoice = (c: Choice) => {
    if (!player || !actionAvailable) {
      setNotice("You need to start your life or settle the week before taking another action.");
      return;
    }

    const next = {
      ...player,
      cash: Math.max(0, player.cash + (c.cash ?? 0)),
      energy: Math.max(0, Math.min(100, player.energy + (c.energy ?? 0))),
      happiness: Math.max(0, Math.min(100, player.happiness + (c.happiness ?? 0))),
      skills: Math.max(0, Math.min(100, player.skills + (c.skills ?? 0))),
      reputation: Math.max(0, Math.min(100, player.reputation + (c.reputation ?? 0))),
      day: Math.min(7, (player.day ?? 1) + 1)
    };

    const nextSave = {
      ...save,
      version: 2,
      player: next,
      actionsLeft: Math.max(0, Number(save?.actionsLeft ?? 0) - 1),
      log: [`🎮 ${c.title}: ${c.text}`, ...(save?.log ?? [])].slice(0, 8)
    };

    localStorage.setItem("omo-save-v1", JSON.stringify(nextSave));
    setSave(nextSave);
    setChoice(null);
    setNotice(c.text);
    window.dispatchEvent(new Event("storage"));
  };

  if (!player) return null;

  return (
    <section className="omo-game-loop" aria-label="Daily game loop">
      <div className="omo-loop-head">
        <div>
          <span className="omo-kicker">CURRENT CHAPTER</span>
          <h2>{chapter}</h2>
          <p>Week {save?.week ?? 1} · Day {player.day ?? 1} · {save?.actionsLeft ?? 0} moves left</p>
        </div>
        <div className="omo-loop-cash">{money(player.cash)}</div>
      </div>

      <div className="omo-story-card">
        <span className="omo-kicker">TODAY'S DECISION</span>
        <h3>{choice ? choice.title : "What will you do with today?"}</h3>
        <p>{choice ? choice.text : "Every move changes your money, energy, skills, relationships or reputation."}</p>

        {!choice ? (
          <div className="omo-choice-grid">
            {CHOICES.map((c) => (
              <button key={c.title} className="omo-choice" onClick={() => setChoice(c)} disabled={!actionAvailable}>
                <strong>{c.title}</strong>
                <span>{c.text}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="omo-confirm">
            <button className="omo-primary" onClick={() => applyChoice(choice)}>Make this move</button>
            <button className="omo-secondary" onClick={() => setChoice(null)}>Choose another</button>
          </div>
        )}

        {notice && <div className="omo-notice">{notice}</div>}
      </div>
    </section>
  );
}
