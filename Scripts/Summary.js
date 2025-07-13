document.addEventListener('DOMContentLoaded', () => {
  const data = JSON.parse(localStorage.getItem('finalBuild'));
  const tableBody = document.getElementById('summaryTableBody');

  for (const key in data) {
    const part = data[key];
    if (part && part.price) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${key}</td>
        <td>${part.name}</td>
        <td>£${part.price}</td>
        <td><a href="${part.link}" target="_blank">Buy</a></td>
      `;
      tableBody.appendChild(row);
    }
  }

  const finalImg = document.getElementById('finalBuildImage');
  finalImg.src = document.getElementById('selectedFrame')?.src || 'Images/default.png';
});

