const teams = [];
const fixtures = [];
const playerStats = {};

function addTeam(name, color, logo, pairs) {
  teams.push({ name, points: 0, color, logo, pairs });
  pairs.flat().forEach(player => {
    playerStats[player] = { wins: 0, losses: 0 };
  });
}

function collectPairsAndGenerate() {
  teams.length = 0;
  fixtures.length = 0;
  Object.keys(playerStats).forEach(k => delete playerStats[k]);

  const teamDivs = document.querySelectorAll(".team-block");
  teamDivs.forEach((block, i) => {
    const inputs = block.querySelectorAll("input");
    const pairs = [];
    for (let j = 0; j < inputs.length; j += 2) {
      const p1 = inputs[j].value.trim();
      const p2 = inputs[j + 1].value.trim();
      if (p1 && p2) pairs.push([p1, p2]);
    }
    if (pairs.length === 4) {
      addTeam(teamsMeta[i].name, teamsMeta[i].color, teamsMeta[i].logo, pairs);
    }
  });

  if (teams.length === 4) generateFixtures();
  else alert("Please enter all 4 pairs for each team.");
}

function generateFixtures() {
  fixtures.length = 0;
  let id = 1;
  for (let i = 0; i < teams.length; i++) {
    for (let j = 0; j < teams.length; j++) {
      if (i === j) continue;
      teams[i].pairs.forEach(pairA => {
        const pairB = teams[j].pairs[Math.floor(Math.random() * 4)];
        fixtures.push({
          id: id++,
          teamA: teams[i].name,
          teamB: teams[j].name,
          pairA,
          pairB,
          winner: ''
        });
      });
    }
  }

  renderFixtures();
  renderAnalytics();
  renderStats();
  renderPoints();
}

function renderFixtures() {
  const section = document.getElementById('fixtures');
  section.innerHTML = '';
  fixtures.forEach(match => {
    const div = document.createElement('div');
    div.className = 'fixture-card';
    const label = document.createElement('label');
    label.innerHTML = `<strong>Match ${match.id}</strong>: ${match.pairA.join(' & ')} (${match.teamA}) vs ${match.pairB.join(' & ')} (${match.teamB})`;

    const select = document.createElement('select');
    select.innerHTML = `
      <option value="">Select Winner</option>
      <option value="${match.teamA}">${match.teamA}</option>
      <option value="${match.teamB}">${match.teamB}</option>`;
    select.value = match.winner;
    select.onchange = () => updateWinner(match, select.value);

    div.appendChild(label);
    div.appendChild(document.createElement('br'));
    div.appendChild(select);
    section.appendChild(div);
  });
}

function renderPoints() {
  const container = document.getElementById('team-points');
  container.innerHTML = '<table><tr><th>Team</th><th>Points</th></tr>' +
    teams.map(t => `<tr><td>${t.name}</td><td>${t.points}</td></tr>`).join('') +
    '</table>';
}

function renderStats() {
  const container = document.getElementById('player-stats');
  container.innerHTML = '<table><tr><th>Player</th><th>Wins</th><th>Losses</th></tr>' +
    Object.entries(playerStats).map(([p, s]) =>
      `<tr><td>${p}</td><td>${s.wins}</td><td>${s.losses}</td></tr>`
    ).join('') + '</table>';
}

function renderAnalytics() {
  const played = fixtures.filter(f => f.winner).length;
  const total = fixtures.length;
  const topScore = Math.max(...teams.map(t => t.points));
  const topTeams = teams.filter(t => t.points === topScore);
  const msg = `Played: ${played}/${total}. Top Team${topTeams.length > 1 ? 's' : ''}: ${topTeams.map(t => t.name).join(', ')}`;
  document.getElementById('analytics')?.remove();
  const msgDiv = document.createElement('div');
  msgDiv.id = 'analytics';
  msgDiv.style.margin = "20px 0";
  msgDiv.innerHTML = `<strong>${msg}</strong>`;
  document.body.appendChild(msgDiv);
}

function updateWinner(match, winnerName) {
  if (match.winner === winnerName) return;

  if (match.winner) {
    const prevTeam = teams.find(t => t.name === match.winner);
    if (prevTeam) prevTeam.points--;

    match.pairA.concat(match.pairB).forEach(player => {
      if (playerStats[player]) {
        if (match.winner === match.teamA) playerStats[player].wins--;
        else playerStats[player].losses--;
      }
    });
  }

  match.winner = winnerName;

  const team = teams.find(t => t.name === winnerName);
  if (team) team.points++;

  match.pairA.concat(match.pairB).forEach(player => {
    if (playerStats[player]) {
      const isWinnerA = (winnerName === match.teamA);
      const isFromA = match.pairA.includes(player);
      if ((isWinnerA && isFromA) || (!isWinnerA && !isFromA)) {
        playerStats[player].wins++;
      } else {
        playerStats[player].losses++;
      }
    }
  });

  renderPoints();
  renderStats();
  renderAnalytics();
}

const teamsMeta = [
  {
    name: "Red Raptors",
    color: "#e74c3c",
    logo: "https://cdn-icons-png.flaticon.com/512/2490/2490348.png"
  },
  {
    name: "Blue Blasters",
    color: "#3498db",
    logo: "https://cdn-icons-png.flaticon.com/512/3132/3132693.png"
  },
  {
    name: "Green Smashers",
    color: "#2ecc71",
    logo: "https://cdn-icons-png.flaticon.com/512/3176/3176292.png"
  },
  {
    name: "Yellow Flyers",
    color: "#f1c40f",
    logo: "https://cdn-icons-png.flaticon.com/512/3132/3132678.png"
  }
];

function renderPlayerInputs() {
  const container = document.getElementById("team-inputs");
  container.innerHTML = '';
  teamsMeta.forEach((team, i) => {
    const div = document.createElement('div');
    div.className = 'team-block';
    div.style.borderLeftColor = team.color;

    const header = document.createElement('div');
    header.className = 'team-header';
    header.innerHTML = `<img class="team-logo" src="${team.logo}" /><strong>${team.name}</strong>`;
    div.appendChild(header);

    for (let j = 0; j < 4; j++) {
      const pair = document.createElement('div');
      pair.className = 'pair';
      pair.innerHTML = `
        <input type="text" placeholder="Player 1" />
        <input type="text" placeholder="Player 2" />
      `;
      div.appendChild(pair);
    }

    container.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderPlayerInputs();
});
