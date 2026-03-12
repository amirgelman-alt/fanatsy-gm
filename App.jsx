import { useState, useEffect, useRef } from "react";

const STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0a;
    --surface: #111111;
    --surface2: #1a1a1a;
    --border: #222222;
    --accent: #e8ff47;
    --accent2: #ff6b35;
    --text: #f0f0f0;
    --muted: #666;
    --win: #4ade80;
    --loss: #f87171;
    --battle: #fbbf24;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
  }

  .app { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 220px;
    min-width: 220px;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 0;
  }
  .logo {
    padding: 24px 20px 20px;
    border-bottom: 1px solid var(--border);
  }
  .logo-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 2px;
    color: var(--accent);
    line-height: 1;
  }
  .logo-sub {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-top: 4px;
  }
  .nav { flex: 1; padding: 16px 0; }
  .nav-btn {
    width: 100%;
    background: none;
    border: none;
    color: var(--muted);
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    font-weight: 500;
    padding: 10px 20px;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 10px;
    transition: all 0.15s;
    border-left: 3px solid transparent;
  }
  .nav-btn:hover { color: var(--text); background: var(--surface2); }
  .nav-btn.active { color: var(--accent); border-left-color: var(--accent); background: rgba(232,255,71,0.05); }
  .nav-icon { font-size: 16px; width: 20px; text-align: center; }

  .sidebar-footer {
    padding: 16px 20px;
    border-top: 1px solid var(--border);
  }
  .setup-indicator {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .dot { width: 6px; height: 6px; border-radius: 50%; background: var(--win); }
  .dot.off { background: var(--loss); }

  /* MAIN */
  .main { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }

  .topbar {
    padding: 16px 28px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--surface);
    position: sticky;
    top: 0;
    z-index: 10;
  }
  .topbar-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 2px;
    color: var(--text);
  }
  .topbar-sub { font-size: 12px; color: var(--muted); font-family: 'DM Mono', monospace; }

  .content { padding: 28px; flex: 1; }

  /* SETUP SCREEN */
  .setup-screen {
    max-width: 560px;
    margin: 40px auto;
  }
  .setup-header {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 48px;
    letter-spacing: 3px;
    color: var(--accent);
    line-height: 1;
    margin-bottom: 8px;
  }
  .setup-sub { color: var(--muted); font-size: 14px; margin-bottom: 36px; line-height: 1.6; }

  .setup-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 24px;
    margin-bottom: 16px;
  }
  .setup-card-title {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
  }
  .setup-card-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px;
    color: var(--border);
    float: right;
    line-height: 1;
    margin-top: -4px;
  }

  label { display: block; font-size: 13px; color: var(--muted); margin-bottom: 6px; }
  input, select, textarea {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--text);
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    padding: 10px 14px;
    outline: none;
    transition: border-color 0.15s;
    margin-bottom: 12px;
  }
  input:focus, select:focus, textarea:focus { border-color: var(--accent); }
  input::placeholder { color: var(--muted); }
  select option { background: var(--surface2); }

  .hint { font-size: 11px; color: var(--muted); margin-top: -8px; margin-bottom: 12px; font-family: 'DM Mono', monospace; }

  .btn {
    background: var(--accent);
    color: #000;
    border: none;
    border-radius: 6px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 14px;
    padding: 12px 24px;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.5px;
  }
  .btn:hover { background: #d4e840; transform: translateY(-1px); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
  .btn-ghost {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--text);
  }
  .btn-ghost:hover { border-color: var(--accent); background: rgba(232,255,71,0.05); }
  .btn-sm { font-size: 12px; padding: 8px 16px; }
  .btn-full { width: 100%; }

  /* TAGS / PILLS */
  .tag {
    display: inline-block;
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 4px;
    background: var(--surface2);
    color: var(--muted);
    border: 1px solid var(--border);
  }
  .tag.win { background: rgba(74,222,128,0.1); color: var(--win); border-color: rgba(74,222,128,0.3); }
  .tag.loss { background: rgba(248,113,113,0.1); color: var(--loss); border-color: rgba(248,113,113,0.3); }
  .tag.battle { background: rgba(251,191,36,0.1); color: var(--battle); border-color: rgba(251,191,36,0.3); }
  .tag.accent { background: rgba(232,255,71,0.1); color: var(--accent); border-color: rgba(232,255,71,0.3); }
  .tag.hot { background: rgba(255,107,53,0.1); color: var(--accent2); border-color: rgba(255,107,53,0.3); }

  /* CARDS */
  .card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
  }
  .card-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 2px;
    color: var(--text);
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .card-sub { font-size: 12px; color: var(--muted); font-family: 'DM Mono', monospace; margin-bottom: 16px; }

  /* GRID */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }

  /* CAT TABLE */
  .cat-table { width: 100%; border-collapse: collapse; }
  .cat-table th {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--muted);
    padding: 6px 10px;
    text-align: left;
    border-bottom: 1px solid var(--border);
  }
  .cat-table td {
    padding: 9px 10px;
    font-size: 13px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }
  .cat-table tr:last-child td { border-bottom: none; }
  .cat-table tr:hover td { background: rgba(255,255,255,0.02); }

  .bar-wrap { display: flex; align-items: center; gap: 8px; }
  .bar { height: 4px; background: var(--border); border-radius: 2px; flex: 1; overflow: hidden; }
  .bar-fill { height: 100%; border-radius: 2px; transition: width 0.6s ease; }

  /* ALERTS */
  .alert {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 12px 16px;
    margin-bottom: 10px;
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }
  .alert.urgent { border-left: 3px solid var(--accent2); }
  .alert.info { border-left: 3px solid var(--accent); }
  .alert-icon { font-size: 18px; flex-shrink: 0; }
  .alert-body { flex: 1; }
  .alert-title { font-size: 13px; font-weight: 600; margin-bottom: 3px; }
  .alert-text { font-size: 12px; color: var(--muted); line-height: 1.5; }

  /* CHAT */
  .chat-wrap { display: flex; flex-direction: column; height: calc(100vh - 65px); }
  .chat-messages { flex: 1; overflow-y: auto; padding: 24px 28px; display: flex; flex-direction: column; gap: 16px; }
  .chat-input-wrap {
    padding: 16px 28px;
    border-top: 1px solid var(--border);
    background: var(--surface);
  }
  .chat-input-row { display: flex; gap: 10px; }
  .chat-input {
    flex: 1;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    padding: 12px 16px;
    outline: none;
    resize: none;
    min-height: 46px;
    max-height: 140px;
    margin-bottom: 0;
    transition: border-color 0.15s;
  }
  .chat-input:focus { border-color: var(--accent); }

  .msg { max-width: 80%; display: flex; flex-direction: column; gap: 4px; }
  .msg.user { align-self: flex-end; align-items: flex-end; }
  .msg.ai { align-self: flex-start; align-items: flex-start; }
  .msg-bubble {
    padding: 12px 16px;
    border-radius: 12px;
    font-size: 14px;
    line-height: 1.6;
    white-space: pre-wrap;
  }
  .msg.user .msg-bubble {
    background: var(--accent);
    color: #000;
    font-weight: 500;
    border-bottom-right-radius: 4px;
  }
  .msg.ai .msg-bubble {
    background: var(--surface);
    border: 1px solid var(--border);
    color: var(--text);
    border-bottom-left-radius: 4px;
  }
  .msg-label {
    font-family: 'DM Mono', monospace;
    font-size: 10px;
    letter-spacing: 1px;
    color: var(--muted);
    text-transform: uppercase;
  }

  .quick-prompts { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
  .quick-btn {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 20px;
    color: var(--muted);
    font-size: 12px;
    padding: 6px 14px;
    cursor: pointer;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .quick-btn:hover { border-color: var(--accent); color: var(--accent); }

  .typing-dots span {
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--muted);
    margin: 0 2px;
    animation: blink 1.2s infinite;
  }
  .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
  .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes blink { 0%,80%,100%{opacity:0.2} 40%{opacity:1} }

  /* WAIVER PLAYER CARD */
  .player-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    gap: 12px;
  }
  .player-row:last-child { border-bottom: none; }
  .player-name { font-size: 14px; font-weight: 600; }
  .player-meta { font-size: 11px; color: var(--muted); font-family: 'DM Mono', monospace; margin-top: 2px; }
  .player-actions { display: flex; gap: 8px; align-items: center; }

  /* SECTION TITLES */
  .section-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 14px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
    margin-top: 24px;
  }
  .section-title:first-child { margin-top: 0; }

  /* STAT PILL */
  .stat-row { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 6px; }
  .stat-pill {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    padding: 3px 8px;
    border-radius: 4px;
    background: var(--surface2);
    color: var(--muted);
  }
  .stat-pill strong { color: var(--text); }

  /* LOADING */
  .spinner {
    width: 20px; height: 20px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .empty-state {
    text-align: center;
    padding: 60px 20px;
    color: var(--muted);
  }
  .empty-state .big { font-family: 'Bebas Neue', sans-serif; font-size: 64px; color: var(--border); }
  .empty-state p { font-size: 13px; margin-top: 8px; }

  /* RESPONSIVE */
  @media (max-width: 768px) {
    .grid-2, .grid-3 { grid-template-columns: 1fr; }
    .sidebar { width: 60px; min-width: 60px; }
    .logo-title, .logo-sub, .nav-btn span { display: none; }
    .nav-btn { justify-content: center; padding: 12px; border-left: none; border-bottom: 3px solid transparent; }
    .nav-btn.active { border-bottom-color: var(--accent); background: none; }
  }
`;

const CATS = ["PTS","REB","AST","STL","BLK","3PM","FG%","FT%","TO"];

const NAV = [
  { id: "brief",   icon: "☀️", label: "Daily Brief" },
  { id: "matchup", icon: "⚔️", label: "Matchup" },
  { id: "waiver",  icon: "➕", label: "Waiver Wire" },
  { id: "trades",  icon: "🔄", label: "Trade Ideas" },
  { id: "chat",    icon: "💬", label: "GM Chat" },
  { id: "settings",icon: "⚙️", label: "Settings" },
];

function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} }
function load(key, def) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch(e){ return def; } }

async function callClaude(apiKey, messages, system) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-beta": "web-search-2025-03-05" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages
    })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "API error");
  return data.content.filter(b => b.type === "text").map(b => b.text).join("\n");
}

function buildSystem(settings) {
  return `You are an elite NBA fantasy basketball GM advisor. You give sharp, analytical recommendations.

LEAGUE INFO:
- Format: Head-to-Head 9-Category (PTS, REB, AST, STL, BLK, 3PM, FG%, FT%, TO)
- League ID: ${settings.leagueId || "not set"}
- Team Name: ${settings.teamName || "not set"}
- Punt Strategy: ${settings.punt?.join(" + ") || "not yet determined"}
- My Roster: ${settings.roster || "not provided"}
- Opponent Roster: ${settings.opponent || "not provided"}

CORE PHILOSOPHY:
- To win H2H 9-cat consistently, target: TOP 3 in 6+ categories, TOP 5 in 7 categories, PUNT 1-2 categories completely
- Never recommend drops unless the player genuinely has no fantasy value
- Waiver adds must be evaluated: games remaining this week × L14 day avg vs opponent projected total for battleground cats
- Trade recommendations must show explicit category rank impact

Always be direct, specific, and analytical. Use real player names. Search for current injury news and analyst opinions when relevant.`;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function SetupScreen({ onSave }) {
  const [form, setForm] = useState({ apiKey:"", leagueId:"", teamName:"", punt:[], roster:"", opponent:"" });
  const set = (k,v) => setForm(f => ({...f, [k]:v}));
  const togglePunt = (cat) => {
    setForm(f => {
      const p = f.punt.includes(cat) ? f.punt.filter(c=>c!==cat) : f.punt.length < 2 ? [...f.punt, cat] : f.punt;
      return {...f, punt: p};
    });
  };
  const valid = form.apiKey && form.leagueId;
  return (
    <div className="setup-screen">
      <div className="setup-header">NBA GM<br/>WAR ROOM</div>
      <p className="setup-sub">Your daily fantasy basketball command center. Set up once, use every morning.</p>

      <div className="setup-card">
        <span className="setup-card-num">01</span>
        <div className="setup-card-title">Anthropic API Key</div>
        <label>Powers the AI analysis</label>
        <input type="password" placeholder="sk-ant-..." value={form.apiKey} onChange={e=>set("apiKey",e.target.value)} />
        <p className="hint">Get one free at console.anthropic.com → API Keys</p>
      </div>

      <div className="setup-card">
        <span className="setup-card-num">02</span>
        <div className="setup-card-title">Yahoo League</div>
        <label>League ID (from your Yahoo Fantasy URL)</label>
        <input placeholder="e.g. 12345" value={form.leagueId} onChange={e=>set("leagueId",e.target.value)} />
        <p className="hint">Open Yahoo Fantasy → the number in the URL: basketball.fantasysports.yahoo.com/nba/XXXXX</p>
        <label>Your team name (optional)</label>
        <input placeholder="e.g. Laker Boys" value={form.teamName} onChange={e=>set("teamName",e.target.value)} />
      </div>

      <div className="setup-card">
        <span className="setup-card-num">03</span>
        <div className="setup-card-title">Punt Strategy</div>
        <label>Select 1–2 categories to punt (sacrifice for the season)</label>
        <div style={{display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"12px"}}>
          {CATS.map(c => (
            <button key={c} onClick={()=>togglePunt(c)} style={{
              padding:"6px 14px", borderRadius:"20px", border:"1px solid",
              fontFamily:"'DM Mono', monospace", fontSize:"12px", cursor:"pointer",
              borderColor: form.punt.includes(c) ? "var(--accent)" : "var(--border)",
              background: form.punt.includes(c) ? "rgba(232,255,71,0.1)" : "var(--surface2)",
              color: form.punt.includes(c) ? "var(--accent)" : "var(--muted)"
            }}>{c}</button>
          ))}
        </div>
        <p className="hint">Not sure yet? Leave blank — the AI will recommend based on your roster.</p>
      </div>

      <div className="setup-card">
        <span className="setup-card-num">04</span>
        <div className="setup-card-title">Your Roster</div>
        <label>Paste your players (one per line or comma-separated)</label>
        <textarea rows={4} placeholder={"Nikola Jokic\nAnthony Davis\nJaylen Brown\n..."} value={form.roster} onChange={e=>set("roster",e.target.value)} />
        <label>Opponent's roster this week (optional but helps)</label>
        <textarea rows={3} placeholder={"Opponent's players..."} value={form.opponent} onChange={e=>set("opponent",e.target.value)} />
      </div>

      <button className="btn btn-full" disabled={!valid} onClick={()=>onSave(form)}>
        ENTER THE WAR ROOM →
      </button>
    </div>
  );
}

function DailyBrief({ settings, apiKey }) {
  const [brief, setBrief] = useState(load("brief",""));
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const prompt = `Give me my daily fantasy basketball brief. Search for latest injury news and analyst recommendations.

My roster: ${settings.roster || "not provided"}
Opponent: ${settings.opponent || "not provided"}
My punt strategy: ${settings.punt?.join(" + ") || "TBD"}

Give me:
1. WAIVER WIRE — Top 2-3 adds with specific drop justification. Only recommend drops if the player truly has no roster spot value. Base recommendations on games remaining this week and last 14-day averages. Show how each add helps my battleground categories vs opponent.
2. MUST-ADD ALERTS — Any players trending up due to injury or hot streak (search for this). 
3. TRADE AWAY — 1-2 players from my roster that don't fit my punt strategy and I should try to move.
4. CATEGORY OUTLOOK — Which of the 9 cats am I projected to win, lose, or battle this week?

Be specific and analytical. Use real player names from my roster.`;

      const text = await callClaude(apiKey, [{role:"user", content:prompt}], buildSystem(settings));
      setBrief(text);
      save("brief", text);
    } catch(e) {
      setBrief("Error: " + e.message);
    }
    setLoading(false);
  }

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:"28px", letterSpacing:"2px"}}>DAILY BRIEF</div>
          <div style={{fontSize:"12px", color:"var(--muted)", fontFamily:"'DM Mono', monospace"}}>
            {new Date().toLocaleDateString("en-US",{weekday:"long", month:"long", day:"numeric"})}
          </div>
        </div>
        <button className="btn" onClick={generate} disabled={loading}>
          {loading ? <><span className="spinner" style={{width:14,height:14,borderWidth:2}}/> Analyzing...</> : "↻ REFRESH BRIEF"}
        </button>
      </div>

      {!brief && !loading && (
        <div className="empty-state">
          <div className="big">GM</div>
          <p>Click Refresh Brief to get today's recommendations.<br/>The AI will search for injury news and analyze your matchup.</p>
        </div>
      )}

      {loading && (
        <div className="card" style={{textAlign:"center", padding:"40px"}}>
          <div className="spinner" style={{width:32,height:32,margin:"0 auto 16px"}} />
          <div style={{color:"var(--muted)", fontSize:"13px", fontFamily:"'DM Mono', monospace"}}>
            Searching injury reports, checking waiver wire, running week projections...
          </div>
        </div>
      )}

      {brief && !loading && (
        <div className="card">
          <div style={{fontSize:"14px", lineHeight:"1.8", whiteSpace:"pre-wrap"}}>{brief}</div>
          <div style={{marginTop:"16px", fontSize:"11px", color:"var(--muted)", fontFamily:"'DM Mono', monospace"}}>
            Generated {new Date().toLocaleTimeString()} · Based on current injury reports & analyst data
          </div>
        </div>
      )}
    </div>
  );
}

function MatchupView({ settings, apiKey }) {
  const [analysis, setAnalysis] = useState(load("matchup",""));
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    try {
      const prompt = `Analyze my H2H matchup for the rest of this week.

My roster: ${settings.roster || "not provided"}
Opponent's roster: ${settings.opponent || "not provided"}
My punt categories: ${settings.punt?.join(" + ") || "TBD"}

For each of the 9 categories (PTS, REB, AST, STL, BLK, 3PM, FG%, FT%, TO):
- Project my total for the week (based on games remaining × L14 avg — search if needed)
- Project opponent's total
- Verdict: WIN / LOSE / BATTLE
- Games remaining counts matter a lot — highlight if I have more or fewer games than opponent

Then tell me:
- Which 2-3 categories are the closest battlegrounds I should focus on winning
- Any specific lineup moves or roster decisions I should make TODAY to gain an edge
- My projected win total for the week (out of 9 cats)

Format it clearly with category-by-category breakdown.`;

      const text = await callClaude(apiKey, [{role:"user", content:prompt}], buildSystem(settings));
      setAnalysis(text);
      save("matchup", text);
    } catch(e) { setAnalysis("Error: " + e.message); }
    setLoading(false);
  }

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:"28px", letterSpacing:"2px"}}>MATCHUP ANALYSIS</div>
          <div style={{fontSize:"12px", color:"var(--muted)", fontFamily:"'DM Mono', monospace"}}>Week projection vs opponent</div>
        </div>
        <button className="btn" onClick={analyze} disabled={loading}>
          {loading ? "Analyzing..." : "⚔️ RUN ANALYSIS"}
        </button>
      </div>

      {!analysis && !loading && (
        <div className="empty-state">
          <div className="big">⚔️</div>
          <p>Run analysis to see your projected category wins and battlegrounds for the week.</p>
        </div>
      )}

      {loading && (
        <div className="card" style={{textAlign:"center", padding:"40px"}}>
          <div className="spinner" style={{width:32,height:32,margin:"0 auto 16px"}} />
          <div style={{color:"var(--muted)", fontSize:"13px"}}>Projecting all 9 categories for the week...</div>
        </div>
      )}

      {analysis && !loading && (
        <div className="card">
          <div style={{fontSize:"14px", lineHeight:"1.8", whiteSpace:"pre-wrap"}}>{analysis}</div>
        </div>
      )}
    </div>
  );
}

function WaiverWire({ settings, apiKey }) {
  const [players, setPlayers] = useState(load("waiver_players",""));
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyze() {
    if (!players.trim()) return;
    setLoading(true);
    try {
      const prompt = `Analyze these waiver wire players for my team. Search for recent news on each.

Players I'm considering: ${players}
My roster: ${settings.roster || "not provided"}
My opponent this week: ${settings.opponent || "not provided"}
My punt strategy: ${settings.punt?.join(" + ") || "TBD"}

For each player:
1. Last 14-day averages (search if needed)
2. Games remaining this week
3. Why they help (or don't) given my punt strategy
4. Which category battleground they help me win
5. Who I should drop to make room (with justification — only if the drop is truly warranted)
6. Verdict: ADD ✅ / SKIP ❌ / SITUATIONAL ⚡

Also check if any are trending on X/Twitter from fantasy analysts.

Rank them by fit for MY specific team and punt strategy.`;

      const text = await callClaude(apiKey, [{role:"user", content:prompt}], buildSystem(settings));
      setAnalysis(text);
    } catch(e) { setAnalysis("Error: " + e.message); }
    setLoading(false);
  }

  return (
    <div>
      <div style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:"28px", letterSpacing:"2px", marginBottom:"4px"}}>WAIVER WIRE</div>
      <div style={{fontSize:"12px", color:"var(--muted)", fontFamily:"'DM Mono', monospace", marginBottom:"20px"}}>Filtered through your punt strategy</div>

      <div className="card">
        <div className="card-sub">Paste players you're considering from your waiver wire</div>
        <textarea rows={3} placeholder={"e.g. Keegan Murray, Jalen Williams, Brook Lopez..."} value={players}
          onChange={e=>{ setPlayers(e.target.value); save("waiver_players", e.target.value); }} />
        <button className="btn" onClick={analyze} disabled={loading || !players.trim()}>
          {loading ? "Analyzing..." : "ANALYZE PLAYERS"}
        </button>
      </div>

      {loading && (
        <div className="card" style={{textAlign:"center", padding:"40px"}}>
          <div className="spinner" style={{width:32,height:32,margin:"0 auto 16px"}} />
          <div style={{color:"var(--muted)", fontSize:"13px"}}>Searching stats, injury reports, analyst picks...</div>
        </div>
      )}

      {analysis && !loading && (
        <div className="card">
          <div style={{fontSize:"14px", lineHeight:"1.8", whiteSpace:"pre-wrap"}}>{analysis}</div>
        </div>
      )}
    </div>
  );
}

function TradeIdeas({ settings, apiKey }) {
  const [ideas, setIdeas] = useState(load("trades",""));
  const [loading, setLoading] = useState(false);

  async function generate() {
    setLoading(true);
    try {
      const prompt = `Generate trade ideas for my team based on my punt strategy.

My roster: ${settings.roster || "not provided"}
My punt strategy: ${settings.punt?.join(" + ") || "TBD"}
League ID: ${settings.leagueId}

THE WINNING FORMULA: To win H2H consistently, I need:
- TOP 3 in at least 6 categories
- TOP 5 in 7 categories  
- Punting 1-2 categories completely is fine

For each trade idea:
1. Who I'm trading AWAY (and why they don't fit my punt)
2. What I should target in return (specific player types/names)
3. Category rank impact: show before/after for relevant cats
4. Example fair trade proposal with player names

Give me 3-4 concrete trade ideas, ranked by priority.
Also tell me if there are any players I should NOT trade under any circumstances.`;

      const text = await callClaude(apiKey, [{role:"user", content:prompt}], buildSystem(settings));
      setIdeas(text);
      save("trades", text);
    } catch(e) { setIdeas("Error: " + e.message); }
    setLoading(false);
  }

  return (
    <div>
      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
        <div>
          <div style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:"28px", letterSpacing:"2px"}}>TRADE IDEAS</div>
          <div style={{fontSize:"12px", color:"var(--muted)", fontFamily:"'DM Mono', monospace"}}>Built around your punt strategy</div>
        </div>
        <button className="btn" onClick={generate} disabled={loading}>
          {loading ? "Generating..." : "🔄 GENERATE IDEAS"}
        </button>
      </div>

      <div className="card" style={{borderLeft:"3px solid var(--accent)", marginBottom:"16px"}}>
        <div style={{fontSize:"12px", fontFamily:"'DM Mono', monospace", color:"var(--muted)", marginBottom:"8px"}}>THE FORMULA</div>
        <div style={{fontSize:"13px", lineHeight:"1.7"}}>
          Win consistently = <strong>Top 3 in 6+ cats</strong> · <strong>Top 5 in 7 cats</strong> · Punt <strong>1–2 cats completely</strong>
        </div>
      </div>

      {!ideas && !loading && (
        <div className="empty-state">
          <div className="big">🔄</div>
          <p>Generate trade ideas to see which players to move and what to target back.</p>
        </div>
      )}

      {loading && (
        <div className="card" style={{textAlign:"center", padding:"40px"}}>
          <div className="spinner" style={{width:32,height:32,margin:"0 auto 16px"}} />
          <div style={{color:"var(--muted)", fontSize:"13px"}}>Analyzing roster fit and category impact...</div>
        </div>
      )}

      {ideas && !loading && (
        <div className="card">
          <div style={{fontSize:"14px", lineHeight:"1.8", whiteSpace:"pre-wrap"}}>{ideas}</div>
        </div>
      )}
    </div>
  );
}

function Chat({ settings, apiKey }) {
  const [messages, setMessages] = useState(load("chat_msgs", []));
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({behavior:"smooth"}); }, [messages]);

  const QUICK = [
    "Should I punt FT% or TO?",
    "Analyze my roster weaknesses",
    "Who's my most tradeable player?",
    "Best waiver pickups right now?",
    "How do I win more categories?",
  ];

  async function send(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    const userMsg = {role:"user", content: msg};
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    save("chat_msgs", newMsgs);
    setLoading(true);
    try {
      const apiMsgs = newMsgs.map(m => ({role:m.role, content:m.content}));
      const reply = await callClaude(apiKey, apiMsgs, buildSystem(settings));
      const aiMsg = {role:"assistant", content: reply};
      const final = [...newMsgs, aiMsg];
      setMessages(final);
      save("chat_msgs", final);
    } catch(e) {
      const err = {role:"assistant", content:"Error: " + e.message};
      setMessages(m => [...m, err]);
    }
    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  }

  return (
    <div className="chat-wrap">
      <div className="chat-messages">
        {messages.length === 0 && (
          <div style={{textAlign:"center", paddingTop:"40px"}}>
            <div style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:"48px", color:"var(--border)"}}>GM CHAT</div>
            <div style={{color:"var(--muted)", fontSize:"13px", marginTop:"8px"}}>Ask anything about your team, trades, strategy...</div>
          </div>
        )}
        {messages.map((m,i) => (
          <div key={i} className={`msg ${m.role === "user" ? "user" : "ai"}`}>
            <div className="msg-label">{m.role === "user" ? "YOU" : "GM AI"}</div>
            <div className="msg-bubble">{m.content}</div>
          </div>
        ))}
        {loading && (
          <div className="msg ai">
            <div className="msg-label">GM AI</div>
            <div className="msg-bubble">
              <div className="typing-dots"><span/><span/><span/></div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-wrap">
        {messages.length === 0 && (
          <div className="quick-prompts">
            {QUICK.map(q => <button key={q} className="quick-btn" onClick={()=>send(q)}>{q}</button>)}
          </div>
        )}
        <div className="chat-input-row">
          <textarea className="chat-input" rows={1} placeholder="Ask your GM anything..." value={input}
            onChange={e=>setInput(e.target.value)} onKeyDown={handleKey} />
          <button className="btn" onClick={()=>send()} disabled={loading || !input.trim()}>SEND</button>
        </div>
        {messages.length > 0 && (
          <button className="btn-ghost btn btn-sm" style={{marginTop:"8px"}}
            onClick={()=>{ setMessages([]); save("chat_msgs",[]); }}>Clear chat</button>
        )}
      </div>
    </div>
  );
}

function Settings({ settings, onSave }) {
  const [form, setForm] = useState(settings);
  const set = (k,v) => setForm(f=>({...f,[k]:v}));
  const togglePunt = (cat) => {
    setForm(f => {
      const p = f.punt.includes(cat) ? f.punt.filter(c=>c!==cat) : f.punt.length < 2 ? [...f.punt, cat] : f.punt;
      return {...f, punt: p};
    });
  };
  return (
    <div style={{maxWidth:"560px"}}>
      <div style={{fontFamily:"'Bebas Neue', sans-serif", fontSize:"28px", letterSpacing:"2px", marginBottom:"20px"}}>SETTINGS</div>

      <div className="card">
        <div className="setup-card-title">API Key</div>
        <input type="password" value={form.apiKey} onChange={e=>set("apiKey",e.target.value)} />
        <div className="setup-card-title">League ID</div>
        <input value={form.leagueId} onChange={e=>set("leagueId",e.target.value)} />
        <div className="setup-card-title">Team Name</div>
        <input value={form.teamName} onChange={e=>set("teamName",e.target.value)} />
      </div>

      <div className="card">
        <div className="setup-card-title">Punt Strategy (pick 1–2)</div>
        <div style={{display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"16px"}}>
          {CATS.map(c => (
            <button key={c} onClick={()=>togglePunt(c)} style={{
              padding:"6px 14px", borderRadius:"20px", border:"1px solid",
              fontFamily:"'DM Mono', monospace", fontSize:"12px", cursor:"pointer",
              borderColor: form.punt.includes(c) ? "var(--accent)" : "var(--border)",
              background: form.punt.includes(c) ? "rgba(232,255,71,0.1)" : "var(--surface2)",
              color: form.punt.includes(c) ? "var(--accent)" : "var(--muted)"
            }}>{c}</button>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="setup-card-title">My Roster</div>
        <textarea rows={4} value={form.roster} onChange={e=>set("roster",e.target.value)} />
        <div className="setup-card-title">Opponent Roster</div>
        <textarea rows={3} value={form.opponent} onChange={e=>set("opponent",e.target.value)} />
      </div>

      <button className="btn" onClick={()=>onSave(form)}>SAVE SETTINGS</button>
      <button className="btn-ghost btn" style={{marginLeft:"10px"}} onClick={()=>{
        if(confirm("Reset everything?")) { localStorage.clear(); window.location.reload(); }
      }}>Reset App</button>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [settings, setSettings] = useState(load("settings", null));
  const [tab, setTab] = useState("brief");

  function handleSave(s) {
    save("settings", s);
    setSettings(s);
  }

  if (!settings) {
    return (
      <>
        <style>{STYLES}</style>
        <div style={{minHeight:"100vh", background:"var(--bg)", padding:"20px", overflowY:"auto"}}>
          <SetupScreen onSave={handleSave} />
        </div>
      </>
    );
  }

  const isSetup = settings.apiKey && settings.leagueId;

  return (
    <>
      <style>{STYLES}</style>
      <div className="app">
        <aside className="sidebar">
          <div className="logo">
            <div className="logo-title">FANTASY<br/>GM</div>
            <div className="logo-sub">War Room</div>
          </div>
          <nav className="nav">
            {NAV.map(n => (
              <button key={n.id} className={`nav-btn ${tab===n.id?"active":""}`} onClick={()=>setTab(n.id)}>
                <span className="nav-icon">{n.icon}</span>
                <span>{n.label}</span>
              </button>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="setup-indicator">
              <div className={`dot ${isSetup?"":"off"}`} />
              <span>{settings.teamName || settings.leagueId || "Not configured"}</span>
            </div>
            {settings.punt?.length > 0 && (
              <div style={{fontSize:"10px", color:"var(--muted)", fontFamily:"'DM Mono', monospace", marginTop:"4px"}}>
                PUNT: {settings.punt.join(" + ")}
              </div>
            )}
          </div>
        </aside>

        <main className="main">
          {tab !== "chat" && (
            <div className="topbar">
              <div>
                <div className="topbar-title">{NAV.find(n=>n.id===tab)?.label}</div>
              </div>
              <div className="topbar-sub">League {settings.leagueId} · H2H 9-Cat</div>
            </div>
          )}

          {tab === "chat" ? (
            <Chat settings={settings} apiKey={settings.apiKey} />
          ) : (
            <div className="content">
              {tab === "brief"   && <DailyBrief settings={settings} apiKey={settings.apiKey} />}
              {tab === "matchup" && <MatchupView settings={settings} apiKey={settings.apiKey} />}
              {tab === "waiver"  && <WaiverWire settings={settings} apiKey={settings.apiKey} />}
              {tab === "trades"  && <TradeIdeas settings={settings} apiKey={settings.apiKey} />}
              {tab === "settings"&& <Settings settings={settings} onSave={handleSave} />}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
