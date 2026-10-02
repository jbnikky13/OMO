"use client";
import dynamic from "next/dynamic";
import "./omo.css";
const Omo3D=dynamic(()=>import("./Omo3D"),{ssr:false});
export default function Home(){return <main className="omo-shell"><header className="omo-header"><div><div className="omo-title">OMO</div><div className="omo-subtitle">Life in Lagos</div></div><div className="omo-badge">3D LIFE SIM</div></header><Omo3D/></main>}