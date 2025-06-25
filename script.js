const teams = ['Red Raptors', 'Green Smashers', 'Blue Blasters', 'Yellow Flyers', 'Purple Hurricanes'];
const teamColors = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6'];

let playerStatsDoubles = {};
let playerStatsSingles = {};
let teamStatsDoubles = {};
let teamStatsSingles = {};
let doublesMatches = [];
let singlesMatches = [];
let darkMode = false;

document.addEventListener('DOMContentLoaded', () => {
  initCaptains();
  populateTeamDropdowns();
  setupTabs();
  setupForms();
  setupButtons();
});

function initCaptains() {
  const container = document.getElementById('captainDetails');
  container.innerHTML = '';
  teams.forEach((team, idx) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <label style="color: ${teamColors[idx]}; font-weight: bold;">${team} Captain:</label>
      <input type="text" placeholder="Captain Name" id="captain-${team.replace(/\s+/g, '')}" />
    `;
    container.appendChild(div);
  });
}

function populateTeamDropdowns() {
  ['teamA', 'teamB', 'winnerDoubles', 'teamSingleA', 'teamSingleB', 'winnerSingles'].forEach(id => {
    const select = document.getElementById(id);
    if (!select) return;
    select.innerHTML = '<option disabled selected>Select Team</option>';
    teams.forEach(team => {
      const option = document.createElement('option');
      option.value = team;
      option.textContent = team;
      select.appendChild(option);
    });
  });
}

function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-button');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

      button.classList.add('active');
      document.getElementById(button.dataset.tab).classList.add('active');
    });
  });
}

function setupForms() {
  document.getElementById('doublesForm').addEventListener('submit', e => {
    e.preventDefault();
    const match = {
      teamA: getVal('teamA'),
      teamB: getVal('teamB'),
      playerA1: getVal('playerA1'),
      playerA2: getVal('playerA2'),
      playerB1: getVal('playerB1'),
      playerB2: getVal('playerB2'),
      trumpA: document.getElementById('trumpA').checked,
      trumpB: document.getElementById('trumpB').checked,
      winner: getVal('winnerDoubles')
    };

    if (!match.teamA || !match.teamB || !match.winner || !match.playerA1 || !match.playerA2 || !match.playerB1 || !match.playerB2) {
      alert("Please fill out all fields for doubles match.");
      return;
    }

    if (isDuplicateMatch(match, 'doubles')) {
      alert("This doubles match already exists.");
      return;
    }

    doublesMatches.push(match);
    updateStats(match, 'doubles');
  });

  document.getElementById('singlesForm').addEventListener('submit', e => {
    e.preventDefault();
    const match = {
      teamA: getVal('teamSingleA'),
      teamB: getVal('teamSingleB'),
      playerA: getVal('playerSingleA'),
      playerB: getVal('playerSingleB'),
      trumpA: document.getElementById('trumpSingleA').checked,
      trumpB: document.getElementById('trumpSingleB').checked,
      winner: getVal('winnerSingles')
    };

    if (!match.teamA || !match.teamB || !match.winner || !match.playerA || !match.playerB) {
      alert("Please fill out all fields for singles match.");
      return;
    }

    if (isDuplicateMatch(match, 'singles')) {
      alert("This singles match already exists.");
      return;
    }

    singlesMatches.push(match);
    updateStats(match, 'singles');
  });
}

function getVal(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function isDuplicateMatch(match, type) {
  const key = type === 'doubles'
    ? `${match.playerA1}-${match.playerA2}-${match.playerB1}-${match.playerB2}`
    : `${match.playerA}-${match.playerB}`;
  const existing = (type === 'doubles' ? doublesMatches : singlesMatches).some(m => {
    return JSON.stringify(m).includes(key);
  });
  return existing;
}

function updateStats(match, type) {
  const isDoubles = type === 'doubles';
  const playersA = isDoubles ? [match.playerA1, match.playerA2] : [match.playerA];
  const playersB = isDoubles ? [match.playerB1, match.playerB2] : [match.playerB];

  const teamA = match.teamA;
  const teamB = match.teamB;

  const winnerTeam = match.winner;
  const loserTeam = winnerTeam === teamA ? teamB : teamA;
  const winnerPlayers = winnerTeam === teamA ? playersA : playersB;
  const loserPlayers = winnerTeam === teamA ? playersB : playersA;
  const winnerTrump = winnerTeam === teamA ? match.trumpA : match.trumpB;
  const loserTrump = winnerTeam === teamA ? match.trumpB : match.trumpA;

  let winnerPoints = 1;
  let loserPoints = 0;

  if (winnerTrump) winnerPoints = 2;
  if (loserTrump) loserPoints = -1;

  const playerStats = isDoubles ? playerStatsDoubles : playerStatsSingles;
  const teamStats = isDoubles ? teamStatsDoubles : teamStatsSingles;

  winnerPlayers.forEach(p => {
    if (!playerStats[p]) playerStats[p] = { wins: 0, losses: 0, points: 0 };
    playerStats[p].wins++;
    playerStats[p].points += winnerPoints;
  });

  loserPlayers.forEach(p => {
    if (!playerStats[p]) playerStats[p] = { wins: 0, losses: 0, points: 0 };
    playerStats[p].losses++;
    playerStats[p].points += loserPoints;
  });

  [teamA, teamB].forEach(team => {
    if (!teamStats[team]) teamStats[team] = { wins: 0, losses: 0, points: 0 };
  });

  teamStats[winnerTeam].wins++;
  teamStats[winnerTeam].points += winnerPoints;

  teamStats[loserTeam].losses++;
  teamStats[loserTeam].points += loserPoints;

  renderStats();
}

function renderStats() {
  const doublesPlayerContainer = document.getElementById('doublesStats');
  const singlesPlayerContainer = document.getElementById('singlesStats');
  const teamStatsContainer = document.getElementById('teamStats');

  doublesPlayerContainer.innerHTML = renderPlayerTable(playerStatsDoubles, 'Doubles Player Stats');
  singlesPlayerContainer.innerHTML = renderPlayerTable(playerStatsSingles, 'Singles Player Stats');

  const teamHTML = `
    <h3>Team Stats</h3>
    <table>
      <tr><th>Team</th><th>Wins</th><th>Losses</th><th>Points</th></tr>
      ${Object.entries(teamStatsDoubles).map(([team, stat]) => `
        <tr><td>${team}</td><td>${stat.wins}</td><td>${stat.losses}</td><td>${stat.points}</td></tr>
      `).join('')}
      ${Object.entries(teamStatsSingles).map(([team, stat]) => `
        <tr><td>${team}</td><td>${stat.wins}</td><td>${stat.losses}</td><td>${stat.points}</td></tr>
      `).join('')}
    </table>
  `;
  teamStatsContainer.innerHTML = teamHTML;
}

function renderPlayerTable(stats, title) {
  return `
    <h3>${title}</h3>
    <table>
      <tr><th>Player</th><th>Wins</th><th>Losses</th><th>Points</th></tr>
      ${Object.entries(stats).map(([player, s]) => `
        <tr><td>${player}</td><td>${s.wins}</td><td>${s.losses}</td><td>${s.points}</td></tr>
      `).join('')}
    </table>
  `;
}

function setupButtons() {
  document.getElementById('toggleDarkMode').addEventListener('click', () => {
    darkMode = !darkMode;
    document.body.classList.toggle('dark-mode', darkMode);
  });

  document.getElementById('resetTournament').addEventListener('click', () => {
    if (confirm('Are you sure you want to reset the tournament?')) {
      playerStatsDoubles = {};
      playerStatsSingles = {};
      teamStatsDoubles = {};
      teamStatsSingles = {};
      doublesMatches = [];
      singlesMatches = [];
      renderStats();
    }
  });

  document.getElementById('exportExcel').addEventListener('click', () => {
    const data = [['Player', 'Wins', 'Losses', 'Points']];
    Object.entries(playerStatsDoubles).forEach(([name, s]) => {
      data.push([name, s.wins, s.losses, s.points]);
    });
    Object.entries(playerStatsSingles).forEach(([name, s]) => {
      data.push([name, s.wins, s.losses, s.points]);
    });

    const csv = data.map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'player_stats.csv';
    a.click();
  });

  document.getElementById('generateFixtures').addEventListener('click', () => {
    alert('Fixtures logic is manual - enter match data using the form below.');
  });
}
