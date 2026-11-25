(() => {
  const filters = Array.from(document.querySelectorAll('[data-group]'));
  const sections = Array.from(document.querySelectorAll('.group'));
  const query = document.getElementById('query');
  const clear = document.getElementById('clear-query');
  const empty = document.getElementById('empty');
  const count = document.getElementById('result-count');
  document.getElementById('module-search').hidden = false;

  function currentGroup() {
    const id = location.hash.slice(1);
    return sections.some(section => section.id === id) ? id : 'all';
  }

  function render() {
    const group = currentGroup();
    const terms = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    let total = 0;
    for (const section of sections) {
      const heading = section.querySelector('h3').textContent;
      let matches = 0;
      for (const item of section.querySelectorAll('li')) {
        const text = (heading + ' ' + item.textContent + ' ' + item.dataset.keywords).toLowerCase();
        const visible = (group === 'all' || group === section.id) && terms.every(term => text.includes(term));
        item.hidden = !visible;
        if (visible) matches++;
      }
      section.hidden = matches === 0;
      total += matches;
    }
    for (const link of filters) {
      if (link.dataset.group === group) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    count.textContent = total + ' 个模块';
    clear.hidden = !query.value;
    empty.hidden = total > 0;
  }

  function restore() {
    query.value = new URL(location.href).searchParams.get('q') || '';
    render();
  }

  function setSearch() {
    const url = new URL(location.href);
    if (query.value.trim()) url.searchParams.set('q', query.value.trim());
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    render();
  }

  for (const link of filters) {
    link.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      if (location.hash !== link.hash) history.pushState(null, '', link.hash);
      render();
    });
  }
  query.addEventListener('input', setSearch);
  clear.addEventListener('click', () => {
    query.value = '';
    setSearch();
    query.focus();
  });
  document.getElementById('reset').addEventListener('click', () => {
    const url = new URL(location.href);
    url.searchParams.delete('q');
    url.hash = 'directory';
    history.pushState(null, '', url);
    restore();
    query.focus();
  });
  window.addEventListener('popstate', restore);
  window.addEventListener('hashchange', restore);
  restore();
})();
