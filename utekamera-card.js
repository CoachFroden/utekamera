class UtekameraCard extends HTMLElement {
  setConfig(config) {
    if (!config.entity) throw new Error("Angi kameraentitet, f.eks. camera.utekamera");
    this._config = config;
    if (!this.shadowRoot) this.attachShadow({ mode: "open" });
    this.shadowRoot.innerHTML = `
      <style>
        :host{display:block;color:var(--primary-text-color)}
        .shell{overflow:hidden;border-radius:22px;background:var(--card-background-color,#18212c);box-shadow:0 8px 30px #0002}
        .top{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:16px 18px}
        .title{font-size:20px;font-weight:750}
        .sub{font-size:12px;opacity:.7;margin-top:3px}
        .live{font-size:11px;font-weight:800;letter-spacing:1px;background:#c52d3c;color:white;border-radius:20px;padding:6px 10px}
        .view{background:#0a0d13;position:relative}
        .bar{display:flex;flex-wrap:wrap;gap:10px;padding:14px 16px}
        button{border:1px solid var(--divider-color,#54616e);border-radius:12px;background:var(--secondary-background-color,#283340);color:var(--primary-text-color,#fff);padding:11px 15px;font:inherit;cursor:pointer}
        .note{padding:0 17px 15px;font-size:12px;opacity:.65}
      </style>
      <section class="shell">
        <div class="top"><div><div class="title"></div><div class="sub">Direkte fra Home Assistant</div></div><span class="live">● LIVE</span></div>
        <div class="view" id="view"><span id="loading">Laster kameravisning …</span></div>
        <div class="bar"><button id="fullscreen" type="button">⛶ Fullskjerm</button><button id="refresh" type="button">↻ Oppdater visning</button></div>
        <div class="note">Kameraet vises gjennom Home Assistant.</div>
      </section>`;
    this.shadowRoot.querySelector(".title").textContent = config.title || "Utekamera";
    this.shadowRoot.getElementById("fullscreen").onclick = () => {
      const view = this.shadowRoot.getElementById("view");
      if (document.fullscreenElement) document.exitFullscreen();
      else view.requestFullscreen?.();
    };
    this.shadowRoot.getElementById("refresh").onclick = () => this._buildPlayer();
    this._buildPlayer();
  }
  async _buildPlayer() {
    const view = this.shadowRoot?.getElementById("view");
    if (!view || !this._config) return;
    view.textContent = "Laster kameravisning …";
    try {
      if (typeof window.loadCardHelpers !== "function") throw new Error("Home Assistant-korthjelper er ikke tilgjengelig");
      const helpers = await window.loadCardHelpers();
      if (!view.isConnected) return;
      const player = helpers.createCardElement({
        type: "picture-entity",
        entity: this._config.entity,
        camera_view: "live",
        show_name: false,
        show_state: false
      });
      if (this._hass) player.hass = this._hass;
      view.replaceChildren(player);
    } catch (error) {
      view.textContent = "Kunne ikke laste kamerakortet: " + (error?.message || error);
    }
  }
  set hass(hass) {
    this._hass = hass;
    const player = this.shadowRoot?.getElementById("view")?.firstElementChild;
    if (player && "hass" in player) player.hass = hass;
  }
  getCardSize() { return 5; }
}
if (!customElements.get("utekamera-card")) customElements.define("utekamera-card", UtekameraCard);
window.customCards = window.customCards || [];
if (!window.customCards.some(c => c.type === "utekamera-card")) window.customCards.push({
  type: "utekamera-card", name: "Utekamera", description: "Livekamera via Home Assistant"
});
