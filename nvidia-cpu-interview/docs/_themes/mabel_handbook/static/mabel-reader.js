(() => {
  const button = document.querySelector('.mabel-toggle');
  const sidebar = document.querySelector('.wy-nav-side');
  const content = document.querySelector('.wy-nav-content-wrap');
  const scrim = document.querySelector('.mabel-scrim');
  if (!button || !sidebar || !content || !scrim) return;
  const narrow = window.matchMedia('(max-width: 768px)');
  document.documentElement.classList.add('mabel-enhanced');

  function setMenu(open, focusToggle = false) {
    const visible = open && narrow.matches;
    document.documentElement.classList.toggle('mabel-menu-open', visible);
    button.setAttribute('aria-expanded', String(visible));
    sidebar.inert = narrow.matches && !visible;
    content.inert = visible;
    scrim.hidden = !visible;
    if (visible) {
      const first = sidebar.querySelector('input[name=q]') || sidebar.querySelector('a[href]');
      if (first) first.focus();
    } else if (focusToggle) button.focus();
  }

  button.addEventListener('click', () => setMenu(button.getAttribute('aria-expanded') !== 'true'));
  scrim.addEventListener('click', () => setMenu(false, true));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !scrim.hidden) setMenu(false, true);
  });
  sidebar.addEventListener('click', event => {
    if (scrim.hidden || event.target.closest('button') || !event.target.closest('a[href]')) return;
    setMenu(false, true);
  });
  narrow.addEventListener('change', () => setMenu(false));
  window.addEventListener('pageshow', () => setMenu(false));
  setMenu(false);

})();
