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
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '10px',
    textAlign: 'center',
    fontWeight: 'bold'
  };
}

function renderTeams() {
  const teamDiv = document.getElementById('teams');
  teamDiv.innerHTML = '<h2>Enter Team Players</h2>';
  teams.forEach((team, tIdx) => {
    const teamHTML = document.createElement('div');
    teamHTML.className = 'team';
    const header = document.createElement('div');
    Object.assign(header.style, getTeamStyle(team.name));
    header.innerText = team.name;
    teamHTML.appendChild(header);
    team.pairs.forEach((pair, pIdx) => {
      const input = document.createElement('input');
      input.placeholder = `Pair ${pIdx + 1} (e.g. P1 & P2)`;
      input.value = pair;
      input.oninput = (e) => teams[tIdx].pairs[pIdx] = e.target.value;
      teamHTML.appendChild(input);
    });
    teamDiv.appendChild(teamHTML);
  });
}

window.onload = renderTeams;
