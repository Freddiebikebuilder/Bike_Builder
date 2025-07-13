(async () => {
  const data = await fetch('Data/parts.json').then(res => res.json());

  const frameContainer = document.getElementById('frame-container');
  const partsForm = document.getElementById('parts-form');
  const totalPriceEl = document.getElementById('total-price');
  const finishBuildBtn = document.getElementById('finish-build');
  const backToFramesBtn = document.getElementById('back-to-frames');

  const selectedFrameId = localStorage.getItem('selectedFrameId');
  if (!selectedFrameId) {
    alert('No frame selected, redirecting to frames page.');
    window.location.href = 'index.html';
    return;
  }

  const frame = data.frames.find(f => f.id === selectedFrameId);
  if (!frame) {
    alert('Frame not found in data.');
    window.location.href = 'index.html';
    return;
  }

  const frameImg = document.createElement('img');
  frameImg.src = frame.image;
  frameImg.alt = frame.name + ' frame';
  frameContainer.appendChild(frameImg);

  // All your categories exactly as you specified
  const partCategories = [
    'forks',
    'rearShocks',
    'drivetrains',
    'wheels',
    'brakes',
    'handlebars',
    'seatposts',
    'saddles'
  ];

  const selectedParts = { frame: frame };
  const overlays = {};

  function createPartSelector(category) {
    const parts = data[category];
    if (!parts) return; // skip if category missing in data

    const label = document.createElement('label');
    label.htmlFor = category;
    label.textContent = category.charAt(0).toUpperCase() + category.slice(1);

    const select = document.createElement('select');
    select.id = category;
    select.name = category;

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select ' + category.slice(0, -1);
    select.appendChild(defaultOption);

    parts.forEach(part => {
      const option = document.createElement('option');
      option.value = part.id;
      option.textContent = `${part.name} (£${part.price.toFixed(2)})`;
      select.appendChild(option);
    });

    select.addEventListener('change', () => {
      const part = parts.find(p => p.id === select.value);
      if (part) {
        selectedParts[category] = part;
      } else {
        delete selectedParts[category];
      }
      updateBuildVisuals();
      updatePrice();
    });

    partsForm.appendChild(label);
    partsForm.appendChild(select);
  }

  partCategories.forEach(createPartSelector);

  function updateBuildVisuals() {
    Object.values(overlays).forEach(overlay => overlay.remove());

    Object.entries(selectedParts).forEach(([key, part]) => {
      if (key === 'frame') return;
      if (!part.image) return;

      const img = document.createElement('img');
      img.src = part.image;
      img.alt = part.name;
      img.className = 'overlay-part';

      // Positioning for overlays (you can customize this per part category)
      img.style.position = 'absolute';
      img.style.top = '0';
      img.style.left = '0';
      img.style.maxWidth = '100%';
      img.style.pointerEvents = 'none';
      img.style.userSelect = 'none';

      frameContainer.appendChild(img);
      overlays[key] = img;
    });
  }

  function updatePrice() {
    let total = frame.basePrice;
    Object.entries(selectedParts).forEach(([key, part]) => {
      if (key === 'frame') return;
      if (part && part.price) total += part.price;
    });
    totalPriceEl.textContent = '£' + total.toFixed(2);
  }

  finishBuildBtn.addEventListener('click', () => {
    localStorage.setItem('buildData', JSON.stringify(selectedParts));
    window.location.href = 'summary.html';
  });

  backToFramesBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  updatePrice();
})();
