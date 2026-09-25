export const partyGuestStyle = `
  :root { color-scheme: dark; --ink:#f4f7f9; --muted:#9caab8; --line:rgba(190,218,230,.14); --surface:#101823; --cyan:#6ae7e1; }
  * { box-sizing:border-box; }
  html { min-width:320px; }
  body {
    margin:0; min-height:100vh; padding:32px 24px 54px;
    color:var(--ink); font-family:Inter,"Segoe UI",system-ui,sans-serif;
    background:radial-gradient(circle at 12% 5%,rgba(27,102,106,.2),transparent 32%),
               radial-gradient(circle at 92% 95%,rgba(84,57,125,.19),transparent 30%),#090e16;
  }
  button,input { font:inherit; }
  button { cursor:pointer; }
  button:disabled { cursor:not-allowed; opacity:.42; }
  button:focus-visible,input:focus-visible { outline:2px solid var(--cyan); outline-offset:3px; }
  [hidden] { display:none !important; }
  .page { width:min(1080px,100%); margin:auto; }
  .topbar { display:flex; align-items:center; justify-content:space-between; gap:16px; margin:0 0 24px; }
  .brand { display:flex; align-items:center; gap:12px; min-width:0; }
  .brand-icon { display:grid; place-items:center; flex:none; width:39px; height:39px; border-radius:12px;
    color:#091318; font-weight:950; letter-spacing:-.1em; background:linear-gradient(145deg,#a0fff4,#46b9d4);
    box-shadow:0 9px 24px rgba(67,206,210,.16); }
  .brand-name { font-size:15px; font-weight:850; letter-spacing:.15em; line-height:1; }
  .brand-sub { margin-top:5px; color:var(--muted); font-size:10px; font-weight:750; letter-spacing:.22em; }
  .top-meta { display:flex; align-items:center; gap:12px; color:#aab9c4; font-size:12px; white-space:nowrap; }
  .live-tag { display:flex; align-items:center; gap:7px; color:#a7efe9; font-size:11px; font-weight:800; letter-spacing:.13em; }
  .live-tag::before { content:""; width:7px; height:7px; border-radius:50%; background:var(--cyan); box-shadow:0 0 12px var(--cyan); }
  #room { padding-left:12px; border-left:1px solid var(--line); }
  .wrap { display:grid; grid-template-columns:minmax(270px,.86fr) minmax(0,1.14fr); align-items:stretch;
    overflow:hidden; border:1px solid var(--line); border-radius:26px; background:rgba(16,24,35,.96);
    box-shadow:0 28px 90px rgba(0,0,0,.33); }
  .art { position:relative; width:calc(100% - 56px); aspect-ratio:1; align-self:center; justify-self:center;
    overflow:hidden; border-radius:20px; background:linear-gradient(145deg,#16383e,#192139 55%,#33233e);
    box-shadow:0 22px 48px rgba(0,0,0,.36); }
  .art img { display:block; width:100%; height:100%; object-fit:cover; }
  .fallback { width:100%; height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center;
    gap:20px; color:#dafffb; background:radial-gradient(circle at 28% 18%,rgba(105,225,217,.32),transparent 34%),
    radial-gradient(circle at 76% 82%,rgba(178,113,218,.29),transparent 34%),linear-gradient(145deg,#12383c,#242035); }
  .fallback-mark { display:grid; place-items:center; width:42%; aspect-ratio:1; border:1px solid rgba(206,255,250,.3);
    border-radius:50%; box-shadow:0 0 0 14px rgba(199,255,250,.035),0 0 0 31px rgba(199,255,250,.025);
    font-size:clamp(36px,5vw,66px); font-weight:850; letter-spacing:-.13em; padding-right:.13em; }
  .fallback-label { color:#b6d4d6; font-size:11px; font-weight:750; letter-spacing:.22em; }
  #player { opacity:0; transition:opacity .22s ease; }
  #player.video-ready { opacity:1; }
  .sound-prompt { position:absolute; z-index:7; left:50%; bottom:20px; transform:translateX(-50%);
    max-width:calc(100% - 24px); padding:12px 18px; white-space:nowrap; border:1px solid rgba(255,255,255,.35);
    border-radius:999px; color:white; background:rgba(5,14,22,.9); box-shadow:0 8px 28px rgba(0,0,0,.4);
    font-size:13px; font-weight:800; }
  .sound-prompt:hover { background:#0b2b35; }
  .main { display:flex; flex-direction:column; justify-content:center; min-width:0; gap:24px; padding:42px 44px 40px 12px; }
  .track-info { min-width:0; }
  .eyebrow { margin-bottom:14px; color:var(--cyan); font-size:11px; font-weight:850; letter-spacing:.19em; }
  h1 { margin:0; max-width:100%; font-size:clamp(28px,3vw,43px); line-height:1.18; letter-spacing:-.035em;
    overflow-wrap:anywhere; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:4; line-clamp:4; overflow:hidden; }
  .artist { margin-top:13px; color:#b5c1cb; font-size:16px; line-height:1.5; display:-webkit-box;
    -webkit-box-orient:vertical; -webkit-line-clamp:2; line-clamp:2; overflow:hidden; }
  .meta { margin-top:15px; display:flex; flex-wrap:wrap; gap:8px; color:var(--muted); font-size:12px; }
  .pill { max-width:100%; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; padding:7px 10px;
    border:1px solid var(--line); border-radius:8px; background:rgba(255,255,255,.035); }
  #linkStatus { display:flex; align-items:center; gap:11px; min-width:0; color:var(--muted); font-size:12px; }
  .status-dot { display:block; flex:none; width:7px; height:7px; border-radius:50%; background:var(--cyan);
    box-shadow:0 0 0 5px rgba(106,231,225,.1); }
  .status-text { min-width:0; }
  .status-title { color:#d4e1e8; font-size:12px; font-weight:750; }
  .status-subtitle { margin-top:2px; color:var(--muted); font-size:11px; line-height:1.4; }
  .deck { display:flex; flex-direction:column; gap:17px; min-width:0; }
  .timeline { min-width:0; }
  .bar { height:5px; overflow:hidden; border-radius:999px; background:#2d3a49; }
  .bar > div { width:0; height:100%; border-radius:inherit; background:linear-gradient(90deg,#79e7df,#9ea5ff); transition:width .2s linear; }
  .time-row { display:flex; justify-content:space-between; gap:15px; margin-top:9px; color:var(--muted); font-size:12px; }
  #source { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
  .controls { display:flex; align-items:center; flex-wrap:wrap; gap:9px; }
  .controls button,.slider-row button { min-height:42px; padding:9px 13px; border:1px solid var(--line);
    border-radius:11px; color:#dbe7ec; background:#222d39; font-size:12px; font-weight:760; }
  .controls button:hover:not(:disabled),.slider-row button:hover:not(:disabled) { background:#304252; }
  .controls .primary { min-width:112px; border-color:transparent; color:#091b20; background:var(--cyan); font-size:13px;
    box-shadow:0 9px 22px rgba(62,198,200,.15); }
  .controls .primary:hover:not(:disabled) { background:#a1fff5; }
  .autoplay-hint { color:#a9ced0; font-size:12px; line-height:1.45; }
  .slider-row { display:grid; grid-template-columns:42px minmax(0,1fr) auto; align-items:center; gap:12px;
    color:var(--muted); font-size:12px; }
  .slider-row label { white-space:nowrap; }
  input[type="range"] { display:block; width:100%; min-width:0; height:18px; margin:0; accent-color:var(--cyan); cursor:pointer; }
  input[type="range"]:disabled { cursor:not-allowed; opacity:.55; }
  #volumeVal { width:34px; text-align:right; font-variant-numeric:tabular-nums; }
  .error { color:#ffc0bd; font-size:12px; line-height:1.45; }
  .error:empty { display:none; }
  .party-lyrics { padding:17px 20px; border:1px solid rgba(106,231,225,.16); border-radius:16px;
    background:linear-gradient(115deg,rgba(106,231,225,.065),rgba(151,114,207,.07)); overflow:hidden; }
  .lyrics-label { display:flex; justify-content:space-between; gap:12px; color:#8adcd8; font-size:10px;
    font-weight:800; letter-spacing:.16em; }
  .lyrics-line { margin-top:12px; font-size:clamp(19px,2.5vw,27px); line-height:1.35; font-weight:800; overflow-wrap:anywhere; }
  .lyrics-next { margin-top:6px; color:var(--muted); font-size:13px; overflow-wrap:anywhere; }
  .lyrics-line.enter { animation:lyric-in .35s ease-out; }
  .party-lyrics[data-style='kinetic'] .lyrics-line { color:#8efff1; text-transform:uppercase; letter-spacing:.03em; }
  .party-lyrics[data-style='rhythm-cut'] .lyrics-line { color:#ffafd7; font-style:italic; }
  .party-lyrics[data-style='manga'] { background:linear-gradient(135deg,#30243f,#151b29); }
  .party-lyrics[data-style='manga'] .lyrics-line { text-shadow:3px 3px 0 #713b88; }
  .party-lyrics[data-style='handwritten'] .lyrics-line { font-family:cursive; font-weight:500; color:#ffe8bd; }
  .party-lyrics[data-style='subtitle'] .lyrics-line { text-align:center; font-size:22px; }
  .party-lyrics[data-style='focus'] .lyrics-line { font-size:clamp(26px,3vw,38px); }
  @keyframes lyric-in { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:none; } }
  .wrap.has-video { display:block; }
  .wrap.has-video .art { width:100%; margin:0; aspect-ratio:16/9; border-radius:0; box-shadow:none; background:#05080c; }
  .wrap.has-video .art img,.wrap.has-video .fallback { object-fit:contain; }
  .wrap.has-video .main { display:grid; grid-template-columns:minmax(0,1fr) minmax(340px,.8fr); align-items:start;
    gap:12px 36px; padding:26px 34px 30px; }
  .wrap.has-video .track-info { grid-column:1; grid-row:1; }
  .wrap.has-video .deck { grid-column:2; grid-row:1 / span 2; gap:13px; }
  .wrap.has-video .party-lyrics { grid-column:1 / -1; grid-row:3; }
  .wrap.has-video h1 { font-size:clamp(23px,2.35vw,32px); -webkit-line-clamp:3; line-clamp:3; }
  .wrap.has-video .artist { margin-top:8px; font-size:14px; }
  .wrap.has-video .meta { margin-top:10px; }
  @media (max-width:850px) {
    body { padding:18px 16px 36px; }
    .wrap { display:block; }
    .art { width:min(72%,380px); margin:28px auto 0; }
    .main { padding:28px 32px 32px; }
    .wrap.has-video .main { display:flex; align-items:stretch; gap:22px; padding:26px 30px 32px; }
    .wrap.has-video .track-info,.wrap.has-video .deck { width:100%; }
    .controls { display:grid; grid-template-columns:minmax(0,1.3fr) minmax(0,.8fr) minmax(0,1fr); }
    .controls button { width:100%; }
    .wrap.has-video .art { margin:0; width:100%; }
  }
  @media (max-width:520px) {
    body { padding:15px 12px 28px; }
    .topbar { margin-bottom:16px; }
    .brand-icon { width:34px; height:34px; border-radius:10px; }
    .brand-name { font-size:13px; }
    .brand-sub { font-size:9px; }
    .top-meta { gap:7px; font-size:10px; }
    #room { padding-left:8px; }
    .wrap { border-radius:19px; }
    .art { width:calc(100% - 36px); margin:18px auto 0; border-radius:14px; }
    .wrap.has-video .art { border-radius:0; }
    .main,.wrap.has-video .main { padding:22px 20px 25px; gap:23px; }
    h1 { font-size:clamp(25px,7vw,34px); }
    .wrap.has-video h1 { font-size:clamp(23px,6vw,30px); }
    .controls { grid-template-columns:repeat(2,minmax(0,1fr)); gap:7px; }
    .controls .primary { grid-column:1 / -1; }
    .slider-row { grid-template-columns:36px minmax(0,1fr) auto; gap:9px; }
    .sound-prompt { bottom:12px; padding:9px 13px; font-size:11px; }
  }
`; 
