{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const gamesContainer = document.getElementById('games-container');\
const datePicker = document.getElementById('date-picker');\
let currentDate = new Date();\
\
function updateDateUI() \{\
    const isoDate = currentDate.toISOString().split('T')[0];\
    datePicker.value = isoDate;\
    fetchGames(isoDate);\
\}\
\
function changeDate(days) \{\
    currentDate.setDate(currentDate.getDate() + days);\
    updateDateUI();\
\}\
\
datePicker.addEventListener('change', (e) => \{\
    currentDate = new Date(e.target.value);\
    updateDateUI();\
\});\
\
async function fetchGames(date) \{\
    gamesContainer.innerHTML = `<p class="text-gray-500 font-bold py-10 text-center">\uc0\u1496 \u1493 \u1506 \u1503  \u1502 \u1513 \u1495 \u1511 \u1497 \u1501 ...</p>`;\
\
    try \{\
        const res = await fetch(`https://www.balldontlie.io/api/v1/games?start_date=$\{date\}&end_date=$\{date\}`);\
        const data = await res.json();\
        if (!data.data || data.data.length === 0) \{\
            gamesContainer.innerHTML = `<p class="text-gray-500 font-bold py-10 text-center">\uc0\u1488 \u1497 \u1503  \u1502 \u1513 \u1495 \u1511 \u1497  NBA \u1489 \u1514 \u1488 \u1512 \u1497 \u1498  \u1494 \u1492 .</p>`;\
            return;\
        \}\
\
        gamesContainer.innerHTML = data.data.map(game => \{\
            return `\
                <div class="score-card glass p-4 rounded-xl mb-4">\
                    <div class="flex justify-between items-center mb-2">\
                        <span class="text-xs font-bold text-gray-400 uppercase">$\{game.status || 'Final'\}</span>\
                    </div>\
                    <div class="flex justify-between items-center">\
                        <div class="text-center">\
                            <p class="font-bold">$\{game.home_team.abbreviation\}</p>\
                            <p>$\{game.home_team.full_name\}</p>\
                        </div>\
                        <div class="text-center">\
                            <p class="text-xl font-extrabold">$\{game.home_team_score\} : $\{game.visitor_team_score\}</p>\
                        </div>\
                        <div class="text-center">\
                            <p class="font-bold">$\{game.visitor_team.abbreviation\}</p>\
                            <p>$\{game.visitor_team.full_name\}</p>\
                        </div>\
                    </div>\
                    <div class="mt-2 text-center">\
                        <a href="https://www.youtube.com/@NBA/search?query=$\{encodeURIComponent(game.home_team.full_name + ' vs ' + game.visitor_team.full_name + ' highlights')\}" target="_blank" class="text-red-500 text-xs font-bold">\uc0\u1505 \u1497 \u1499 \u1493 \u1501  \u1492 \u1502 \u1513 \u1495 \u1511 </a>\
                    </div>\
                </div>\
            `;\
        \}).join('');\
\
    \} catch (err) \{\
        console.error(err);\
        gamesContainer.innerHTML = `<p class="text-red-500 font-bold py-10 text-center">\uc0\u1513 \u1490 \u1497 \u1488 \u1492  \u1489 \u1496 \u1506 \u1497 \u1504 \u1514  \u1492 \u1502 \u1513 \u1495 \u1511 \u1497 \u1501 . \u1504 \u1505 \u1492  \u1513 \u1493 \u1489 .</p>`;\
    \}\
\}\
\
window.onload = updateDateUI;}