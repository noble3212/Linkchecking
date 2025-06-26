let knownGoodLinks = [];

async function loadKnownGoodLinks() {
  try {
    const response = await fetch('known-good-links.json');
    knownGoodLinks = await response.json();
  } catch (error) {
    console.error('Error loading known-good-links.json:', error);
  }
}

function isKnownGood(url) {
  return knownGoodLinks.includes(url);
}

async function checkLinks() {
  const input = document.getElementById('urlInput').value.trim();
  const urls = input.split('\n').map(u => u.trim()).filter(u => u);

  const tableBody = document.querySelector('#resultsTable tbody');
  tableBody.innerHTML = '';

  for (const url of urls) {
    const row = document.createElement('tr');

    const isGood = isKnownGood(url);
    const statusCell = document.createElement('td');
    const corsCell = document.createElement('td');

    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'cors' });

      statusCell.textContent = response.status;
      corsCell.textContent = response.ok ? 'OK' : 'CORS blocked or error';
    } catch (error) {
      statusCell.textContent = 'N/A';
      corsCell.textContent = 'Fetch error or blocked';
    }

    row.innerHTML = `
      <td><a href="${url}" target="_blank">${url}</a></td>
      <td>${isGood ? '✅' : '❌'}</td>
    `;
    row.appendChild(statusCell);
    row.appendChild(corsCell);
    tableBody.appendChild(row);
  }
}

loadKnownGoodLinks();
