/* DigiShelf storefront – renders icons + products from data/products.json (managed via admin.html) */
(function () {
  'use strict';
  var FALLBACK = { categories: [], products: [] };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  // allow only http(s), mailto and relative links
  function safeUrl(u) {
    u = String(u || '').trim();
    if (!u) return '';
    if (/^(https?:|mailto:)/i.test(u)) return u;
    if (/^[a-z][a-z0-9+.-]*:/i.test(u) || u.indexOf('//') === 0) return '';
    return u;
  }
  function money(n) { n = Number(n); return isFinite(n) && n > 0 ? '₹' + n.toLocaleString('en-IN') : 'Free'; }

  function load() {
    return fetch('data/products.json?v=' + Date.now(), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .catch(function () { return FALLBACK; });
  }

  function catHref(c) { return safeUrl(c.link) || 'category.html?cat=' + encodeURIComponent(c.id); }

  function renderIcons(data) {
    var ul = document.getElementById('cats');
    if (!ul) return;
    var html = (data.categories || []).filter(function (c) { return c.visible !== false; }).map(function (c) {
      var ext = /^https?:/i.test(catHref(c)) ? ' target="_blank" rel="noopener"' : '';
      return '<li><a class="cat" href="' + esc(catHref(c)) + '"' + ext + '><span class="c">' +
        '<img src="' + esc(safeUrl(c.icon)) + '" alt="" loading="lazy"></span>' + esc(c.name) + '</a></li>';
    }).join('');
    html += '<li><a class="cat" href="category.html?cat=all"><span class="c all"><svg width="40" height="40" viewBox="0 0 24 24" fill="#0d3b2e"><circle cx="6" cy="6" r="1.8"/><circle cx="12" cy="6" r="1.8"/><circle cx="18" cy="6" r="1.8"/><circle cx="6" cy="12" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="18" cy="12" r="1.8"/><circle cx="6" cy="18" r="1.8"/><circle cx="12" cy="18" r="1.8"/><circle cx="18" cy="18" r="1.8"/></svg></span>View All</a></li>';
    ul.innerHTML = html;
  }

  function card(p) {
    var link = safeUrl(p.link) || '#';
    var ext = /^https?:/i.test(link) ? ' target="_blank" rel="noopener"' : '';
    var img = safeUrl(p.image);
    var cover = img ? '<img src="' + esc(img) + '" alt="' + esc(p.title) + '" loading="lazy">'
                    : '<span class="ph">' + esc((p.title || '?').charAt(0).toUpperCase()) + '</span>';
    var off = '';
    if (Number(p.mrp) > Number(p.price) && Number(p.price) > 0) {
      off = '<s style="font-size:11px;color:#8a948e;margin-left:6px">' + money(p.mrp) + '</s>';
    }
    return '<a class="pcard" href="' + esc(link) + '"' + ext + '><div class="cover">' + cover + '</div>' +
      '<h3>' + esc(p.title) + '</h3>' + (p.description ? '<p>' + esc(p.description) + '</p>' : '') +
      '<div class="buy"><span class="price"><b>' + money(p.price) + '</b>' + off + '</span><span class="btn">Get it</span></div></a>';
  }

  function published(data, cat) {
    return (data.products || []).filter(function (p) {
      return p.published !== false && (!cat || cat === 'all' || p.category === cat);
    }).sort(function (a, b) { return String(b.created || '').localeCompare(String(a.created || '')); });
  }

  function renderHome(data) {
    var box = document.getElementById('ebook-list');
    if (!box) return;
    var list = published(data, 'ebooks');
    box.innerHTML = list.length ? list.map(card).join('') : '<div class="empty">New e-books are coming soon.</div>';
  }

  function renderCategory(data) {
    var box = document.getElementById('plist');
    if (!box) return;
    var qs = new URLSearchParams(location.search);
    var id = qs.get('cat') || 'all', q = (qs.get('q') || '').trim().toLowerCase();
    var cat = (data.categories || []).filter(function (c) { return c.id === id; })[0];
    var title = id === 'all' ? 'All Products' : (cat ? cat.name : 'Shop');
    var list = published(data, id);
    if (q) {
      title = 'Search: ' + qs.get('q');
      list = list.filter(function (p) { return (p.title + ' ' + (p.description || '')).toLowerCase().indexOf(q) > -1; });
    }
    document.getElementById('ptitle').textContent = title;
    document.getElementById('crumb').textContent = title;
    document.getElementById('pdesc').textContent = (!q && cat && cat.description) || '';
    document.title = title + ' – DigiShelf';
    box.innerHTML = list.length ? list.map(card).join('') : '<div class="empty">Nothing published here yet — check back soon.</div>';
  }

  load().then(function (data) { renderIcons(data); renderHome(data); renderCategory(data); });
})();
