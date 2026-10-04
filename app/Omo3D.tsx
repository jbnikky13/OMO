"use client";
import {useEffect,useRef,useState} from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Obj={id:string;x:number;z:number;sx:number;sz:number;label:string;emoji:string;dur:number;eff:any;cost?:number;pay?:(s:any)=>number;skill?:number;power?:boolean};
const O:Obj[]=[
{id:"bed",x:-4,z:-3,sx:-2.3,sz:-2.2,label:"Sleep",emoji:"🛏️",dur:420,eff:{energy:90,hunger:-12}},
{id:"pc",x:0,z:-4,sx:0,sz:-2.7,label:"Freelance",emoji:"💻",dur:120,eff:{energy:-18,hunger:-10,fun:-10},pay:s=>2500+s.skill*40,skill:2,power:true},
{id:"food",x:4.5,z:-4,sx:4.1,sz:-2.5,label:"Eat jollof ₦800",emoji:"🍲",dur:30,eff:{hunger:45},cost:800},
{id:"shower",x:5,z:.2,sx:4.6,sz:.2,label:"Bathe",emoji:"🚿",dur:25,eff:{hygiene:70}},
{id:"tv",x:-5.5,z:1.5,sx:-3.4,sz:1.5,label:"Watch TV",emoji:"📺",dur:90,eff:{fun:50,energy:-5},power:true},
{id:"phone",x:0,z:3.5,sx:0,sz:2.3,label:"Call friends ₦200",emoji:"📱",dur:45,eff:{social:45,fun:10},cost:200},
{id:"door",x:5.8,z:3.2,sx:4.7,sz:3.2,label:"Hustle by danfo ₦800",emoji:"🚌",dur:480,eff:{energy:-45,hunger:-25,hygiene:-20,fun:-15,social:10},pay:s=>10000+s.skill*60,cost:800,skill:1}
];
const needs=["hunger","energy","hygiene","fun","social"];
const fresh=()=>({t:420,day:1,cash:50000,skill:5,x:0,z:.5,q:[],cur:null,out:0,speed:1,needs:{hunger:80,energy:85,hygiene:80,fun:70,social:60},log:["Your first flat in Lagos. Rent is ₦25,000 every Monday."],over:""});
export default function Omo3D(){
 const host=useRef<HTMLDivElement>(null),[hud,setHud]=useState<any>(fresh());
 useEffect(()=>{
  const el=host.current;if(!el)return;let S:any;try{S=JSON.parse(localStorage.getItem("omo-3d-v4")||"null")||fresh()}catch{S=fresh()}
  const r=new THREE.WebGLRenderer({antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.shadowMap.enabled=true;el.appendChild(r.domElement);
  const scene=new THREE.Scene(),cam=new THREE.PerspectiveCamera(48,1,.1,100);cam.position.set(0,11.5,15.5);cam.lookAt(0,.7,0);
  scene.add(new THREE.AmbientLight(0xffffff,.82));const sun=new THREE.DirectionalLight(0xfff0d0,.95);sun.position.set(-6,12,8);sun.castShadow=true;scene.add(sun);
  const B=(w:number,h:number,d:number)=>new THREE.BoxGeometry(w,h,d);
  const mk=(g:any,c:number,p:[number,number,number],parent:any=scene,o:any={})=>{
    const m=new THREE.Mesh(g,new THREE.MeshStandardMaterial({color:c,roughness:.82,...o}));
    m.position.set(...p);m.castShadow=m.receiveShadow=true;parent.add(m);return m;
  };
  const room=new THREE.Group();scene.add(room);
  mk(B(12.4,.2,10.4),0x704d37,[0,-.1,0],room);
  mk(B(12.6,3,.3),0x2e2848,[0,1.5,-5.15],room);
  mk(B(.3,3,10.4),0x2a2540,[-6.15,1.5,0],room);
  mk(B(.3,3,10.4),0x2a2540,[6.15,1.5,0],room);
  const rug=new THREE.Mesh(new THREE.CircleGeometry(2.2,40),new THREE.MeshStandardMaterial({color:0x8a3d3d,roughness:.9}));
  rug.rotation.x=-Math.PI/2;rug.position.set(0,.02,.8);rug.receiveShadow=true;room.add(rug);

  const loader=new GLTFLoader();
  const groups:any={};
  const hitSize:any={bed:[2.8,2.2,2.2],pc:[2.7,2.2,1.8],food:[1.8,2.8,1.8],shower:[1.8,2.8,1.8],tv:[2.8,2.5,2],phone:[3.2,1.8,2],door:[1.8,3,1.8]};
  const addHit=(o:any)=>{
    const g=new THREE.Group();g.position.set(o.x,0,o.z);
    const [w,h,d]=hitSize[o.id]||[1.8,2,1.8];
    const hit=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
    hit.position.y=h/2;hit.userData.id=o.id;g.add(hit);groups[o.id]=g;scene.add(g);
  };
  const addModel=(file:string,p:[number,number,number],scale:number,rot=0,id?:string)=>{
    loader.load("/game/models/"+file,(gltf)=>{
      const m=gltf.scene;m.position.set(...p);m.scale.setScalar(scale);m.rotation.y=rot;
      m.traverse((child:any)=>{if(child.isMesh){child.castShadow=true;child.receiveShadow=true;if(id)child.userData.id=id;}});
      scene.add(m);
    },undefined,()=>{});
  };
  // Furniture/character from the supplied 3D asset pack.
  addModel("bedDouble.glb",[-4.7,0,-3.95],.29,Math.PI/2,"bed");
  addModel("pillow.glb",[-4.15,1.02,-3.05],.28,.2);
  addModel("desk.glb",[-.9,0,-4.2],.32,0,"pc");
  addModel("chairDesk.glb",[.15,0,-3.05],.28,Math.PI,"pc");
  addModel("laptop.glb",[-.75,1.25,-4.2],.28);
  addModel("kitchenFridge.glb",[4.7,0,-4.65],.25,Math.PI/2,"food");
  addModel("shower.glb",[5,0,.2],.25,0,"shower");
  addModel("cabinetTelevision.glb",[-4.9,0,1.55],.28,Math.PI/2,"tv");
  addModel("televisionModern.glb",[-4.95,1.2,1.55],.26,Math.PI/2,"tv");
  addModel("loungeSofa.glb",[-2.5,0,2.65],.31,Math.PI,"phone");
  addModel("tableCoffee.glb",[0,0,1],.27);
  addModel("sideTable.glb",[-.9,0,2.5],.28);
  addModel("lampRoundFloor.glb",[-1.1,0,3.45],.25);
  addModel("lampRoundTable.glb",[-.85,.7,2.5],.23);
  addModel("pottedPlant.glb",[3.8,0,2.9],.25);
  addModel("bookcaseOpen.glb",[4.55,0,2.15],.26);
  addModel("radio.glb",[1.15,.65,2.45],.23);
  addModel("speakerSmall.glb",[1.8,.25,2.5],.23);
  addModel("doorway.glb",[5.85,0,3.25],.3,Math.PI/2,"door");
  addModel("wallDoorway.glb",[5.9,0,-1.9],.28,Math.PI/2);
  addModel("wallWindow.glb",[2.1,0,-5],.28);
  O.forEach(addHit);

  const bola=new THREE.Group();scene.add(bola);
  loader.load("/game/models/bola.glb",(gltf)=>{
    const m=gltf.scene;m.scale.setScalar(1);m.traverse((child:any)=>{if(child.isMesh){child.castShadow=true;child.receiveShadow=true;}});bola.add(m);
  },undefined,()=>{
    mk(new THREE.CylinderGeometry(.32,.38,.9,10),0xf2b84b,[0,1.25,0],bola);
    mk(new THREE.SphereGeometry(.3,14,12),0x8a5a3c,[0,1.95,0],bola);
  });

  const label=(t:string)=>{
    const c=document.createElement("canvas");c.width=320;c.height=72;
    const x=c.getContext("2d")!;x.fillStyle="#14121ee8";x.fillRect(5,8,310,56);
    x.fillStyle="#f4efe6";x.font="bold 22px sans-serif";x.textAlign="center";x.fillText(t,160,43);
    const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(c),depthTest:false}));
    sp.scale.set(3.2,.72,1);return sp;
  };
  O.forEach(o=>{const l=label(o.emoji+" "+o.label);l.position.set(o.sx,o.id==="door"?3.7:3,o.sz);scene.add(l);});

  const ring=new THREE.Mesh(new THREE.RingGeometry(.55,.75,24),new THREE.MeshBasicMaterial({color:0xf2b84b,transparent:true,opacity:.8}));
  ring.rotation.x=-Math.PI/2;ring.position.y=.04;scene.add(ring);

  const find=(id:string)=>O.find(o=>o.id===id)!;const say=(m:string)=>S.log=[m,...S.log].slice(0,5);const queue=(id:string)=>{if(S.q.length<3)S.q.push(id)};
  const start=()=>{if(!S.q.length)return;const o=find(S.q.shift());if(o.power&&S.out){say("💡 NEPA took light.");return}if(o.cost&&S.cash<o.cost){say("Not enough cash.");return}S.cash-=o.cost||0;S.cur={id:o.id,left:o.dur}};
  const finish=()=>{const o=find(S.cur.id);if(o.pay){const p=o.pay(S);S.cash+=p;say("✅ "+o.label+": earned ₦"+Math.round(p).toLocaleString("en-NG"))}else say("✅ Done: "+o.label);S.skill+=o.skill||0;S.cur=null};
  const tick=()=>{S.t++;if(S.t>=1440){S.t=0;S.day++;if((S.day-1)%7===0){if(S.cash>=25000){S.cash-=25000;say("🏠 Rent paid: ₦25,000")}else S.over="Evicted. You could not pay ₦25,000 rent."}}const sleep=S.cur?.id==="bed";S.needs.hunger-=sleep?.02:.07;if(!sleep)S.needs.energy-=.05;S.needs.hygiene-=.045;S.needs.fun-=.06;S.needs.social-=.04;if(S.cur){const o=find(S.cur.id);Object.keys(o.eff).forEach(k=>S.needs[k]+=o.eff[k]/o.dur);if(--S.cur.left<=0)finish()}needs.forEach(k=>S.needs[k]=Math.max(0,Math.min(100,S.needs[k])));if(S.out>0&&--S.out===0)say("💡 Light is back.");else if(!S.out&&Math.random()<.0003){S.out=180;say("💡 NEPA took light!");}};
  const walk=(dt:number)=>{if(S.cur||!S.q.length)return;const o=find(S.q[0]),dx=o.sx-S.x,dz=o.sz-S.z,d=Math.hypot(dx,dz);if(d<.15){start();return}const sp=Math.min(d,4.2*dt);S.x+=dx/d*sp;S.z+=dz/d*sp;bola.rotation.y=Math.atan2(dx,dz)};
  const pointer=(e:PointerEvent)=>{const q=r.domElement.getBoundingClientRect(),p=new THREE.Vector2((e.clientX-q.left)/q.width*2-1,-(e.clientY-q.top)/q.height*2+1),ray=new THREE.Raycaster();ray.setFromCamera(p,cam);const hit=ray.intersectObjects(Object.values(groups),true)[0];if(hit?.object.userData.id)queue(hit.object.userData.id)};
  r.domElement.addEventListener("pointerdown",pointer);
  const resize=()=>{const w=el.clientWidth||360,h=Math.round(w*.92);r.setSize(w,h);cam.aspect=w/h;cam.updateProjectionMatrix()};resize();window.addEventListener("resize",resize);
  let last=performance.now(),acc=0,raf=0;const loop=(now:number)=>{const dt=Math.min(.1,(now-last)/1000);last=now;if(!S.over&&S.speed){acc+=dt*10*S.speed;while(acc>=1){acc--;tick()};walk(dt*S.speed)}bola.visible=S.cur?.id!=="door";bola.position.set(S.x,0,S.z);if(S.cur?.id==="bed"){bola.position.set(-2.3,1.15,-1.1);bola.rotation.x=-Math.PI/2}else bola.rotation.x=0;const target=S.cur?find(S.cur.id):S.q.length?find(S.q[0]):null;
  cam.lookAt(S.x*.12,.7,S.z*.12);ring.visible=!!target;if(target)ring.position.set(target.sx,.04,target.sz);const hour=S.t/60; const night=hour<6||hour>=21; const evening=hour>=18&&hour<21; scene.background=new THREE.Color(night?0x070817:evening?0x17162f:0x293b52);r.render(scene,cam);setHud({...S,needs:{...S.needs},log:[...S.log]});raf=requestAnimationFrame(loop)};raf=requestAnimationFrame(loop);
  const save=setInterval(()=>{try{localStorage.setItem("omo-3d-v4",JSON.stringify(S))}catch{}},3000);
  return()=>{cancelAnimationFrame(raf);clearInterval(save);window.removeEventListener("resize",resize);r.domElement.removeEventListener("pointerdown",pointer);r.dispose();el.innerHTML=""};
 },[]);
 const h=Math.floor(hud.t/60),m=hud.t%60,avg=needs.reduce((a,k)=>a+hud.needs[k],0)/5,mood=avg>=70?"😄 Happy":avg>=45?"🙂 Okay":avg>=25?"😟 Stressed":"😩 Miserable";
 return <div className="omo-game-wrap"><div className="omo-hud"><div><b>Bola</b><span>{["Mon","Tue","Wed","Thu","Fri","Sat","Sun"][(hud.day-1)%7]} · Day {hud.day} · {String(h).padStart(2,"0")}:{String(m).padStart(2,"0")}</span></div><strong>₦{Math.round(hud.cash).toLocaleString("en-NG")}</strong></div><div className="omo-needs">{needs.map(k=><div key={k}>{({hunger:"🍲",energy:"⚡",hygiene:"🚿",fun:"🎮",social:"💬"} as any)[k]}<i><b style={{width:hud.needs[k]+"%"}}/></i></div>)}</div><div ref={host} className="omo-canvas"/><div className="omo-status">Mood: {mood} · Skill {hud.skill} · {hud.cur?"Working…":hud.q.length?"Walking…":"Idle"}</div><div className="omo-actions">{[0,1,3,8].map(s=><button key={s} onClick={()=>{try{const x=JSON.parse(localStorage.getItem("omo-3d-v4")||"null");if(x){x.speed=s;localStorage.setItem("omo-3d-v4",JSON.stringify(x));location.reload()}}catch{}}}>{s===0?"⏸":s+"×"}</button>)}</div><div className="omo-log">{hud.log.map((x:string,i:number)=><p key={i}>{x}</p>)}</div>{hud.over&&<div className="omo-over"><div><h2>Game over</h2><p>{hud.over}</p><button onClick={()=>{localStorage.removeItem("omo-3d-v4");location.reload()}}>Start a new life</button></div></div>}</div>
}