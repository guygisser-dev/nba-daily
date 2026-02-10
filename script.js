<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ה-NBA היומי של איתמר ואבא</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;700;800&family=Bebas+Neue&display=swap" rel="stylesheet">
  <style>
    :root { --nba-blue:#006BB6; --nba-red:#ED174C; --dark-bg:#0a0a0c; --card-bg:#16161a; }
    body { background-color:var(--dark-bg); color:white; font-family:'Assistant',sans-serif; overflow-x:hidden; }
    .nba-font { font-family:'Bebas Neue',cursive; }
    .glass { background:rgba(255,255,255,0.05); backdrop-filter:blur(10px); border:1px solid rgba(255,255,255,0.1); }
    .score-card:hover { transform:translateY(-5px); transition:all .3s ease; background:#1e1e24; box-shadow:0 10px 30px rgba(0,0,0,.5); }
    .loading-shimmer { background:linear-gradient(90deg,#16161a 25%,#2a2a30 50%,#16161a 75%); background-size:200% 100%; animation:shimmer 1.5s infinite; }
    @keyframes shimmer { 0%{background-position:200% 0;} 100%{background-position:-200% 0;} }
    ::-webkit-scrollbar{width:8px;} ::-webkit-scrollbar-track{background:var(--dark-bg);}
    ::-webkit-scrollbar-thumb{background:#333;border-radius:10px;} ::-webkit-scrollbar-thumb:hover{background:var(--nba-blue);}
    
    /* מסגרת עבה ובולטת לשעון */
    .thick-clock-frame { 
        border: 6px solid var(--nba-blue); 
        box-shadow: 0 0 25px rgba(0, 107, 182, 0.6); 
        background: rgba(0, 107, 182, 0.2); 
        text-shadow: 0 0 10px rgba(255, 255, 255, 0.5); 
    }
    
    .video-btn:hover { transform:scale(1.15); filter:brightness(1.2); }
  </style>
</head>

<body class="min-h-screen">

<nav class="sticky top-0 z-50 glass border-b border-white/10 px-4 md:px-6 py-4 flex justify-between items-center">
  <div class="flex items-center gap-4">
    <!-- לוגו NBA רשמי -->
    <img src="https://upload.wikimedia.org/wikipedia/en/0/03/National_Basketball_Association_logo.svg" alt="NBA Logo" class="h-14 w-auto drop-shadow-lg">
    <h1 class="text-xl md:text-2xl font-extrabold tracking-tight text-white">
      ה-NBA היומי של <span class="text-blue-500">איתמר ואבא</span>
    </h1>
  </div>

  <div class="flex items-center gap-3 md:gap-6">
    <div id="clock" class="text-xl md:text-3xl font-mono font-bold text-white px-6 py-2 rounded-2xl thick-clock-frame">
      00:00:00
    </div>
    <button class="bg-blue-600 hover:bg-blue-700 px-4 md:px-6 py-2 rounded-full font-bold text-sm transition shadow-lg shadow-blue-900/20 hidden sm:block uppercase tracking-widest">
      LIVE
    </button>
  </div>
</nav>

<main class="max-w-7xl mx-auto p-4 md:p-8">

  <header class="mb-12">
    <div class="flex flex-col md:flex-row md:items-end justify-between gap-8">
      <div>
        <h2 class="text-5xl md:text-7xl nba-font mb-2 tracking-wide">תוצאות וסטטיסטיקות</h2>
        <p id="status-indicator" class="text-gray-500 font-bold mt-2 tracking-widest uppercase text-xs">מערכת הנתונים בזמן אמת</p>
      </div>

      <div class="flex flex-col items-center md:items-end gap-3">
        <label class="text-xs font-bold text-gray-500 uppercase tracking-widest">בחר יום למשחקים</label>
        <!-- Forced dir="ltr" on the container to ensure arrows visual order (Left=Previous, Right=Next) -->
        <div class="flex items-center gap-4 bg-zinc-900 p-3 rounded-3xl border border-white/10 shadow-2xl" dir="ltr">
          
          <!-- Left Arrow (Previous Day) -->
          <button onclick="changeDate(-1)" class="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-red-600 transition group">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div class="flex flex-col items-center min-w-[200px]" dir="rtl">
            <span id="date-display-text" class="font-extrabold text-xl text-white">טוען תאריך...</span>
            <input type="date" id="date-picker" class="opacity-0 absolute w-0 h-0" value="">
            <button onclick="document.getElementById('date-picker').showPicker()" class="text-[11px] text-blue-500 font-bold hover:underline cursor-pointer mt-1">לוח שנה מלא</button>
          </div>

          <!-- Right Arrow (Next Day) -->
          <button onclick="changeDate(1)" class="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 hover:bg-blue-600 transition group">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>

  <div id="games-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    <div class="loading-shimmer h-64 rounded-3xl shadow-lg"></div>
    <div class="loading-shimmer h-64 rounded-3xl shadow-lg"></div>
    <div class="loading-shimmer h-64 rounded-2xl shadow-lg"></div>
  </div>

  <!-- Stats Modal -->
  <div id="stats-modal" class="fixed inset-0 z-[100] hidden flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
    <div class="bg-zinc-900 w-full max-w-6xl max-h-[90vh] rounded-[2.5rem] overflow-hidden border border-white/10 flex flex-col shadow-2xl">
      <div class="p-8 border-b border-white/10 flex justify-between items-center bg-gradient-to-r from-zinc-900 to-zinc-800">
        <h3 id="modal-title" class="text-3xl font-black text-white tracking-tight">סטטיסטיקות משחק</h3>
        <button onclick="closeModal()" class="w-12 h-12 flex items-center justify-center rounded-full hover:bg-white/10 text-gray-400 hover:text-white text-4xl transition">&times;</button>
      </div>
      <div class="p-4 md:p-10 overflow-y-auto flex-1 custom-scrollbar">
        <div id="stats-content" class="space-y-10">
          <div class="text-center py-20 text-gray-500">טוען נתוני שחקנים...</div>
        </div>
      </div>
    </div>
  </div>

</main>

<footer class="mt-20 border-t border-white/10 py-16 px-6 text-center text-gray-500">
  <p class="text-2xl font-bold mb-4 text-white">ה-NBA היומי של איתמר ואבא © 2026</p>
</footer>

<script>
/**
 * ============================
 * CONFIG & CORE LOGIC
 * ============================
 */
const apiKey = ""; // מוזרק אוטומטית על ידי הסביבה
let currentDate = new Date();
currentDate.setDate(currentDate.getDate() - 1);

const gamesContainer = document.getElementById('games-container');
const datePicker = document.getElementById('date-picker');
const dateDisplayText = document.getElementById('date-display-text');
const modal = document.getElementById('stats-modal');
const statsContent = document.getElementById('stats-content');
const modalTitle = document.getElementById('modal-title');
const clockElement = document.getElementById('clock');
const statusIndicator = document.getElementById('status-indicator');

/**
 * ============================
 * CLOCK
 * ============================
 */
function updateClock() {
  const now = new Date();
  clockElement.innerText = now.toLocaleTimeString('he-IL', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

/**
 * ============================
 * DATE LOGIC
 * ============================
 */
function updateDateUI() {
  const options = { weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit' };
  let dateStr = currentDate.toLocaleDateString('he-IL', options);
  
  // Fix double "Day" (יום יום)
  let cleanedDate = dateStr.replace(/^יום\s+/, '');
  dateDisplayText.innerText = `יום ${cleanedDate}`;
  
  const isoDate = currentDate.toISOString().split('T')[0];
  datePicker.value = isoDate;
  fetchGames(isoDate);
}

function changeDate(days) {
  currentDate.setDate(currentDate.getDate() + days);
  updateDateUI();
}

datePicker.addEventListener('change', (e) => {
  currentDate = new Date(e.target.value);
  updateDateUI();
});

/**
 * ============================
 * ROBUST GEMINI CALLER (Fixing 401/403)
 * ============================
 */
async function callGemini(prompt, schema = null) {
  // Using the specific stable model supported in this environment
  const model = "gemini-2.5-flash-preview-09-2025";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    tools: [{ "google_search": {} }],
    generationConfig: { 
      responseMimeType: "application/json",
      ...(schema && { responseSchema: schema })
    }
  };

  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        if ((res.status === 401 || res.status === 403 || res.status === 429) && i < maxRetries - 1) {
            // Exponential backoff
            await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
            continue;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      let text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!text) throw new Error("Empty response from AI");
      
      // Clean possible markdown if model ignored responseMimeType
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      
      return JSON.parse(text);
    } catch (err) {
      if (i === maxRetries - 1) throw err;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
}

/**
 * ============================
 * GAMES FETCHING
 * ============================
 */
async function fetchGames(date) {
  gamesContainer.innerHTML = Array(3).fill('<div class="loading-shimmer h-64 rounded-3xl shadow-lg"></div>').join('');
  statusIndicator.innerText = "מושך נתונים...";

  const prompt = `Search for official NBA scores for the date ${date}. 
  Identify the final scores and winners. 
  CRITICAL: Translate all team names, abbreviations, and status (e.g. Final -> סופי) to HEBREW.
  Team abbreviation should be in Hebrew short form (e.g. LAL -> לייקרס).
  Format as JSON.`;

  const schema = {
    type: "OBJECT",
    properties: {
      games: {
        type: "ARRAY",
        items: {
          type: "OBJECT",
          properties: {
            id: { type: "NUMBER" },
            status: { type: "STRING" },
            home_team: { type: "OBJECT", properties: { name: { type: "STRING" }, abbr: { type: "STRING" } } },
            visitor_team: { type: "OBJECT", properties: { name: { type: "STRING" }, abbr: { type: "STRING" } } },
            home_score: { type: "NUMBER" },
            visitor_score: { type: "NUMBER" }
          },
          required: ["id", "status", "home_team", "visitor_team", "home_score", "visitor_score"]
        }
      }
    },
    required: ["games"]
  };

  try {
    const data = await callGemini(prompt, schema);
    
    if (!data || !data.games || data.games.length === 0) {
      gamesContainer.innerHTML = `<div class="col-span-full py-32 text-center text-gray-500 font-bold bg-zinc-900/40 rounded-[3rem] border-2 border-dashed border-white/5 text-2xl tracking-tighter">אין משחקי NBA בתאריך זה.</div>`;
      statusIndicator.innerText = "אין משחקים";
      return;
    }
    
    renderGames(data.games);
    statusIndicator.innerText = "הנתונים עודכנו בהצלחה";
  } catch (err) {
    console.error("Fetch Error:", err);
    gamesContainer.innerHTML = `
      <div class="col-span-full py-20 text-center bg-red-900/10 rounded-3xl border border-red-500/20">
        <p class="text-red-500 mb-4 font-black text-2xl tracking-tight">שגיאת חיבור לענן (Status: ${err.message})</p>
        <button onclick="fetchGames('${date}')" class="bg-red-600 px-12 py-5 rounded-full hover:bg-red-700 font-black transition shadow-2xl text-white">נסה שוב כעת</button>
      </div>`;
    statusIndicator.innerText = "שגיאת חיבור";
  }
}

function renderGames(games) {
  gamesContainer.innerHTML = games.map(game => {
    const homeWinner = game.home_score > game.visitor_score;
    const visitorWinner = game.visitor_score > game.home_score;
    const youtubeUrl = `https://www.youtube.com/@NBA/search?query=${encodeURIComponent(game.home_team.name + ' vs ' + game.visitor_team.name + ' highlights recap')}`;

    return `
      <div class="score-card glass p-8 rounded-[2.5rem] relative flex flex-col transition-all border border-white/5 shadow-xl">
        <div class="flex justify-between items-center mb-6">
          <span class="text-[11px] font-black px-4 py-2 rounded-full bg-zinc-800 text-gray-300 uppercase tracking-widest border border-white/10">
            ${game.status || 'סופי'}
          </span>
        </div>

        <div class="flex justify-between items-center gap-2 flex-1">
          <!-- Home Team -->
          <div class="flex flex-col items-center text-center flex-1 cursor-pointer" onclick="showStats(${game.id}, '${game.home_team.name}', '${game.visitor_team.name}')">
            <div class="w-20 h-20 bg-gradient-to-br from-blue-600/30 to-blue-900/20 rounded-[1.5rem] mb-4 flex items-center justify-center text-xl font-black text-blue-400 border border-blue-500/30 shadow-2xl">
              ${game.home_team.abbr || 'NBA'}
            </div>
            <span class="font-black text-sm h-10 flex items-center leading-tight tracking-tighter overflow-hidden text-ellipsis">${game.home_team.name}</span>
          </div>

          <!-- Score & Video Center -->
          <div class="flex flex-col items-center px-4 flex-shrink-0">
            <div class="text-5xl nba-font tracking-tighter flex items-center gap-4 mb-6 cursor-pointer" onclick="showStats(${game.id}, '${game.home_team.name}', '${game.visitor_team.name}')">
              <span class="${homeWinner ? 'text-white' : 'text-gray-600'}">${game.home_score}</span>
              <span class="text-zinc-800 text-3xl">:</span>
              <span class="${visitorWinner ? 'text-white' : 'text-gray-600'}">${game.visitor_score}</span>
            </div>

            <a href="${youtubeUrl}" target="_blank" class="video-btn flex flex-col items-center gap-2 group transition-all" title="צפה בתקציר">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 fill-current text-red-600 group-hover:text-red-500 drop-shadow-2xl" viewBox="0 0 24 24">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              <span class="text-[9px] font-black text-gray-400 group-hover:text-white transition-colors uppercase tracking-widest whitespace-nowrap">תקציר המשחק</span>
            </a>
          </div>

          <!-- Visitor Team -->
          <div class="flex flex-col items-center text-center flex-1 cursor-pointer" onclick="showStats(${game.id}, '${game.home_team.name}', '${game.visitor_team.name}')">
            <div class="w-20 h-20 bg-gradient-to-br from-red-600/30 to-red-900/20 rounded-[1.5rem] mb-4 flex items-center justify-center text-xl font-black text-red-400 border border-red-500/30 shadow-2xl">
              ${game.visitor_team.abbr || 'NBA'}
            </div>
            <span class="font-black text-sm h-10 flex items-center leading-tight tracking-tighter overflow-hidden text-ellipsis">${game.visitor_team.name}</span>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-white/5 flex justify-center">
          <button onclick="showStats(${game.id}, '${game.home_team.name}', '${game.visitor_team.name}')" class="text-[11px] font-black text-blue-500 hover:text-white transition uppercase tracking-widest">סטטיסטיקה מלאה &larr;</button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * ============================
 * PLAYER STATS
 * ============================
 */
async function showStats(gameId, homeTeam, visitorTeam) {
  modalTitle.innerText = `${homeTeam} נגד ${visitorTeam}`;
  statsContent.innerHTML = `<div class="loading-shimmer h-96 rounded-[2rem]"></div>`;
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';

  const prompt = `Find the full box score and stats for: ${homeTeam} vs ${visitorTeam}. 
  Translate player names, positions, and stats to HEBREW. Return as JSON.`;

  const schema = {
    type: "OBJECT",
    properties: {
      home: { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING" }, pos: { type: "STRING" }, pts: { type: "NUMBER" }, reb: { type: "NUMBER" }, ast: { type: "NUMBER" } } } },
      visitor: { type: "ARRAY", items: { type: "OBJECT", properties: { name: { type: "STRING" }, pos: { type: "STRING" }, pts: { type: "NUMBER" }, reb: { type: "NUMBER" }, ast: { type: "NUMBER" } } } }
    }
  };

  try {
    const data = await callGemini(prompt, schema);
    renderStats(data, homeTeam, visitorTeam);
  } catch (err) {
    statsContent.innerHTML = `<p class="text-red-500 text-center font-black text-2xl py-24">אירעה שגיאה בטעינת הנתונים.</p>`;
  }
}

function renderStats(data, homeTeam, visitorTeam) {
  const buildTable = (players, teamName, colorClass) => {
    return `
      <div class="mb-14">
        <h4 class="text-3xl font-black mb-8 ${colorClass} tracking-tight flex items-center gap-4">
          <span class="w-3 h-10 bg-current rounded-full"></span>
          ${teamName}
        </h4>
        <div class="overflow-x-auto rounded-[2rem] border border-white/5 bg-zinc-800/30 p-6 shadow-2xl">
          <table class="w-full text-right text-sm">
            <thead class="text-gray-500 font-black border-b border-white/10 uppercase tracking-widest text-[10px]">
              <tr><th class="py-5 pr-8">שחקן</th><th class="py-5">נק'</th><th class="py-5">ריב'</th><th class="py-5">אס'</th></tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              ${(players || []).map(p => `
                <tr class="hover:bg-white/5 transition group">
                  <td class="py-5 pr-8 font-black text-white group-hover:text-blue-400">
                    ${p.name} <span class="text-[10px] text-gray-500 font-normal opacity-50">(${p.pos || '-'})</span>
                  </td>
                  <td class="py-5 font-black text-white text-xl">${p.pts || 0}</td>
                  <td class="py-5 text-gray-300">${p.reb || 0}</td>
                  <td class="py-5 text-gray-300">${p.ast || 0}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  statsContent.innerHTML = buildTable(data.home || [], homeTeam, 'text-blue-500') + buildTable(data.visitor || [], visitorTeam, 'text-red-500');
}

function closeModal() {
  modal.classList.add('hidden');
  document.body.style.overflow = 'auto';
}

window.onclick = (e) => { if (e.target == modal) closeModal(); };
window.onload = updateDateUI;
</script>

</body>
</html>