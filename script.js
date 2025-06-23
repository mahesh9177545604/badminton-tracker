// ===== DATA STRUCTURE =====
const teams = [];
const fixtures = [];

// ===== TEAM & FIXTURE CREATION =====
function addTeam(name, color, logo) {
  teams.push({ name, points: 0, color, logo });
}

function generateFixtures() {
  let id = 1;
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      fixtures.push({ id: id++, teams: [teams[i].name, teams[j].name], winner: '' });
    }
  }
  renderFixtures();
  renderAnalytics();
}

// ===== FIXTURE RENDERING =====
function renderFixtures() {
  const section = document.getElementById('fixture-section');
  section.innerHTML = '<h2>🏸 Fixtures</h2>';

  fixtures.forEach(match => {
    const div = document.createElement('div');
    div.style.margin = '10px 0';
    div.style.padding = '10px';
    div.style.border = '1px solid #ccc';
    div.style.borderRadius = '8px';
    div.style.background = '#fff';

    const [teamA, teamB] = match.teams;

    const select = document.createElement('select');
    select.innerHTML = `
      <option value="">Select Winner</option>
      <option value="${teamA}">${teamA}</option>
      <option value="${teamB}">${teamB}</option>
    `;
    select.value = match.winner;
    select.onchange = () => updateWinner(match.id, select.value);

    div.innerHTML = `<strong>Match ${match.id}:</strong> ${teamA} vs ${teamB}`;
    div.appendChild(document.createElement('br'));
    div.appendChild(select);

    section.appendChild(div);
  });
}

// ===== ANALYTICS RENDERING =====
function renderAnalytics() {
  const analyticsDiv = document.getElementById('match-analytics') || document.createElement('div');
  analyticsDiv.id = 'match-analytics';
  analyticsDiv.innerHTML = '';
  analyticsDiv.style.margin = '40px auto';
  analyticsDiv.style.padding = '24px';
  analyticsDiv.style.maxWidth = '1000px';
  analyticsDiv.style.background = 'linear-gradient(to right, #fdfbfb, #ebedee)';
  analyticsDiv.style.border = '1px solid #d1d1d1';
  analyticsDiv.style.borderRadius = '12px';
  analyticsDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.06)';
  analyticsDiv.style.fontFamily = 'Segoe UI, sans-serif';

  const heading = document.createElement('h3');
  heading.textContent = '📈 Match Analytics';
  heading.style.color = '#2c3e50';
  heading.style.fontSize = '24px';
  heading.style.borderBottom = '1px solid #ccc';
  heading.style.paddingBottom = '10px';
  analyticsDiv.appendChild(heading);

  const totalMatches = fixtures.length;
  const playedMatches = fixtures.filter(m => m.winner).length;
  const remainingMatches = totalMatches - playedMatches;

  const summary = document.createElement('div');
  summary.style.fontSize = '16px';
  summary.style.lineHeight = '1.8';
  summary.style.marginTop = '16px';
  summary.innerHTML = `
    <ul style="padding-left: 20px; margin: 0;">
      <li><strong>Total Matches:</strong> ${totalMatches}</li>
      <li><strong>Matches Played:</strong> ${playedMatches}</li>
      <li><strong>Matches Remaining:</strong> ${remainingMatches}</li>
    </ul>`;
  analyticsDiv.appendChild(summary);

  if (teams.length > 0) {
    const maxPoints = Math.max(...teams.map(t => t.points));
    const topTeams = teams.filter(t => t.points === maxPoints);
    const highlight = document.createElement('div');
    const logos = topTeams.map(t => `<img src="${t.logo}" alt="${t.name}" width="40" height="40" style="vertical-align:middle; margin-right:8px; border-radius:50%; border:2px solid ${t.color};">`).join('');
    highlight.innerHTML = `
      <div style="margin-top: 24px; padding: 16px; background: #dff0d8; border-left: 5px solid #27ae60; border-radius: 8px; display: flex; align-items: center; gap: 12px;">
        ${logos}
        <div>
          🏆 <strong>Top Team${topTeams.length > 1 ? 's' : ''}:</strong> ${topTeams.map(t => t.name).join(', ')}<br>
          <span style="color:#2c3e50;font-size:14px;">with <strong>${maxPoints}</strong> point${maxPoints !== 1 ? 's' : ''}</span>
        </div>
      </div>`;
    analyticsDiv.appendChild(highlight);
  }

  if (!document.getElementById('match-analytics')) {
    document.body.appendChild(analyticsDiv);
  }
}

// ===== RESULT HANDLING =====
function updateWinner(matchId, winnerName) {
  const match = fixtures.find(m => m.id === matchId);
  if (!match || match.winner === winnerName) return;
  if (match.winner) {
    const prevTeam = teams.find(t => t.name === match.winner);
    if (prevTeam) prevTeam.points--;
  }
  match.winner = winnerName;
  const newTeam = teams.find(t => t.name === winnerName);
  if (newTeam) newTeam.points++;
  renderAnalytics();
}

// ===== INITIAL DEMO =====
document.addEventListener('DOMContentLoaded', () => {
  const defaultTeams = [
    ['Red Raptors', '#e74c3c', 'https://upload.wikimedia.org/wikipedia/en/thumb/1/10/Toronto_Raptors_logo.svg/1200px-Toronto_Raptors_logo.svg.png'],
    ['Blue Blasters', '#3498db', 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png'],
    ['Green Smashers', '#2ecc71', 'https://cdn-icons-png.flaticon.com/512/3176/3176292.png'],
    ['Yellow Flyers', '#f1c40f', 'https://cdn-icons-png.flaticon.com/512/3132/3132678.png']
  ];

  defaultTeams.forEach(([name, color, logo]) => addTeam(name, color, logo));
  generateFixtures();
});
