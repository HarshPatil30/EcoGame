// Cinematic loading screen logic for EcoGame main entry
window.addEventListener('DOMContentLoaded', function() {
  const loader = document.createElement('div');
  loader.id = 'eco-loader';
    loader.innerHTML = `
      <div class="eco-loader-bg">
        <img src="images/earth.png" class="eco-loader-earth" alt="Earth loading" />
        <h1 class="eco-loader-title">EcoGame</h1>
        <div class="eco-loader-sub">Protect Our Planet</div>
        <div class="eco-loader-anim">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
  document.body.appendChild(loader);

  // Animate loader text fill and fade out
  setTimeout(() => {
    loader.classList.add('eco-loader-hide');
    setTimeout(() => loader.remove(), 900);
  }, 2600);
});
