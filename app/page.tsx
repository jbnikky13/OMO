"use client";
import { useMemo, useState } from "react";

type Player={name:string;education:string;cash:number;energy:number;happiness:number;day:number;income:number;job:string;home:string;rent:number;food:number;data:number;transport:number;skills:number;reputation:number;relationships:number;business:string|null};
type Action={label:string;run:()=>void};

const starts={Graduate:{cash:150000,job:"Unemployed",income:0},Hustler:{cash:80000,job:"Freelancer",income:25000},"Family Support":{cash:200000,job:"Unemployed",income:0},Entrepreneur:{cash:100000,job:"Small trader",income:35000}};
const jobs=[["Sales representative",18000,18],["Customer support",22000,20],["Junior developer",35000,24],["Pharmacy assistant",24000,20],["Private tutor",16000,16],["Retail assistant",14000,15]];
const homes=[["Family home",0,0],["Shared apartment",8500,10],["Self-contained",18000,16],["1-bedroom",30000,20]];
const events=[
 ["Your data finished.","You buy another bundle.",-4500,0,-3],
 ["A friend needs help.","You lend them ₦10,000.",-10000,0,5],
 ["Transport fare increased.","Getting around costs more today.",-3000,-5,-2],
 ["Small win!","A client sends you a surprise tip.",12000,0,8],
 ["Power outage.","You spend on a quick alternative.",-3500,-2,-4],
 ["Someone recommends you.","A new contact could become useful.",0,0,6]
] as const;

