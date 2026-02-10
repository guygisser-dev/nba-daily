const gamesContainer = document.getElementById("games-container");
const clock = document.getElementById("clock");

// עדכון השעה
function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString("he-IL", { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

// פונקציה להביא משחקים מה-API
async function fetchGames() {
    const today = new Date().toISOString().split("T")[0];
    const url = `https://www.balldontlie.io/api/v1/games?dates[]=${today}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        displayGames(data.data);
    } catch (error) {
        console.error("שגיאה בטעינת המשחקים:", error);
        gamesContainer.innerHTML = "<p>לא הצלחנו להביא את המשחקים להיום.</p>";
    }
}

// הצגת המשחקים
function displayGames(games) {
    gamesContainer.innerHTML = "";
    if (games.length === 0) {
        gamesContainer.innerHTML = "<p>אין משחקים היום.</p>";
        return;
    }

    games.forEach(game => {
        const div = document.createElement("div");
        div.className = "game";

        div.innerHTML = `
            <h2>${game.home_team.abbreviation} ${game.home_team_score} - ${game.visitor_team_score} ${game.visitor_team.abbreviation}</h2>
            <div class="summary-link" onclick="window.open('https://www.youtube.com/results?search_query=${game.home_team.full_name}+vs+${game.visitor_team.full_name}+highlights', '_blank')">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg" alt="YouTube Logo">
                <span>סיכום המשחק</span>
            </div>
        `;

        gamesContainer.appendChild(div);
    });
}

// קריאה ראשונית
fetchGames();