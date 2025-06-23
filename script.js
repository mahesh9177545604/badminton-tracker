const teamNames = ["Red Raptors", "Blue Blasters", "Green Smashers", "Yellow Flyers"];
const teamColors = {
  "Red Raptors": "#e74c3c",
  "Blue Blasters": "#3498db",
  "Green Smashers": "#27ae60",
  "Yellow Flyers": "#f1c40f"
};
const teamLogos = {
  "Red Raptors": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Badminton_pictogram.svg/512px-Badminton_pictogram.svg.png",
  "Blue Blasters": "https://cdn-icons-png.flaticon.com/512/1157/1157004.png",
  "Green Smashers": "https://cdn-icons-png.flaticon.com/512/2302/2302834.png",
  "Yellow Flyers": "https://cdn-icons-png.flaticon.com/512/3305/3305873.png"
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
  document.body.style.background = "linear-gradient(to right, #f0f4f8, #d9e2ec)";
  document.body.style.margin = "0";
  document.body.style.fontFamily = "Arial, sans-serif";

  const banner = document.createElement('div');
  banner.style.background = '#2c3e50';
  banner.style.color = '#ecf0f1';
  banner.style.padding = '24px';
  banner.style.textAlign = 'center';
  banner.style.fontSize = '32px';
  banner.style.fontWeight = 'bold';
  banner.style.letterSpacing = '1px';
  banner.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  banner.innerText = '🏆 Smash Clash 2024 - Doubles League';
  document.body.prepend(banner);

  const teamDiv = document.getElementById('teams');
  teamDiv.innerHTML = '<h2 style="font-family:Arial,sans-serif;font-size:24px;margin-bottom:20px;color:#2c3e50;">🏸 Enter Team Players</h2>';
  teams.forEach((team, tIdx) => {
    const teamHTML = document.createElement('div');
    teamHTML.className = 'team';
    teamHTML.style.background = '#fff';
    teamHTML.style.borderRadius = '10px';
    teamHTML.style.padding = '15px';
    teamHTML.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
    teamHTML.style.marginBottom = '20px';

    const header = document.createElement('div');
    Object.assign(header.style, getTeamStyle(team.name));

    const logo = document.createElement('img');
    logo.src = teamLogos[team.name];
    logo.alt = `${team.name} Logo`;
    logo.style.width = '40px';
    logo.style.height = '40px';
    logo.style.marginRight = '10px';
    logo.style.verticalAlign = 'middle';

    const nameSpan = document.createElement('span');
    nameSpan.innerText = team.name;
    nameSpan.style.verticalAlign = 'middle';

    header.appendChild(logo);
    header.appendChild(nameSpan);
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
