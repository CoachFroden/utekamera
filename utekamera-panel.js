class UtekameraPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode:"open"});
    this.cameras=[{id:"utekamera",name:"Utekamera",subtitle:"Fuglebrettet",entity:"camera.utekamera"}];
    this.selected=null;
    this._hass=null;
    this._card=null;
    this.shadowRoot.innerHTML=`
      <style>
        :host{display:block;min-height:100vh;background:#101c26;color:#ecf7fa;font:16px system-ui,sans-serif}
        *{box-sizing:border-box}main{max-width:1050px;margin:auto;padding:34px 18px}
        h1{font-size:clamp(28px,5vw,42px);margin:8px 0}p{color:#9fb9c6}
        .eyebrow{color:#81d5d8;font-size:13px;letter-spacing:.08em;text-transform:uppercase}
        .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-top:26px}
        button{cursor:pointer;color:inherit;font:inherit}
        .camera{background:#182d3a;border:1px solid #375364;border-radius:20px;padding:0;overflow:hidden;text-align:left}
        .thumb{height:160px;display:grid;place-items:center;background:linear-gradient(135deg,#294f61,#12202b);font-size:54px}
        .info{padding:20px;display:flex;justify-content:space-between;align-items:center}
        small{display:block;color:#9fb9c6;margin-top:5px}.hidden{display:none!important}
        .back,.action{border:1px solid #466375;border-radius:12px;background:#203745;padding:10px 15px}
        .viewer{margin-top:22px;background:#0b131b;border:1px solid #375364;border-radius:20px;overflow:hidden}
        .viewerhead{padding:16px 20px;font-weight:700}.screen{min-height:230px;background:#000}
        .actions{padding:14px;display:flex;gap:10px}
        .error{padding:24px;color:#ffd2c6}
      </style>
      <main>
        <section id="home"><span class="eyebrow">Kameraoversikt</span><h1>Mine kameraer</h1><p>Velg kameraet du vil se.</p><div id="grid" class="grid"></div></section>
        <section id="detail" class="hidden"><button class="back" id="back">← Alle kameraer</button><div class="viewer"><div class="viewerhead" id="title"></div><div class="screen" id="screen"></div><div class="actions"><button class="action" id="fullscreen">⛶ Fullskjerm</button></div></div></section>
      </main>`;
    const root=this.shadowRoot;
    for(const c of this.cameras){
      const b=document.createElement("button");b.className="camera";
      b.innerHTML='<div class="thumb">📷</div><div class="info"><span><strong></strong><small></small></span><span>→</span></div>';
      b.querySelector("strong").textContent=c.name;b.querySelector("small").textContent=c.subtitle;
      b.addEventListener("click",()=>this.open(c));root.getElementById("grid").append(b);
    }
    root.getElementById("back").addEventListener("click",()=>this.home());
    root.getElementById("fullscreen").addEventListener("click",()=>{
      const screen=root.getElementById("screen");
      if(document.fullscreenElement)document.exitFullscreen();else screen.requestFullscreen?.();
    });
  }
  set hass(value){this._hass=value;if(this._card)this._card.hass=value;}
  async open(camera){
    this.selected=camera;
    const root=this.shadowRoot;
    root.getElementById("home").classList.add("hidden");
    root.getElementById("detail").classList.remove("hidden");
    root.getElementById("title").textContent=camera.name;
    const screen=root.getElementById("screen");
    screen.replaceChildren();
    const msg=document.createElement("div");msg.className="error";msg.textContent="Kobler til kamera …";screen.append(msg);
    try{
      const helpers=await window.loadCardHelpers();
      if(this.selected!==camera)return;
      const card=helpers.createCardElement({type:"picture-entity",entity:camera.entity,camera_view:"live",show_name:false,show_state:false});
      card.hass=this._hass;
      this._card=card;
      screen.replaceChildren(card);
    }catch(err){
      msg.textContent="Kunne ikke åpne kameravisningen: "+(err?.message||err);
    }
  }
  home(){
    this.selected=null;this._card=null;
    this.shadowRoot.getElementById("screen").replaceChildren();
    this.shadowRoot.getElementById("detail").classList.add("hidden");
    this.shadowRoot.getElementById("home").classList.remove("hidden");
  }
}
customElements.define("utekamera-panel",UtekameraPanel);
