// Русская типографика для HTML перед рендером в PNG (Playwright).
// fix(): ставит неразрывный пробел после коротких предлогов, союзов и частиц,
// между цифрой и словом, перед тире; «же/ли/бы» цепляет к предыдущему слову.
// check(): после вёрстки ищет короткие слова, которые всё равно остались в конце строки.
// Использование:
//   await page.addScriptTag({ path: '.../nbsp_ru.js' });
//   await page.evaluate(() => window.nbspRu.fix());
//   const bad = await page.evaluate(() => window.nbspRu.check());  // [] = чисто
(function () {
  var SHORT = 'в|во|с|со|к|ко|у|о|об|обо|а|и|я|на|по|до|за|из|от|не|ни|но|да|без|для|при|про|над|под|или|из-за|из-под';
  var NB = ' ';
  var reShort = new RegExp('(^|[\\s(«"„\\[—–-])(' + SHORT + ')[ \\t\\n]+', 'giu');
  var reTail = new RegExp('[ \\t\\n]+(же|ли|ль|бы|б)(?=$|[\\s.,!?:;…»")])', 'giu');
  var reEnd = new RegExp('(^|[\\s«(])(' + SHORT + ') $', 'iu');
  var reWord = new RegExp('^(' + SHORT + ')$', 'iu');

  function fixText(s) {
    var prev;
    do { prev = s; s = s.replace(reShort, function (m, a, w) { return a + w + NB; }); } while (s !== prev);
    s = s.replace(/(\d)[ \t\n]+(?=[^\s\d])/gu, '$1' + NB);
    s = s.replace(/(\d)[ \t\n]+(?=\d{3}\b)/gu, '$1' + NB);
    s = s.replace(/[ \t\n]+([—–])/gu, NB + '$1');
    s = s.replace(reTail, NB + '$1');
    return s;
  }
  function textNodes(root) {
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        return /^(SCRIPT|STYLE)$/.test(n.parentNode.nodeName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
      }
    });
    var out = []; while (w.nextNode()) out.push(w.currentNode); return out;
  }
  function fix(root) {
    var nodes = textNodes(root || document.body);
    nodes.forEach(function (n) { n.nodeValue = fixText(n.nodeValue); });
    // короткое слово в конце узла, следующий узел (<b>, <em>) начинается после пробела
    nodes.forEach(function (n) { n.nodeValue = n.nodeValue.replace(reEnd, '$1$2' + NB); });
    return true;
  }
  function check(root) {
    var words = [];
    textNodes(root || document.body).forEach(function (n) {
      var re = /[^\s ]+/gu, m;
      while ((m = re.exec(n.nodeValue))) {
        var r = document.createRange(); r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
        var rect = r.getClientRects()[0];
        if (rect) words.push({ t: m[0], top: Math.round(rect.top), block: n.parentNode.closest('p,li,div') });
      }
    });
    var bad = [];
    for (var i = 0; i < words.length - 1; i++) {
      var a = words[i], b = words[i + 1];
      var sameBlock = a.block && b.block && (a.block === b.block || a.block.contains(b.block) || b.block.contains(a.block));
      if (/[,.:;!?…]$/.test(a.t)) continue;
      var clean = a.t.replace(/[«»"()]/gu, "");
      if (sameBlock && b.top > a.top + 4 && reWord.test(clean)) bad.push(a.t + ' / ' + b.t);
    }
    return bad;
  }
  window.nbspRu = { fix: fix, check: check, fixText: fixText };
})();
