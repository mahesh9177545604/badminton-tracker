const teamNames = ["Red Raptors", "Blue Blasters", "Green Smashers", "Yellow Flyers"];
const teamColors = {
  "Red Raptors": "#e74c3c",
  "Blue Blasters": "#3498db",
  "Green Smashers": "#27ae60",
  "Yellow Flyers": "#f1c40f"
};
const pairsPerTeam = 4;
const teams = teamNames.map(name => ({ name, color: teamColors[name], pairs: Array(pairsPerTeam).fill('') }));

function getTeamStyle(teamName) {
  return {
    backgroundColor: teamColors[teamName] || '#ccc',
    color: '#fff',
    padding: '12px',
    borderRadius: '10px',
    marginBottom: '16px',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
    boxShadow: '0 3px 6px rgba(0,0,0,0.15)'
  };
}

function renderTeams() {
  const teamDiv = document.getElementById('teams');
  teamDiv.innerHTML = '<h2 style="font-family:Arial,sans-serif;font-size:24px;margin-bottom:20px;">🏸 Enter Team Players</h2>';
  teams.forEach((team, tIdx) => {
    const teamHTML = document.createElement('div');
    teamHTML.className = 'team';
    teamHTML.style.background = '#fff';
    teamHTML.style.borderRadius = '8px';
    teamHTML.style.padding = '15px';
    teamHTML.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    teamHTML.style.marginBottom = '20px';

    const header = document.createElement('div');
    Object.assign(header.style, getTeamStyle(team.name));
    header.innerText = team.name;
    teamHTML.appendChild(header);

    team.pairs.forEach((pair, pIdx) => {
      const input = document.createElement('input');
      input.placeholder = `Pair ${pIdx + 1} (e.g. P1 & P2)`;
      input.value = pair;
      input.style.margin = '8px 0';
      input.style.padding = '10px';
      input.style.width = '100%';
      input.style.border = '1px solid #ccc';
      input.style.borderRadius = '6px';
      input.oninput = (e) => teams[tIdx].pairs[pIdx] = e.target.value;
      teamHTML.appendChild(input);
    });

    teamDiv.appendChild(teamHTML);
  });
}

window.onload = renderTeams;
