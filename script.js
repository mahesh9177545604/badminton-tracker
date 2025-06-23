// ========== State ==========
const teams = [
  { name: 'Red Raptors', color: '#e74c3c', logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/10/Toronto_Raptors_logo.svg/1200px-Toronto_Raptors_logo.svg.png', players: [] },
  { name: 'Blue Blasters', color: '#3498db', logo: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png', players: [] },
  { name: 'Green Smashers', color: '#2ecc71', logo: 'https://cdn-icons-png.flaticon.com/512/3176/3176292.png', players: [] },
  { name: 'Yellow Flyers', color: '#f1c40f', logo: 'https://cdn-icons-png.flaticon.com/512/3132/3132678.png', players: [] }
];
const fixtures = [];
const playerStats = {}; // { "Player Name": { wins: 0, losses: 0 } }

// ========== UI: Team Player Input ==========
function renderPlayerInputs() {
  const container = document.getElementById('team-inputs');
  teams.forEach((team, index) => {
    const div = document.createElement('div');
    div.className = 'team';
    div.innerHTML = `<div class="team-title">${team.name}</div>`;
    for (let i = 0; i < 8; i++) {
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = `Player ${i + 1}`;
      input.dataset.team = index;
      input.dataset.index = i;
      input.style.width = '180px';
      div.appendChild(input);
    }
    container.appendChild(div);
  });
}

// ========== Generate Fixtures After Players ==========
function generateFixturesFromPlayers() {
  const inputs = document.querySelectorAll('#team-inputs input');
  inputs.forEach(input => {
    const teamIndex = input.dataset.team;
    const playerName = input.value.trim();
    if (playerName) {
      teams[teamIndex].players.push(playerName);
      playerStats[playerName] = { wins: 0, losses: 0 };
    }
  });

  // Validate
  for (const team of teams) {
    if (team.players.length !== 8) {
      alert(`${team.name} must have exactly 8 players`);
      return;
    }
  }

  // Generate round robin between 4 pairs from each team vs 1 pair from each other team
  let matchId = 1;
  for (let t1 = 0; t1 < teams.length; t1++) {
    for (let t2 = 0; t2 < teams.length; t2++) {
      if (t1 === t2) continue;
      for (let p = 0; p < 4; p++) {
        const pair1 = `${teams[t1].players[2 * p]} & ${teams[t1].players[2 * p + 1]}`;
        const pair2 = `${teams[t2].players[(2 * p) % 8]} & ${teams[t2].players[(2 * p + 1) % 8]}`;
        fixtures.push({
          id: matchId++,
          teamA: teams[t1],
          teamB: teams[t2],
          pairA: pair1,
          pairB: pair2,
          winner: ''
        });
      }
    }
  }

  renderFixtures();
  renderAnalytics();
}

// ========== Render Fixtures ==========
function renderFixtures() {
  const section = document.getElementById('fixture-section');
  section.innerHTML = '<h2>Fixtures</h2>';

  fixtures.forEach(match => {
    const div = document.createElement('div');
    div.className = 'fixture-card';
    const label = `Match ${match.id}: ${match.teamA.name} (${match.pairA}) vs ${match.teamB.name} (${match.pairB})`;

    const select = document.createElement('select');
    select.innerHTML = `<option value="">Select Winner</option>
      <option value="${match.teamA.name}">${match.teamA.name}</option>
      <option value="${match.teamB.name}">${match.teamB.name}</option>`;
    select.value = match.winner;
    select.onchange = () => handleWinner(match.id, select.value);

    div.innerHTML = `<strong>${label}</strong><br/>`;
    div.appendChild(select);
    section.appendChild(div);
  });
}

// ========== Handle Match Result ==========
function handleWinner(id, winner) {
  const match = fixtures.find(f => f.id === id);
  if (!match || match.winner === winner) return;

  if (match.winner) {
    match.winner === match.teamA.name ? match.teamA.points-- : match.teamB.points--;
    const prevPair = match.winner === match.teamA.name ? match.pairA : match.pairB;
    prevPair.split(' & ').forEach(player => playerStats[player].wins--);
    prevPair.split(' & ').forEach(player => playerStats[player].losses++);
  }

  match.winner = winner;
  const team = winner === match.teamA.name ? match.teamA : match.teamB;
  team.points = (team.points || 0) + 1;

  const pair = winner === match.teamA.name ? match.pairA : match.pairB;
  pair.split(' & ').forEach(player => playerStats[player].wins++);
  renderAnalytics();
}

// ========== Analytics Panel ==========
function renderAnalytics() {
  const section = document.getElementById('match-analytics');
  section.innerHTML = `<h2>Match Analytics</h2>`;

  // Team Points
  const teamPoints = document.createElement('ul');
  teamPoints.innerHTML = teams.map(t => `<li><strong>${t.name}</strong>: ${t.points || 0} pts</li>`).join('');
  section.appendChild(teamPoints);

  // Player Stats
  const playerTable = document.createElement('table');
  playerTable.border = '1';
  playerTable.style.marginTop = '20px';
  playerTable.innerHTML = `<tr><th>Player</th><th>Wins</th><th>Losses</th></tr>` +
    Object.entries(playerStats).map(([name, stats]) =>
      `<tr><td>${name}</td><td>${stats.wins}</td><td>${stats.losses}</td></tr>`
    ).join('');
  section.appendChild(playerTable);
}

// ========== Init ==========
document.addEventListener('DOMContentLoaded', renderPlayerInputs);
