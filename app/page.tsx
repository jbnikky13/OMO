"use client";
import { useMemo, useState } from "react";

type Player = {
  name: string; education: string; cash: number; energy: number;
  happiness: number; day: number; income: number; job: string;
};

const starts = {
  Graduate: { cash: 150000, job: "Unemployed", income: 0 },
  Hustler: { cash: 80000, job: "Freelancer", income: 25000 },
  "Family Support": { cash: 200000, job: "Unemployed", income: 0 },
  Entrepreneur: { cash: 100000, job: "Small trader", income: 35000 }
};

const jobs = [
  { name: "Sales representative", pay: 18000, energy: 18, education: "Any" },
  { name: "Customer support", pay: 22000, energy: 20, education: "Any" },
  { name: "Junior developer", pay: 35000, energy: 24, education: "Bachelor's" },
  { name: "Pharmacy assistant", pay: 24000, energy: 20, education: "OND/HND" },
  { name: "Private tutor", pay: 16000, energy: 16, education: "Any" }
];

const events = [
  { title: "Your data finished.", text: "You need internet for tomorrow's work.", cash: -4500, energy: 0, happiness: -3 },
  { title: "A friend needs help.", text: "You lend them some money.", cash: -10000, energy: 0, happiness: 5 },
  { title: "Unexpected transport fare hike.", text: "Your usual route costs more today.", cash: -3000, energy: -5, happiness: -2 },
  { title: "Small win!", text: "A client sends you a surprise tip.", cash: 12000, energy: 0, happiness: 8 }
];

export default function Home() {
  const [player, setPlayer] = useState<Player | null>(null);
  const [name, setName] = useState("");
  const [education, setEducation] = useState("Bachelor's");
  const [start, setStart] = useState<keyof typeof starts>("Graduate");
  const [log, setLog] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  const money = useMemo(() => player ? new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", maximumFractionDigits: 0
  }).format(player.cash) : "", [player]);

  function begin() {
    const s = starts[start];
    setPlayer({ name: name.trim() || "Player", education, cash: s.cash, energy: 82,
      happiness: 72, day: 1, income: s.income, job: s.job });
    setLog(["You arrived in Lagos with a plan."]);
    setMessage("Monday morning. What will you do?");
  }

  function advance(text: string, cash: number, energy: number, happiness: number) {
    if (!player) return;
    const nextDay = player.day + 1;
    setPlayer({
      ...player,
      cash: Math.max(0, player.cash + cash),
      energy: Math.max(0, Math.min(100, player.energy + energy)),
      happiness: Math.max(0, Math.min(100, player.happiness + happiness)),
      day: nextDay
    });
    setLog(old => [text, ...old].slice(0, 6));
    setMessage(nextDay > 7 ? "Week 1 complete. Your choices are starting to shape your life." : "Day " + nextDay + ". What next?");
  }

  function work() {
    if (!player) return;
    const job = jobs.find(j => j.name === player.job);
    if (job) {
      advance("You worked as " + player.job + " and earned " + new Intl.NumberFormat("en-NG", {style:"currency",currency:"NGN",maximumFractionDigits:0}).format(job.pay) + ".", job.pay, -job.energy, -2);
    } else {
      advance("You found a small paid gig and earned ₦5,000.", 5000, -12, -1);
    }
  }

  function event() {
    if (!player) return;
    const e = events[Math.floor(Math.random() * events.length)];
    advance(e.title + " " + e.text, e.cash, e.energy, e.happiness);
  }

  function rest() {
    advance("You stayed home, ate, rested and reset your energy.", -1500, 28, 8);
  }

  if (!player) return (
    <main className="shell"><section className="game panel">
      <div className="eyebrow">OMO • LIFE NO GET MANUAL</div>
      <h1>Start your life.</h1>
      <p className="intro">There is no perfect path. Choose where you begin, then make it through your first week in Lagos.</p>
      <label>Name<input value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></label>
      <label>Education<select value={education} onChange={e => setEducation(e.target.value)}>
        <option>Secondary</option><option>OND/HND</option><option>Bachelor's</option><option>Master's</option>
      </select></label>
      <label>Starting situation<select value={start} onChange={e => setStart(e.target.value as keyof typeof starts)}>
        {Object.keys(starts).map(x => <option key={x}>{x}</option>)}
      </select></label>
      <button className="primary wide" onClick={begin}>START LIFE →</button>
    </section></main>
  );

  return <main className="shell"><section className="game">
    <header><div><div className="eyebrow">OMO</div><h1>{player.name}</h1><span className="muted">Lagos • Day {Math.min(player.day, 7)} • {player.job}</span></div><div className="cash">{money}</div></header>
    <div className="meters">
      <div><span>⚡ Energy</span><b>{player.energy}%</b><i><em style={{width: player.energy + "%"}} /></i></div>
      <div><span>❤️ Happiness</span><b>{player.happiness}%</b><i><em style={{width: player.happiness + "%"}} /></i></div>
    </div>
    <div className="message">{message}</div>
    <div className="actions"><button onClick={work}>💼 WORK</button><button onClick={event}>🎲 SEE WHAT HAPPENS</button><button onClick={rest}>🛏️ REST</button></div>
    <div className="log"><h3>Life log</h3>{log.map((x, i) => <p key={i}>{x}</p>)}</div>
    {player.day > 7 && <button className="primary wide" onClick={() => { setPlayer({...player, day: 1}); setLog(["A new week begins."]); setMessage("Monday morning again. Make different choices."); }}>START WEEK 2 →</button>}
  </section></main>;
}