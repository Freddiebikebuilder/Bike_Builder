document.addEventListener('DOMContentLoaded', async () => {
  const res = await fetch('Data/parts.json');
  const data = await res.json();
  const frameGrid = document.getElementById('frameGrid');

  data.frames.forEach(frame => {
    const div = document.createElement('div');
    div.className = 'frame';
    div.dataset.name = frame.name;
    div.innerHTML = `
      <p>${frame.name}</p>
      <img src="Images/Frames/${frame.file}" alt="${frame.name}">
    `;

    div.addEventListener('click', () => {
      localStorage.setItem('selectedFrame', JSON.stringify(frame));
      window.location.href = 'Build.html';
    });

    frameGrid.appendChild(div);
  });

  document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    [...frameGrid.children].forEach(frame =>
      frame.style.display = frame.dataset.name.toLowerCase().includes(term) ? '' : 'none'
    );
  });
});

