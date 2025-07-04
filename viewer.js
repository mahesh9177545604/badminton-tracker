// viewer.js - Read-only viewer for Smash Clash index.html

const firebaseConfig = {
  apiKey: "AIzaSyDyn7Khn-nLY_9w9hjx1FExQWy4AntHxjU",
  authDomain: "smash-clash-data.firebaseapp.com",
  databaseURL: "https://smash-clash-data-default-rtdb.firebaseio.com",
  projectId: "smash-clash-data",
  storageBucket: "smash-clash-data.appspot.com",
  messagingSenderId: "479731411827",
  appId: "1:479731411827:web:d2b84774f634a4c702b306",
  measurementId: "G-SSMP0F2K39"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const doublesStatDiv = document.getElementById("doublesStats");
const singlesStatDiv = document.getElementById("singlesStats");
const teamD = document.getElementById("teamStatsDoubles");
const teamS = document.getElementById("teamStatsSingles");
const captainDetailsDiv = document.getElementById("captainDetails");
const playerEntryDiv = document.getElementById("playerEntry");

firebase.database().ref("tournamentData").once("value").then(snapshot => {
  const data = snapshot.val();
  if (!data) {
    document.body.innerHTML += "<p style='text-align:center;'>No tournament data found.</p>";
    return;
  }

  renderCaptains(data.teams || []);
  renderPlayers(data.teams || []);
  renderStats("doubles", data.stats?.doubles || [], doublesStatDiv);
  renderStats("singles", data.stats?.singles || [], singlesStatDiv);
  renderTeamStats(data.stats?.teamDoubles || {}, teamD, "Doubles");
  renderTeamStats(data.stats?.teamSingles || {}, teamS, "Singles");
});

function renderCaptains(teams) {
  captainDetailsDiv.innerHTML = "<h3>Captains</h3>";
  teams.forEach(team => {
    const div = document.createElement("div");
    div.innerHTML = `<strong style="color:${team.color}">${team.name}</strong>: ${team.captain || "N/A"}`;
    captainDetailsDiv.appendChild(div);
  });
}

function renderPlayers(teams) {
  playerEntryDiv.innerHTML = "<h3>Players</h3>";
  teams.forEach(team => {
    const div = document.createElement("div");
    div.innerHTML = `<strong style="color:${team.color}">${team.name}</strong>: ${[...team.players].join(", ")}`;
    playerEntryDiv.appendChild(div);
  });
}

function renderStats(label, matches, container) {
  const isDoubles = label === "doubles";
  if (!matches.length) {
    container.innerHTML = `<p>No ${label} matches played yet.</p>`;
    return;
  }

  const rows = matches.map(d =>
    `<tr>
      <td>${d.teamA}</td>
      <td>${d.a1}${isDoubles ? " & " + d.a2 : ""}</td>
      <td>${d.teamB}</td>
      <td>${d.b1}${isDoubles ? " & " + d.b2 : ""}</td>
      <td>${d.win}</td>
      <td>${d.isTrump ? "Trump Win" : d.isTrumpLost ? "Trump Loss" : "Normal"}</td>
      <td>${d.point}</td>
    </tr>`).join("");

  container.innerHTML = `
    <h3>${label[0].toUpperCase() + label.slice(1)} Stats</h3>
    <table>
      <tr><th>Team A</th><th>Pair A</th><th>Team B</th><th>Pair B</th><th>Winner</th><th>Type</th><th>Points</th></tr>
      ${rows}
    </table>
  `;
}

function renderTeamStats(obj, container, title) {
  const keys = Object.keys(obj);
  if (!keys.length) {
    container.innerHTML = `<p>No ${title} team stats available.</p>`;
    return;
  }

  const rows = keys.map(team => {
    const s = obj[team];
    return `<tr><td>${team}</td><td>${s.wins}</td><td>${s.losses}</td><td>${s.points}</td></tr>`;
  }).join("");

  container.innerHTML = `
    <h3>${title} Team Stats</h3>
    <table>
      <tr><th>Team</th><th>Wins</th><th>Losses</th><th>Points</th></tr>
      ${rows}
    </table>
  `;
}

// Optional: Dark mode toggle
document.getElementById("toggleDarkMode")?.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
