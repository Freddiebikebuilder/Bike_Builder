document.addEventListener('DOMContentLoaded', async () => {
  const frame = JSON.parse(localStorage.getItem('selectedFrame'));
  const frameImg = document.getElementById('selectedFrame');
  frameImg.src = `Images/Frames/${frame.file}`;
  frameImg.alt = frame.name;

  const response = await fetch('Data/parts.json');
  const partsData = await response.json();

  const selectedParts = {
    frame: frame,
    forks: null,
    rearShock: null
  };

  const priceEstimate = document.getElementById('priceEstimate');
  const partList = document.getElementById('partList');

  function updateEstimate() {
    let total = 0;
    partList.innerHTML = '';
    for (const key in selectedParts) {
      const part = selectedParts[key];
      if (part && part.price) {
        total += part.price;
        const li = document.createElement('li');
        li.textContent = `${key}: £${part.price}`;
        partList.appendChild(li);
      }
    }
    priceEstimate.textContent = `Estimated Price: £${total}`;
  }

  const categories = Object.keys(partsData).filter(k => k !== 'frames');
  const menu = document.getElementById('partMenu');
  const slider = document.getElementById('partSlider');
  const title = document.getElementById('partsTitle');

  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.textContent = cat;
    btn.addEventListener('click', () => loadParts(cat));
    menu.appendChild(btn);
  });

  function loadParts(category) {
    title.textContent = `Choose ${category}`;
    slider.innerHTML = '';
    partsData[category].forEach(part => {
      const img = document.createElement('img');
      img.src = `Images/Parts/${category}/${part.preview}`;
      img.alt = part.name;
      img.addEventListener('click', () => {
        selectedParts[category] = part;
        const overlay = document.getElementById(`${category}Image`);
        if (overlay) overlay.src = `Images/Parts/${category}/${part.overlay}`;
        updateEstimate();
      });
      slider.appendChild(img);
    });
  }

  document.getElementById('finishBuild').addEventListener('click', () => {
    localStorage.setItem('finalBuild', JSON.stringify(selectedParts));
    window.location.href = 'Summary.html';
  });

  loadParts(categories[0]);
  updateEstimate();
});

