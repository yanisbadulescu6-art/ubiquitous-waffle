const sections = [
  {id:"dashboard",name:"Dashboard"},
  {id:"money",name:"Money menu"},
  {id:"vehicles",name:"Vehicle menu"},
  {id:"teleport",name:"Teleport menu"},
  {id:"player",name:"Player options"},
  {id:"settings",name:"Settings"}
];
let sectionIndex=0, itemIndex=0, demoBalance=25000, godMode=false, wanted=0, selectedVehicle="Elegy RH8";
const nav=document.getElementById("nav"), panel=document.getElementById("panel");
const title=document.getElementById("sectionTitle"), crumb=document.getElementById("crumb");
const message=document.getElementById("message"), padStatus=document.getElementById("padStatus");
let lastAction=0, lastNav=0, previousButtons=[];
function notify(s){message.textContent=s}
function renderNav(){
 nav.innerHTML=sections.map((s,i)=>`<button class="nav-item ${i===sectionIndex?"active":""}" data-i="${i}"><span>${s.name}</span><span class="num">0${i+1}</span></button>`).join("");
 nav.querySelectorAll("button").forEach(b=>b.addEventListener("click",()=>{sectionIndex=+b.dataset.i;itemIndex=0;render()}));
}
function actionButton(label,detail,fn,value=""){
 return `<button class="action" data-action="${encodeURIComponent(label)}"><span>${label}<br><small>${detail}</small></span><span class="value">${value||"□"}</span></button>`;
}
function render(){
 renderNav(); const s=sections[sectionIndex];title.textContent=s.name;crumb.textContent=s.name.toUpperCase();
 let html="";
 if(s.id==="dashboard"){
  html=`<div class="hero"><h3>Welcome to Los Santos</h3><p>A controller-friendly GTA V themed menu prototype. Browse the sections and try the simulated options.</p></div>
  <div class="cards">
   <div class="card"><label>Demo cash balance</label><strong>$${demoBalance.toLocaleString()}</strong><p>Local display value only</p></div>
   <div class="card"><label>Selected vehicle</label><strong>${selectedVehicle}</strong><p>Preview selection only</p></div>
   <div class="card"><label>Wanted level</label><strong>${"★".repeat(wanted)||"0"}</strong><p>Simulated player setting</p></div>
   <div class="card"><label>Menu state</label><strong>READY</strong><p>No game process connected</p></div>
  </div><div class="note">Use D-pad to move through menu items. Press Square / Enter to select. Circle / Escape returns to the dashboard.</div>`;
 }
 if(s.id==="money"){
  html=`<div class="hero"><h3>Money menu <span class="pill">SIMULATED</span></h3><p>These actions update only the demo balance shown in this webpage.</p></div>
  <div class="cards"><div class="card"><label>Current demo balance</label><strong>$${demoBalance.toLocaleString()}</strong><p>Not GTA currency</p></div><div class="card"><label>Session</label><strong>LOCAL</strong><p>Changes are not saved to a game</p></div></div>
  <div class="actions" style="margin-top:14px">${actionButton("Add $1,000","Increase the local demo counter")}${actionButton("Add $10,000","Increase the local demo counter")}${actionButton("Reset demo balance","Return the local counter to $25,000")}</div>`;
 }
 if(s.id==="vehicles"){
  html=`<div class="hero"><h3>Vehicle selector</h3><p>Choose a vehicle name for the dashboard preview. No vehicle is spawned in GTA V.</p></div>
  <div class="actions">${["Elegy RH8","Comet","Banshee","Sultan","Buffalo","Adder"].map(v=>actionButton(v,"Set dashboard preview",null,v===selectedVehicle?"SELECTED":"□")).join("")}</div>`;
 }
 if(s.id==="teleport"){
  html=`<div class="hero"><h3>Location menu</h3><p>Location names are provided as a navigation UI mockup only. They do not move your in-game character.</p></div>
  <div class="actions">${["Los Santos Airport","Vespucci Beach","Maze Bank Tower","Sandy Shores","Mount Chiliad"].map(v=>actionButton(v,"Preview location (simulation)")).join("")}</div>`;
 }
 if(s.id==="player"){
  html=`<div class="hero"><h3>Player options</h3><p>Local visual toggles only. No game memory or online session is accessed.</p></div>
  <div class="cards"><div class="card"><label>God mode preview</label><strong>${godMode?"ON":"OFF"}</strong><p>Demo toggle only</p></div><div class="card"><label>Wanted level preview</label><strong>${wanted} / 5</strong><p>Demo setting only</p></div></div>
  <div class="actions" style="margin-top:14px">${actionButton("Toggle invincibility preview","Switch the local display toggle",null,godMode?"ON":"OFF")}${actionButton("Increase wanted level","Increase local preview value",null,"+")}${actionButton("Clear wanted level","Set local preview to zero",null,"RESET")}</div>`;
 }
 if(s.id==="settings"){
  html=`<div class="hero"><h3>Settings</h3><p>Interface preferences and input help.</p></div>
  <div class="actions">${actionButton("Reset all demo values","Restore initial local values")}${actionButton("Show controller help","Display input mapping")}</div>
  <div class="note">Gamepad mapping uses the browser Gamepad API standard layout: D-pad buttons 12–15 and Square button 2. Browser and controller support can vary by device.</div>`;
 }
 panel.innerHTML=html;
 const buttons=[...panel.querySelectorAll(".action")];
 buttons.forEach((b,i)=>b.addEventListener("click",()=>{itemIndex=i;activate(i)}));
 itemIndex=Math.max(0,Math.min(itemIndex,buttons.length-1));
 updateSelection();
}
function updateSelection(){
 const buttons=[...panel.querySelectorAll(".action")];
 buttons.forEach((b,i)=>b.classList.toggle("selected",i===itemIndex));
}
function activate(i){
 const s=sections[sectionIndex], labels=[...panel.querySelectorAll(".action")];
 if(!labels[i])return;const label=labels[i].innerText.split("\n")[0];
 if(s.id==="money"){
  if(label==="Add $1,000")demoBalance+=1000;
  else if(label==="Add $10,000")demoBalance+=10000;
  else demoBalance=25000;
  notify(label+" — demo balance updated.");
 }else if(s.id==="vehicles"){selectedVehicle=label;notify(label+" selected for preview.");}
 else if(s.id==="teleport"){notify(label+" selected. No in-game teleport performed.");}
 else if(s.id==="player"){
  if(label.includes("Toggle"))godMode=!godMode;
  else if(label.includes("Increase"))wanted=Math.min(5,wanted+1);
  else wanted=0;
  notify("Player preview updated.");
 }else if(s.id==="settings"){
  if(label.includes("Reset")){demoBalance=25000;godMode=false;wanted=0;selectedVehicle="Elegy RH8";notify("Demo values reset.");}
  else notify("D-pad: navigate · Square: select · Circle: back.");
 }
 render();
}
function moveSection(delta){sectionIndex=(sectionIndex+delta+sections.length)%sections.length;itemIndex=0;render()}
function moveItem(delta){const n=panel.querySelectorAll(".action").length;if(!n)return;itemIndex=(itemIndex+delta+n)%n;updateSelection()}
function select(){if(panel.querySelectorAll(".action").length)activate(itemIndex)}
function back(){sectionIndex=0;itemIndex=0;render();notify("Returned to dashboard.");}
window.addEventListener("keydown",e=>{
 const k=e.key;
 if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","Enter"," ","Escape"].includes(k))e.preventDefault();
 if(k==="ArrowUp")moveItem(-1);else if(k==="ArrowDown")moveItem(1);
 else if(k==="ArrowLeft")moveSection(-1);else if(k==="ArrowRight")moveSection(1);
 else if(k==="Enter"||k===" ")select();else if(k==="Escape"||k==="Backspace")back();
});
function pollGamepad(){
 const pads=navigator.getGamepads?navigator.getGamepads():[];
 const pad=[...pads].find(Boolean);
 if(pad){
  padStatus.textContent="Controller: connected";
  const pressed=(i)=>!!pad.buttons[i]?.pressed;
  const now=performance.now();
  if(now-lastNav>170){
   if(pressed(12)){moveItem(-1);lastNav=now}
   else if(pressed(13)){moveItem(1);lastNav=now}
   else if(pressed(14)){moveSection(-1);lastNav=now}
   else if(pressed(15)){moveSection(1);lastNav=now}
  }
  if(pressed(2)&&!previousButtons[2]&&now-lastAction>250){select();lastAction=now}
  if(pressed(1)&&!previousButtons[1]&&now-lastAction>250){back();lastAction=now}
  previousButtons=pad.buttons.map(b=>b.pressed);
 }else{padStatus.textContent="Controller: not detected — keyboard available";previousButtons=[]}
 requestAnimationFrame(pollGamepad);
}
render();pollGamepad();
