(function() {
  var t = document.getElementById('themeToggle');
  if (t) {
    t.addEventListener('click', function() {
      var h = document.documentElement;
      var s = h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      h.setAttribute('data-theme', s);
      try { localStorage.setItem('migo-theme', s); } catch(e) {}
    });
    var st = (function(){ try { return localStorage.getItem('migo-theme'); } catch(e) {} })();
    if (st) document.documentElement.setAttribute('data-theme', st);
  }

  var m = document.getElementById('menuToggle');
  var n = document.getElementById('nav');
  if (m && n) {
    m.addEventListener('click', function() {
      n.classList.toggle('nav-open');
      m.classList.toggle('menu-open');
      document.body.classList.toggle('body-nav-open');
    });
    n.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        n.classList.remove('nav-open');
        m.classList.remove('menu-open');
        document.body.classList.remove('body-nav-open');
      });
    });
  }

  var bt = document.getElementById('backTop');
  if (bt) {
    window.addEventListener('scroll', function() {
      bt.classList.toggle('visible', window.scrollY > 400);
    });
    bt.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  var pb = document.getElementById('progressBar');
  if (pb) {
    window.addEventListener('scroll', function() {
      var h = document.documentElement;
      var p = (h.scrollTop || document.body.scrollTop) / ((h.scrollHeight || document.body.scrollHeight) - (h.clientHeight || document.body.clientHeight)) * 100;
      pb.style.width = Math.min(p, 100) + '%';
    });
  }

  document.querySelectorAll('.highlight').forEach(function(block) {
    var btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
    block.appendChild(btn);
    btn.addEventListener('click', function() {
      var code = block.querySelector('code');
      if (!code) return;
      var text = code.textContent;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(function() {
          btn.classList.add('copied');
          btn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>';
          setTimeout(function() {
            btn.classList.remove('copied');
            btn.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
          }, 2000);
        });
      }
    });
  });

  var lb = document.getElementById('lightbox');
  var lbImg = document.getElementById('lightboxImg');
  if (lb && lbImg) {
    document.getElementById('postContent').addEventListener('click', function(e) {
      if (e.target.tagName === 'IMG') {
        lbImg.src = e.target.src;
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
      }
    });
    lb.addEventListener('click', function() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && lb.classList.contains('open')) {
        lb.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  var so = document.getElementById('searchOverlay');
  var sb = document.getElementById('searchBtn');
  var si = document.getElementById('searchInput');
  var sr = document.getElementById('searchResults');
  var searchData = [];
  if (so && sb && si && sr) {
    sb.addEventListener('click', function() { so.classList.add('open'); si.focus(); si.value = ''; sr.innerHTML = ''; });
    so.addEventListener('click', function(e) { if (e.target === so) { so.classList.remove('open'); } });
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && so.classList.contains('open')) { so.classList.remove('open'); }
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); so.classList.add('open'); si.focus(); si.value = ''; sr.innerHTML = ''; }
    });
    fetch('/search.xml').then(function(r) { return r.text(); }).then(function(xml) {
      var parser = new DOMParser();
      var doc = parser.parseFromString(xml, 'text/xml');
      doc.querySelectorAll('entry').forEach(function(entry) {
        searchData.push({
          title: (entry.querySelector('title') || {}).textContent || '',
          content: (entry.querySelector('content') || {}).textContent || '',
          url: (entry.querySelector('url') || {}).textContent || '',
          date: (entry.querySelector('published') || {}).textContent || ''
        });
      });
    });
    si.addEventListener('input', function() {
      var q = si.value.toLowerCase().trim();
      if (!q) { sr.innerHTML = ''; return; }
      var results = searchData.filter(function(item) { return (item.title.toLowerCase().indexOf(q) > -1) || (item.content.toLowerCase().indexOf(q) > -1); });
      if (results.length === 0) {
        sr.innerHTML = '<div class="search-empty">No results found</div>';
      } else {
        sr.innerHTML = results.map(function(item) {
          return '<a class="search-result-item" href="' + item.url + '">' +
            '<div class="search-result-title">' + item.title + '</div>' +
            '<div class="search-result-meta">' + (item.date ? new Date(item.date).toLocaleDateString() : '') + '</div></a>';
        }).join('');
      }
    });
  }

  var tocLinks = document.querySelectorAll('.toc .toc-link');
  if (tocLinks.length > 0) {
    var headings = [];
    tocLinks.forEach(function(link) {
      var id = link.getAttribute('href');
      if (id) {
        var el = document.getElementById(id.substring(1));
        if (el) headings.push({ el: el, link: link });
      }
    });
    window.addEventListener('scroll', function() {
      var scrollY = window.scrollY + 100;
      var current = null;
      headings.forEach(function(h) {
        if (h.el.offsetTop <= scrollY) current = h;
      });
      tocLinks.forEach(function(l) { l.classList.remove('active'); });
      if (current) current.link.classList.add('active');
    });
  }
})();