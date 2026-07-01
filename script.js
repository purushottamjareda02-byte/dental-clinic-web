// ===== Mobile nav toggle =====
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
  }

  // ===== Before/After draggable sliders =====
  document.querySelectorAll('.ba-images').forEach((wrap) => {
    const after = wrap.querySelector('img.after');
    const before = wrap.querySelector('img.before');
    const divider = wrap.querySelector('.ba-divider');
    if (!after || !divider) return;
    let dragging = false;

    // Stop the browser from starting a native image drag (the "ghost" image
    // + blue selection tint that appears when you drag over text/images).
    [before, after].forEach((img) => {
      if (!img) return;
      img.setAttribute('draggable', 'false');
      img.addEventListener('dragstart', (e) => e.preventDefault());
    });

    // NEW — keeps the drag handle from ever reaching the BEFORE/AFTER badges
const setPos = (clientX) => {
  const rect = wrap.getBoundingClientRect();
  let pct = ((clientX - rect.left) / rect.width) * 100;
  pct = Math.max(8, Math.min(92, pct)); // was 0–100, now leaves room for the badges
  after.style.clipPath = `inset(0 0 0 ${pct}%)`;
  divider.style.left = `${pct}%`;
};

    const startDrag = (e) => {
      dragging = true;
      wrap.classList.add('dragging');
      document.body.classList.add('ba-no-select');
      e.preventDefault(); // stops text/element selection from starting
    };

    const stopDrag = () => {
      if (!dragging) return;
      dragging = false;
      wrap.classList.remove('dragging');
      document.body.classList.remove('ba-no-select');
    };

    // Mouse
    divider.addEventListener('mousedown', startDrag);
    window.addEventListener('mouseup', stopDrag);
    window.addEventListener('mousemove', (e) => {
      if (!dragging) return;
      e.preventDefault();
      setPos(e.clientX);
    });

    // Touch
    divider.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchend', stopDrag);
    window.addEventListener('touchcancel', stopDrag);
    window.addEventListener('touchmove', (e) => {
      if (!dragging || !e.touches[0]) return;
      e.preventDefault(); // also stops the page from scrolling mid-drag
      setPos(e.touches[0].clientX);
    }, { passive: false });

    // Click anywhere on the image to jump the slider to that point
    wrap.addEventListener('click', (e) => setPos(e.clientX));
  });

  // ===== Gallery / review filter chips =====
  document.querySelectorAll('.chips').forEach((chipBar) => {
    const targetSelector = chipBar.dataset.target;
    if (!targetSelector) return;
    const items = document.querySelectorAll(targetSelector);

    chipBar.querySelectorAll('.chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        chipBar.querySelectorAll('.chip').forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.dataset.filter;
        items.forEach((item) => {
          const show = filter === 'all' || item.dataset.category === filter;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  });

  // ===== Appointment form (front-end only — wire to your backend / email service) =====
  const apptForm = document.getElementById('appointment-form');
  if (apptForm) {
    apptForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('form-msg');
      const name = document.getElementById('f-name').value.trim();
      const phone = document.getElementById('f-phone').value.trim();
      const date = document.getElementById('f-date').value;

      if (!name || !phone || !date) {
        msg.textContent = 'Please fill in your name, phone number, and preferred date.';
        msg.className = 'form-msg err';
        return;
      }
      // Placeholder success state — replace with a real fetch() call to your
      // booking API, CRM, or an email service (e.g. Formspree, EmailJS) so
      // submissions actually reach the clinic.
      msg.textContent = `Thank you, ${name}! Your request has been received — our front desk will call ${phone} shortly to confirm your visit.`;
      msg.className = 'form-msg ok';
      apptForm.reset();
    });
  }

  // ===== Leaflet map =====
  const mapEl = document.getElementById('map');
  if (mapEl && window.L) {
    const lat = 25.1697, lng = 75.8546; // Kota, Rajasthan — replace with the clinic's exact coordinates
    const map = L.map('map', { scrollWheelZoom: false }).setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);
    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup('<strong>Sterling Smile Dental Care</strong><br>Replace with your real address').openPopup();
  }

  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