const money=(n:number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN",maximumFractionDigits:0}).format(n);

export default function Home(){
 const[player,setPlayer]=useState<Player|null>(null);const[name,setName]=useState("");const[education,setEducation]=useState("Bachelor's");const[start,setStart]=useState<keyof typeof starts>("Graduate");const[log,setLog]=useState<string[]>([]);const[message,setMessage]=useState("");
 const begin=()=>{const s=starts[start];setPlayer({name:name.trim()||"Player",education,cash:s.cash,energy:82,happiness:72,day:1,income:s.income,job:s.job,home:"Family home",rent:0,food:0,data:0,transport:0,skills:25,reputation:50,relationships:20,business:start==="Entrepreneur"?"Small trader":null});setLog(["You arrived in Lagos with a plan."]);setMessage("Monday morning. Your life starts now.");};
 const update=(changes:Partial<Player>,text:string,nextMessage?:string)=>{if(!player)return;const p={...player,...changes,day:player.day+1};setPlayer(p);setLog(l=>[text,...l].slice(0,7));setMessage(nextMessage||"Day "+p.day+". What next?");};
 const work=()=>{if(!player)return;const j=jobs.find(x=>x[0]===player.job);if(j)update({cash:player.cash+Number(j[1]),energy:Math.max(0,player.energy-Number(j[2])),happiness:Math.max(0,player.happiness-2),skills:Math.min(100,player.skills+2),income:player.income+Number(j[1])},`You worked as ${j[0]} and earned ${money(Number(j[1]))}.`);else update({cash:player.cash+5000,energy:Math.max(0,player.energy-12),skills:Math.min(100,player.skills+1)},"You found a small paid gig and earned ₦5,000.");};
 const event=()=>{if(!player)return;const e=events[Math.floor(Math.random()*events.length)];update({cash:Math.max(0,player.cash+e[2]),energy:Math.max(0,Math.min(100,player.energy+e[3])),happiness:Math.max(0,Math.min(100,player.happiness+e[4]))},e[0]+" "+e[1]);};
 const rest=()=>update({cash:Math.max(0,player!.cash-1500),energy:Math.min(100,player!.energy+28),happiness:Math.min(100,player!.happiness+8)},"You stayed home, ate and rested.");
 const eat=()=>update({cash:Math.max(0,player!.cash-2500),energy:Math.min(100,player!.energy+14),happiness:Math.min(100,player!.happiness+3),food:player!.food+1},"You bought food and took care of yourself.");
 const move=(h:string,r:number)=>{if(!player||player.cash<r*4)return setMessage("You need at least four weeks of rent to move here.");setPlayer({...player,home:h,rent:r,cash:player.cash-r*4});setMessage(`You moved into a ${h}. Four weeks of rent are covered.`);setLog(l=>[`Housing changed to ${h}.`,...l].slice(0,7));};
 const apply=(j:string,pay:number)=>{if(!player)return;setPlayer({...player,job:j,income:pay,reputation:Math.min(100,player.reputation+3)});setMessage(`You got the ${j} job. Salary: ${money(pay)} per work cycle.`);setLog(l=>[`New job: ${j}.`,...l].slice(0,7));};
 const business=()=>{if(!player)return;if(player.business)return setMessage("You already run a small business. Keep growing it.");if(player.cash<50000)return setMessage("You need ₦50,000 to start the first small business.");setPlayer({...player,cash:player.cash-50000,business:"Food & provisions",reputation:Math.min(100,player.reputation+5)});setMessage("You started a small food & provisions business.");setLog(l=>["You started your first business.",...l].slice(0,7));};
 const weekly=()=>{if(!player)return;const upkeep=player.rent+9000+3500;const salary=player.income;const businessIncome=player.business?25000:0;const cash=Math.max(0,player.cash+salary+businessIncome-upkeep);setPlayer({...player,day:1,cash});setLog(l=>[`Week settled: +${money(salary+businessIncome-upkeep)} net cash.`,...l].slice(0,7));setMessage("Week 2 begins. Bills are paid. Make your next move.");};

 if(!player)return <main className="shell"><section className="game panel"><div className="eyebrow">OMO • LIFE NO GET MANUAL</div><h1>Start your life.</h1><p className="intro">Choose where you begin. Your decisions will shape your money, skills, relationships and stability.</p><label>Name<input value={name} onChange={e=>setName(e.target.value)} placeholder="Your name"/></label><label>Education<select value={education} onChange={e=>setEducation(e.target.value)}><option>Secondary</option><option>OND/HND</option><option>Bachelor's</option><option>Master's</option></select></label><label>Starting situation<select value={start} onChange={e=>setStart(e.target.value as keyof typeof starts)}>{Object.keys(starts).map(x=><option key={x}>{x}</option>)}</select></label><button className="primary wide" onClick={begin}>START LIFE →</button></section></main>;

 const jobActions:Action[]=jobs.map(j=>({label:`Apply: ${j[0]} • ${money(Number(j[1]))}`,run:()=>apply(j[0],Number(j[1]))}));
 const homeActions:Action[]=homes.map(h=>({label:`Move: ${h[0]} ${h[1]?money(Number(h[1]))+"/week":"Free"}`,run:()=>move(h[0],Number(h[1]))}));

 return <main className="shell"><section className="game"><header><div><div className="eyebrow">OMO</div><h1>{player.name}</h1><span className="muted">Lagos • Day {Math.min(player.day,7)} • {player.job}</span></div><div className="cash">{money(player.cash)}</div></header>
 <div className="meters"><div><span>⚡ Energy</span><b>{player.energy}%</b><i><em style={{width:player.energy+"%"}}/></i></div><div><span>❤️ Happiness</span><b>{player.happiness}%</b><i><em style={{width:player.happiness+"%"}}/></i></div></div>
 <div className="grid"><div className="stat"><small>🏠 HOME</small><strong>{player.home}</strong></div><div className="stat"><small>🧠 SKILLS</small><strong>{player.skills}%</strong></div><div className="stat"><small>🤝 NETWORK</small><strong>{player.relationships}%</strong></div><div className="stat"><small>⭐ REPUTATION</small><strong>{player.reputation}%</strong></div></div>
 <div className="message">{message}</div>
 <h3>What will you do?</h3><div className="actions"><button onClick={work}>💼 WORK</button><button onClick={event}>🎲 EVENT</button><button onClick={eat}>🍲 EAT</button><button onClick={rest}>🛏️ REST</button><button onClick={()=>setMessage("Job board: choose a job below.")}>📋 JOBS</button><button onClick={business}>🏪 START BUSINESS</button></div>
 <details><summary>📋 Job board</summary>{jobActions.map(a=><button className="listButton" key={a.label} onClick={a.run}>{a.label}</button>)}</details>
 <details><summary>🏠 Housing</summary>{homeActions.map(a=><button className="listButton" key={a.label} onClick={a.run}>{a.label}</button>)}</details>
 <div className="log"><h3>Life log</h3>{log.map((x,i)=><p key={i}>{x}</p>)}</div>
 {player.day>7&&<button className="primary wide" onClick={weekly}>SETTLE WEEK & START NEXT →</button>}
 </section></main>;
}