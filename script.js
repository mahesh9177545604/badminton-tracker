// Match analytics panel (Polished)
function renderAnalytics() {
  const analyticsDiv = document.createElement('div');
  analyticsDiv.id = 'match-analytics';
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
    highlight.innerHTML = `
      <div style="margin-top: 24px; padding: 16px; background: #dff0d8; border-left: 5px solid #27ae60; border-radius: 8px;">
        🏆 <strong>Top Team${topTeams.length > 1 ? 's' : ''}:</strong> ${topTeams.map(t => t.name).join(', ')}<br>
        <span style="color:#2c3e50;font-size:14px;">with <strong>${maxPoints}</strong> point${maxPoints !== 1 ? 's' : ''}</span>
      </div>`;
    analyticsDiv.appendChild(highlight);
  }

  document.body.appendChild(analyticsDiv);
}
