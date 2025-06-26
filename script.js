document.addEventListener("DOMContentLoaded", () => {
  const teams = [
    { name: "Red Raptors", color: "red", players: [], captain: "" },
    { name: "Green Smashers", color: "green", players: [], captain: "" },
    { name: "Blue Blasters", color: "blue", players: [], captain: "" },
    { name: "Yellow Flyers", color: "gold", players: [], captain: "" },
    { name: "Purple Hurricanes", color: "purple", players: [], captain: "" }
  ];

  const stats = {
    doubles: [],
    singles: [],
    teamDoubles: {},
    teamSingles: {}
  };

  const submittedMatches = new Set();

  const captainDetailsDiv = document.getElementById("captainDetails");
  const playerEntryDiv = document.getElementById("playerEntry");

  function renderCaptains() {
    captainDetailsDiv.innerHTML = "";
    teams.forEach((team, index) => {
      const div = document.createElement("div");
      div.innerHTML = `<label style="color:${team.color}; font-weight:bold;">${team.name} Captain:</label>
        <input type="text" data-team-index="${index}" class="captain-input" placeholder="Captain Name" />`;
      captainDetailsDiv.appendChild(div);
    });
  }

  function renderPlayerInputs() {
    playerEntryDiv.innerHTML = "<h3>Enter 5 Players for Each Team</h3>";
    teams.forEach((team, index) => {
      const teamDiv = document.createElement("div");
      teamDiv.innerHTML = `<h4 style="color:${team.color};">${team.name}</h4>`;
      for (let i = 0; i < 5; i++) {
        const input = document.createElement("input");
        input.placeholder = `Player ${i + 1} Name`;
        input.dataset.teamIndex = index;
        input.classList.add("player-name-input");
        teamDiv.appendChild(input);
      }
      playerEntryDiv.appendChild(teamDiv);
    });
  }

  function collectTeamData() {
    teams.forEach(team => {
      team.players = [];
    });
    document.querySelectorAll(".captain-input").forEach(input => {
      const index = input.dataset.teamIndex;
      teams[index].captain = input.value.trim();
    });
    document.querySelectorAll(".player-name-input").forEach(input => {
      const index = input.dataset.teamIndex;
      if (!teams[index].players.includes(input.value.trim()) && input.value.trim()) {
        teams[index].players.push(input.value.trim());
      }
    });
  }

  function generateFixtures() {
    collectTeamData();
    const fixtures = [];
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        fixtures.push([teams[i].name, teams[j].name]);
      }
    }
    renderMatchForms("doublesFixtures", fixtures, true);
    renderMatchForms("singlesFixtures", fixtures, false);
  }

  function renderMatchForms(containerId, fixtures, isDoubles) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    fixtures.forEach(([teamA, teamB]) => {
      const matchDiv = document.createElement("div");
      matchDiv.className = "fixture-block";
      matchDiv.innerHTML = `<div class="fixture-header">${teamA} vs ${teamB}</div>`;
      const form = document.createElement("form");
      form.classList.add("match-form");
      form.dataset.fixture = `${teamA}_vs_${teamB}_${isDoubles ? "D" : "S"}`;

      const count = isDoubles ? 3 : 2;
      for (let i = 1; i <= count; i++) {
        const section = document.createElement("div");
        section.className = "fixture-line";

        section.innerHTML = `
          <label>Pair ${i}:</label>
          <select required name="teamAPlayer1">${getPlayerOptions(teamA)}</select>
          ${isDoubles ? `<select required name="teamAPlayer2">${getPlayerOptions(teamA)}</select>` : ""}
          <label><input type="checkbox" name="teamATrump" /> Trump</label>
          <select required name="teamBPlayer1">${getPlayerOptions(teamB)}</select>
          ${isDoubles ? `<select required name="teamBPlayer2">${getPlayerOptions(teamB)}</select>` : ""}
          <label><input type="checkbox" name="teamBTrump" /> Trump</label>
          <select required name="winner">
            <option value="">Select Winner</option>
            <option value="${teamA}">${teamA}</option>
            <option value="${teamB}">${teamB}</option>
          </select>`;
        form.appendChild(section);
      }

      const btn = document.createElement("button");
      btn.type = "submit";
      btn.className = "small-button";
      btn.textContent = "Submit Match";
      form.appendChild(btn);
      form.addEventListener("submit", e => handleMatchSubmit(e, teamA, teamB, isDoubles));
      matchDiv.appendChild(form);
      container.appendChild(matchDiv);
    });
  }

  function getPlayerOptions(teamName) {
    const team = teams.find(t => t.name === teamName);
    const all = [team.captain, ...team.players];
    return all.map(p => `<option value="${p}">${p}</option>`).join("");
  }

  function handleMatchSubmit(e, teamA, teamB, isDoubles) {
    e.preventDefault();
    const form = e.target;
    const fixtureId = form.dataset.fixture;
    if (submittedMatches.has(fixtureId)) {
      alert("Already submitted!");
      return;
    }

    const selects = form.querySelectorAll("select");
    const checkboxes = form.querySelectorAll("input[type=checkbox]");

    const lines = form.querySelectorAll(".fixture-line");
    for (const line of lines) {
      const selectsInLine = line.querySelectorAll("select");
      const checkboxesInLine = line.querySelectorAll("input[type=checkbox]");
      const [a1, a2, b1, b2, winner] = isDoubles
        ? [selectsInLine[0], selectsInLine[1], selectsInLine[2], selectsInLine[3], selectsInLine[4]]
        : [selectsInLine[0], null, selectsInLine[1], null, selectsInLine[2]];

      if (!a1.value || !b1.value || !winner.value || (isDoubles && (!a2.value || !b2.value))) {
        alert("Please fill all fields before submitting.");
        return;
      }

      const aTrump = checkboxesInLine[0].checked;
      const bTrump = checkboxesInLine[1].checked;
      const isTrumpWin = (aTrump && winner.value === teamA) || (bTrump && winner.value === teamB);
      const isTrumpLoss = (aTrump && winner.value === teamB) || (bTrump && winner.value === teamA);
      const point = isTrumpWin ? 2 : isTrumpLoss ? -1 : 1;

      stats[isDoubles ? "doubles" : "singles"].push({
        teamA, teamB, a1: a1.value, a2: a2?.value || '', b1: b1.value, b2: b2?.value || '', win: winner.value,
        isTrump: isTrumpWin, isTrumpLost: isTrumpLoss, point
      });

      updateTeamStats(winner.value, isDoubles, point);
    }

    submittedMatches.add(fixtureId);
    renderStats();
  }

  function updateTeamStats(teamName, isDoubles, point) {
    const key = isDoubles ? "teamDoubles" : "teamSingles";
    if (!stats[key][teamName]) stats[key][teamName] = { wins: 0, losses: 0, points: 0 };
    if (point > 0) stats[key][teamName].wins += 1;
    if (point < 0) stats[key][teamName].losses += 1;
    stats[key][teamName].points += point;
  }

  function renderStats() {
    document.getElementById("doublesStats").innerHTML =
      "<h3>Doubles Stats</h3>" + buildMatchTable(stats.doubles, true);
    document.getElementById("singlesStats").innerHTML =
      "<h3>Singles Stats</h3>" + buildMatchTable(stats.singles, false);
    document.getElementById("teamStatsDoubles").innerHTML =
      "<h3>Team Doubles Stats</h3>" + buildTeamTable(stats.teamDoubles);
    document.getElementById("teamStatsSingles").innerHTML =
      "<h3>Team Singles Stats</h3>" + buildTeamTable(stats.teamSingles);
  }

  function buildMatchTable(data, isDoubles) {
    const rows = data.map(d =>
      `<tr>
        <td>${d.teamA}</td>
        <td>${d.a1}${isDoubles ? " & " + d.a2 : ""}</td>
        <td>${d.teamB}</td>
        <td>${d.b1}${isDoubles ? " & " + d.b2 : ""}</td>
        <td>${d.win}</td>
        <td>${d.isTrump ? "Trump Win" : d.isTrumpLost ? "Trump Loss" : "Normal"}</td>
        <td>${d.point}</td>
      </tr>`
    ).join("");
    return `<table><tr><th>Team A</th><th>Pair A</th><th>Team B</th><th>Pair B</th><th>Winner</th><th>Type</th><th>Points</th></tr>${rows}</table>`;
  }

  function buildTeamTable(data) {
    const rows = Object.entries(data).map(([team, val]) =>
      `<tr><td>${team}</td><td>${val.wins}</td><td>${val.losses}</td><td>${val.points}</td></tr>`
    ).join("");
    return `<table><tr><th>Team</th><th>Wins</th><th>Losses</th><th>Points</th></tr>${rows}</table>`;
  }

  document.getElementById("generateFixtures").onclick = generateFixtures;
  document.getElementById("toggleDarkMode").onclick = () => document.body.classList.toggle("dark-mode");
  document.getElementById("resetTournament").onclick = () => location.reload();
  document.getElementById("exportExcel").onclick = () => {
    let csv = "Match Type,Team A,Pair A,Team B,Pair B,Winner,Type,Points\n";
    const all = stats.doubles.concat(stats.singles);
    all.forEach(d => {
      const isDoubles = d.a2 && d.b2;
      csv += `${isDoubles ? "Doubles" : "Singles"},${d.teamA},"${d.a1}${isDoubles ? ' & ' + d.a2 : ''}",${d.teamB},"${d.b1}${isDoubles ? ' & ' + d.b2 : ''}",${d.win},${d.isTrump ? "Trump Win" : d.isTrumpLost ? "Trump Loss" : "Normal"},${d.point}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "tournament_stats.csv";
    a.click();
  };

  document.querySelectorAll(".tab-button").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(tab => tab.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  renderCaptains();
  renderPlayerInputs();
});
