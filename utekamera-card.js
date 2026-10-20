class UtekameraCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) throw new Error("Angi kameraentitet, f.eks. camera.utekamera");
    this._config = config;
    if (!this.shadowRoot) this.attachShadow({mode:"open"});
    this.shadowRoot.innerHTML = `
      <style>
        :host {display:block;color:var(--primary-text-color)}
        .shell {overflow:hidden;border-radius:22px;background:var(--card-background-color,#18212c);box-shadow:0 8px 30px #0002}
        .top {display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px}
        .title {font-size:20px;font-weight:750;letter-spacing:-.4px}
        .sub {font-size:12px;opacity:.7;margin-top:3px}
        .live {font-size:11px;font-weight:800;letter-spacing:1px;background:#c52d3c;color:white;border-radius:20px;padding:6px 10px}
        .view {background:#0a0d13;position:relative}
        hui-picture-entity-card {display:block;--ha-card-border-radius:0px;--ha-card-box-shadow:none;--ha-card-border-width:0}
        .bar {display:flex;flex-wrap:wrap;gap:10px;padding:14px 16px}
        button {border:1px solid var(--divider-color,#54616e);border-radius:12px;background:var(--secondary-background-color,#283340);color:var(--primary-text-color,#fff);padding:11px 15px;font:inherit;cursor:pointer}
        button:focus-visible {outline:2px solid var(--primary-color,#03a9f4)}
        .note {padding:0 17px 15px;font-size:12px;opacity:.65}
      </style>
      <section class="shell">
        <div class="top"><div><div class="title"></div><div class="sub">Direkte fra Home Assistant</div></div><span class="live">● LIVE</span></div>
        <div class="view"><hui-picture-entity-card></hui-picture-entity-card></div>
        <div class="bar"><button id="fullscreen" type="button">⛶ Fullskjerm</button><button id="refresh" type="button">↻ Oppdater visning</button></div>
        <div class="note">Kameraet vises gjennom Home Assistants egen kameraviser. Ingen RTSP-port eksponeres.</div>
      </section>`;
    this.shadowRoot.querySelector(".title").textContent = config.title || "Utekamera";
    const player = this.shadowRoot.querySelector("hui-picture-entity-card");
    player.setConfig({type:"picture-entity",entity:config.entity,camera_view:"live",show_name:false,show_state:false});
    if (this._hass) player.hass=this._hass;
    this.shadowRoot.getElementById("fullscreen").onclick=()=>{
      const view=this.shadowRoot.querySelector(".view");
      if(document.fullscreenElement) document.exitFullscreen();
      else if(view.requestFullscreen) view.requestFullscreen();
    };
    this.shadowRoot.getElementById("refresh").onclick=()=>{
      const old=this.shadowRoot.querySelector("hui-picture-entity-card");
      const fresh=document.createElement("hui-picture-entity-card");
      fresh.setConfig({type:"picture-entity",entity:this._config.entity,camera_view:"live",show_name:false,show_state:false});
      if(this._hass) fresh.hass=this._hass;
      old.replaceWith(fresh);
    };
  }
  set hass(hass) {
    this._hass=hass;
    const player=this.shadowRoot?.querySelector("hui-picture-entity-card");
    if(player) player.hass=hass;
  }
  getCardSize(){return 5}
}
if (!customElements.get("utekamera-card")) customElements.define("utekamera-card",UtekameraCard);
window.customCards=window.customCards||[];
if(!window.customCards.some(c=>c.type==="utekamera-card")) window.customCards.push({type:"utekamera-card",name:"Utekamera",description:"Egen kameravisning basert på Home Assistants live-kort"});
