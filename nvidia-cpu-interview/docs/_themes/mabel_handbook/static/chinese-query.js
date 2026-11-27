// Sphinx indexes Chinese with jieba. Split queries against the same vocabulary.
(() => {
  const defaultSplit = window.splitQuery;
  const particles = new Set(["的", "与", "和", "了", "在"]);
  let vocabulary;
  let maxLength = 0;

  function splitChinese(text) {
    const words = [];
    let unknown = "";
    for (let start = 0; start < text.length;) {
      let end = Math.min(text.length, start + maxLength);
      while (end > start && !vocabulary.has(text.slice(start, end))) end--;
      if (end === start) {
        const character = text[start++];
        if (!particles.has(character)) unknown += character;
        continue;
      }
      if (unknown) words.push(unknown);
      unknown = "";
      words.push(text.slice(start, end));
      start = end;
    }
    if (unknown) words.push(unknown);
    return words;
  }

  window.splitQuery = function (query) {
    if (!/\p{Script=Han}/u.test(query) || !Search.hasIndex()) return defaultSplit(query);
    if (!vocabulary) {
      const {terms, titleterms} = Search._index;
      vocabulary = new Set([...Object.keys(terms), ...Object.keys(titleterms)]);
      for (const term of vocabulary) maxLength = Math.max(maxLength, term.length);
    }
    const runs = query.match(/\p{Script=Han}+|[^\p{Script=Han}]+/gu) || [];
    return runs.flatMap(run => /\p{Script=Han}/u.test(run) ? splitChinese(run) : defaultSplit(run));
  };
})();
