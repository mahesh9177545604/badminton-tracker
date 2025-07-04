// script.js - Final version using Firebase Modular SDK

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDyn7Khn-nLY_9w9hjx1FExQWy4AntHxjU",
  authDomain: "smash-clash-data.firebaseapp.com",
  projectId: "smash-clash-data",
  databaseURL: "https://smash-clash-data-default-rtdb.firebaseio.com",
  storageBucket: "smash-clash-data.appspot.com",
  messagingSenderId: "479731411827",
  appId: "1:479731411827:web:d2b84774f634a4c702b306",
  measurementId: "G-SSMP0F2K39"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const dbRef = ref(db);

// Determine mode
const isEditor = typeof window.isEditor !== 'undefined' ? window.isEditor : false;

document.addEventListener("DOMContentLoaded", () => {
  const teams = [
    { name: "Red Rhinos", color: "red", players: [], captain: "" },
    { name: "Orange Owls", color: "Orange", players: [], captain: "" },
    { name: "Black Bears", color: "Black", players: [], captain: "" },
    { name: "Yellow yaks", color: "Yellow", players: [], captain: "" },
    { name: "Purple Pythons", color: "purple", players: [], captain: "" },
    { name: "Pink Pumas", color: "Pink", players: [], captain: "" }
  ];

  const stats = {
    doubles: [], singles: [],
    teamDoubles: {}, teamSingles: {},
    playerDoubles: {}, playerSingles: {}
  };

  const submittedMatches = new Set();

  function renderCaptains() {
    const div = document.getElementById("captainDetails");
    div.innerHTML = "";
    teams.forEach((team, i) => {
      const input = document.createElement("input");
      input.placeholder = `${team.name} Captain`;
      input.dataset.teamIndex = i;
      input.classList.add("captain-input");
      input.disabled = !isEditor;
      div.appendChild(input);
    });
  }

  function renderPlayerInputs() {
    const div = document.getElementById("playerEntry");
    div.innerHTML = "<h3>Players:</h3>";
    teams.forEach((team, i) => {
      const teamDiv = document.createElement("div");
      teamDiv.innerHTML = `<h4>${team.name}</h4>`;
      for (let j = 0; j < 5; j++) {
        const input = document.createElement("input");
        input.placeholder = "Player " + (j + 1);
        input.dataset.teamIndex = i;
        input.classList.add("player-name-input");
        input.disabled = !isEditor;
        teamDiv.appendChild(input);
      }
      div.appendChild(teamDiv);
    });
  }

  function getPlayerOptions(teamName) {
    const team = teams.find(t => t.name === teamName);
    if (!team) return "";
    return [team.captain, ...team.players].filter(Boolean)
      .map(p => `<option value="${p}">${p}</option>`).join("");
  }

  function updateTeamDataFromInputs() {
    document.querySelectorAll(".captain-input").forEach(input => {
      const idx = input.dataset.teamIndex;
      teams[idx].captain = input.value.trim();
    });
    document.querySelectorAll(".player-name-input").forEach(input => {
      const idx = input.dataset.teamIndex;
      const name = input.value.trim();
      if (name && !teams[idx].players.includes(name)) {
        teams[idx].players.push(name);
      }
    });
  }

  function renderFixtures(containerId, isDoubles) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        const teamA = teams[i].name;
        const teamB = teams[j].name;
        const form = document.createElement("form");
        form.classList.add("match-form");
        form.dataset.fixture = `${teamA}_vs_${teamB}_${isDoubles ? "D" : "S"}`;

        form.innerHTML = `<h4>${teamA} vs ${teamB}</h4>`;
        const count = isDoubles ? 3 : 2;

        for (let k = 0; k < count; k++) {
          form.innerHTML += `
            <div class="pair-entry">
              <select name="teamAPlayer1">${getPlayerOptions(teamA)}</select>
              ${isDoubles ? `<select name="teamAPlayer2">${getPlayerOptions(teamA)}</select>` : ""}
              <input type="checkbox" name="teamATrump" />
              <select name="teamBPlayer1">${getPlayerOptions(teamB)}</select>
              ${isDoubles ? `<select name="teamBPlayer2">${getPlayerOptions(teamB)}</select>` : ""}
              <input type="checkbox" name="teamBTrump" />
              <select name="winner">
                <option value="">Winner</option>
                <option value="${teamA}">${teamA}</option>
                <option value="${teamB}">${teamB}</option>
              </select>
            </div>`;
        }

        const submit = document.createElement("button");
        submit.type = "submit";
        submit.textContent = "Submit Match";
        submit.disabled = !isEditor;
        form.appendChild(submit);

        form.addEventListener("submit", e => handleMatchSubmit(e, teamA, teamB, isDoubles));
        container.appendChild(form);
      }
    }
  }

  function handleMatchSubmit(e, teamA, teamB, isDoubles) {
    e.preventDefault();
    const form = e.target;
    const fixtureId = form.dataset.fixture;
    if (submittedMatches.has(fixtureId)) {
      alert("Already submitted.");
      return;
    }

    const pairs = form.querySelectorAll(".pair-entry");
    const trumpUsed = { [teamA]: false, [teamB]: false };

    for (let pair of pairs) {
      const selects = pair.querySelectorAll("select");
      const checks = pair.querySelectorAll("input[type='checkbox']");
      const [a1, a2, b1, b2, win] = isDoubles
        ? [selects[0], selects[1], selects[2], selects[3], selects[4]]
        : [selects[0], null, selects[1], null, selects[2]];

      const aTrump = checks[0].checked;
      const bTrump = checks[1].checked;

      if (!a1.value || !b1.value || !win.value || (isDoubles && (!a2.value || !b2.value))) {
        alert("Fill all fields.");
        return;
      }
      if (aTrump && trumpUsed[teamA]) return alert(`${teamA} already used Trump.`);
      if (bTrump && trumpUsed[teamB]) return alert(`${teamB} already used Trump.`);

      const winner = win.value;
      const loser = winner === teamA ? teamB : teamA;
      const winnerTrump = winner === teamA ? aTrump : bTrump;
      const loserTrump = winner === teamA ? bTrump : aTrump;

      const winnerPts = winnerTrump ? 2 : 1;
      const loserPts = loserTrump ? -1 : 0;

      stats[isDoubles ? "doubles" : "singles"].push({
        teamA, teamB, a1: a1.value, a2: a2?.value, b1: b1.value, b2: b2?.value, win: winner,
        isTrump: winnerTrump, isTrumpLost: loserTrump, point: winnerPts
      });

      updateTeamStats(winner, isDoubles, winnerPts);
      updateTeamStats(loser, isDoubles, loserPts);
      updatePlayerStats(winner, [a1.value, a2?.value], winnerPts, isDoubles);
      updatePlayerStats(loser, [b1.value, b2?.value], loserPts, isDoubles);

      if (aTrump) trumpUsed[teamA] = true;
      if (bTrump) trumpUsed[teamB] = true;
    }

    submittedMatches.add(fixtureId);
    renderStats();
    if (isEditor) saveToFirebase();
  }

  function updateTeamStats(team, isDoubles, pts) {
    const key = isDoubles ? "teamDoubles" : "teamSingles";
    if (!stats[key][team]) stats[key][team] = { wins: 0, losses: 0, points: 0 };
    if (pts > 0) stats[key][team].wins++;
    if (pts < 0) stats[key][team].losses++;
    stats[key][team].points += pts;
  }

  function updatePlayerStats(team, players, pts, isDoubles) {
    const key = isDoubles ? "playerDoubles" : "playerSingles";
    players.forEach(p => {
      if (!p) return;
      if (!stats[key][p]) stats[key][p] = { wins: 0, losses: 0, points: 0 };
      if (pts > 0) stats[key][p].wins++;
      if (pts < 0) stats[key][p].losses++;
      stats[key][p].points += pts;
    });
  }

  function buildTable(data, isDoubles) {
    return `<table><tr><th>Team A</th><th>Pair A</th><th>Team B</th><th>Pair B</th><th>Winner</th><th>Type</th><th>Points</th></tr>` +
      data.map(d => `<tr>
        <td>${d.teamA}</td><td>${d.a1}${isDoubles ? " & " + d.a2 : ""}</td>
        <td>${d.teamB}</td><td>${d.b1}${isDoubles ? " & " + d.b2 : ""}</td>
        <td>${d.win}</td><td>${d.isTrump ? "Trump Win" : d.isTrumpLost ? "Trump Loss" : "Normal"}</td>
        <td>${d.point}</td>
      </tr>`).join("") + "</table>";
  }

  function buildStatTable(obj, label) {
    return `<h4>${label}</h4><table><tr><th>Name</th><th>Wins</th><th>Losses</th><th>Points</th></tr>` +
      Object.entries(obj).map(([name, val]) =>
        `<tr><td>${name}</td><td>${val.wins}</td><td>${val.losses}</td><td>${val.points}</td></tr>`
      ).join("") + "</table>";
  }

  function renderStats() {
    document.getElementById("doublesStats").innerHTML = buildTable(stats.doubles, true);
    document.getElementById("singlesStats").innerHTML = buildTable(stats.singles, false);
    document.getElementById("teamStatsDoubles").innerHTML = buildStatTable(stats.teamDoubles, "Team Doubles");
    document.getElementById("teamStatsSingles").innerHTML = buildStatTable(stats.teamSingles, "Team Singles");
    document.getElementById("playerStatsDoubles").innerHTML = buildStatTable(stats.playerDoubles, "Player Doubles");
    document.getElementById("playerStatsSingles").innerHTML = buildStatTable(stats.playerSingles, "Player Singles");
  }

  function saveToFirebase() {
    const payload = { teams, stats };
    set(ref(db, "tournamentData"), payload);
  }

  function loadFromFirebase() {
    get(child(dbRef, "tournamentData")).then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        data.teams.forEach((team, i) => {
          teams[i].captain = team.captain;
          teams[i].players = team.players;
        });
        Object.assign(stats, data.stats);
        renderStats();
        renderFixtures("doublesFixtures", true);
        renderFixtures("singlesFixtures", false);
      }
    });
  }

  // UI Handlers
  document.getElementById("generateFixtures").onclick = () => {
    updateTeamDataFromInputs();
    renderFixtures("doublesFixtures", true);
    renderFixtures("singlesFixtures", false);
    if (isEditor) saveToFirebase();
  };

  document.getElementById("toggleDarkMode").onclick = () => {
    document.body.classList.toggle("dark-mode");
  };

  document.getElementById("resetTournament").onclick = () => {
    if (confirm("Are you sure you want to reset all data?")) location.reload();
  };

  renderCaptains();
  renderPlayerInputs();
  if (!isEditor) loadFromFirebase();
});
