/* Favorites share the existing search panel and product cards. */
(() => {
  const key = 'hmaria-favorites';
  let showingFavorites = false;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(saved)) saved.forEach(id => { if (PRODUTOS.some(p => p.id === id)) favs.add(id); });
  } catch (_) {}
  const update = () => {
    document.querySelectorAll('.card .fav').forEach(button => {
      button.classList.toggle('on', favs.has(button.closest('.card').dataset.id));
    });
    const pill = document.getElementById('fav-count');
    pill.textContent = favs.size;
    pill.hidden = !favs.size;
  };
  const show = () => {
    const products = PRODUTOS.filter(p => favs.has(p.id));
    document.getElementById('results').innerHTML = products.map(p => cardHTML(p, true)).join('');
    if (!products.length) document.getElementById('results').innerHTML = '<p class="no-res">Você ainda não tem peças favoritas. Toque no coração de uma peça para salvá-la.</p>';
  };
  update();
  document.getElementById('btn-favorites').addEventListener('click', () => {
    fecharTudo();
    showingFavorites = true;
    document.getElementById('search-input').value = '';
    show();
    abrir(document.getElementById('searchbox'));
  });
  document.getElementById('btn-search').addEventListener('click', () => {
    showingFavorites = false;
    buscar(document.getElementById('search-input').value);
  });
  document.getElementById('search-input').addEventListener('input', () => { showingFavorites = false; });
  document.addEventListener('click', event => {
    if (!event.target.closest('.fav')) return;
    try { localStorage.setItem(key, JSON.stringify([...favs])); } catch (_) {}
    update();
    if (showingFavorites) show();
  });
})();
