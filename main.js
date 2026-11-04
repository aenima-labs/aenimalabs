(function () {
	'use strict';
	document.documentElement.classList.remove('no-js');

	var year = document.getElementById('year');
	if (year) year.textContent = new Date().getFullYear();

	var nav = document.querySelector('.nav');
	function syncNav() { nav.classList.toggle('is-scrolled', window.scrollY > 60); }
	window.addEventListener('scroll', syncNav, { passive: true });
	syncNav();

	// Reveal on scroll, staggered within a parent.
	var items = document.querySelectorAll('.reveal');
	if ('IntersectionObserver' in window) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (e) {
				if (!e.isIntersecting) return;
				var siblings = Array.prototype.filter.call(e.target.parentNode.children, function (c) { return c.classList.contains('reveal'); });
				e.target.style.setProperty('--d', Math.min(siblings.indexOf(e.target), 6) * 80 + 'ms');
				e.target.classList.add('is-in');
				io.unobserve(e.target);
			});
		}, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
		items.forEach(function (el) { io.observe(el); });
	} else {
		items.forEach(function (el) { el.classList.add('is-in'); });
	}

	// Mobile menu: a full-screen sheet; closes on a link, Escape, or resize to desktop.
	var root = document.documentElement;
	var toggle = document.querySelector('.nav-toggle');
	var sheet = document.getElementById('nav-sheet');
	function setMenu(open) {
		if (open) sheet.hidden = false;
		requestAnimationFrame(function () { root.classList.toggle('menu-open', open); });
		toggle.setAttribute('aria-expanded', String(open));
		toggle.querySelector('.sr').textContent = open ? 'Close menu' : 'Menu';
		// keep focus inside the sheet while it is open
		Array.prototype.forEach.call(document.querySelectorAll('main, footer, .skip'), function (el) { el.inert = open; });
		if (open) setTimeout(function () { var first = sheet.querySelector('a'); if (first) first.focus({ preventScroll: true }); }, 60);
		if (!open) setTimeout(function () { if (!root.classList.contains('menu-open')) sheet.hidden = true; }, 350);
	}
	if (toggle && sheet) {
		toggle.addEventListener('click', function () { setMenu(!root.classList.contains('menu-open')); });
		sheet.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
		document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); toggle.focus(); } });
		window.matchMedia('(min-width: 1081px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
	}

	// Mark the nav link for the section in view.
	var links = Array.prototype.slice.call(document.querySelectorAll('.nav-links a[href^="#"]:not(.nav-cta)'));
	if ('IntersectionObserver' in window && links.length) {
		var byId = {};
		links.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
		var spy = new IntersectionObserver(function (entries) {
			entries.forEach(function (e) {
				var a = byId[e.target.id];
				if (!a) return;
				if (e.isIntersecting) {
					links.forEach(function (l) { l.removeAttribute('aria-current'); });
					a.setAttribute('aria-current', 'true');
				} else if (a.getAttribute('aria-current')) {
					a.removeAttribute('aria-current');
				}
			});
		}, { rootMargin: '-45% 0px -50% 0px' });
		Object.keys(byId).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
	}

	// Stardust around the Kodama tree (same idea as kodama.house, lighter).
	var canvas = document.querySelector('.kodama-dust');
	if (!canvas || !canvas.getContext) return;
	var ctx = canvas.getContext('2d');
	var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var dpr = Math.min(window.devicePixelRatio || 1, 2);
	var W, H, motes = [], raf;

	function size() {
		var r = canvas.getBoundingClientRect();
		W = r.width; H = r.height;
		canvas.width = W * dpr; canvas.height = H * dpr;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
	}
	function mote(m) {
		var a = Math.random() * Math.PI * 2, r = Math.sqrt(Math.random()) * Math.min(W, H) * 0.36;
		m.x = W / 2 + Math.cos(a) * r; m.y = H * 0.42 + Math.sin(a) * r * 0.8;
		m.s = 0.7 + Math.random() * 1.8; m.p = Math.random() * 6.3; m.v = 0.1 + Math.random() * 0.3;
		m.life = 0; m.max = 300 + Math.random() * 500;
		return m;
	}
	// The glow (the costly part) is painted once into a sprite; the star stays a crisp vector.
	var glow = (function () {
		var S = 64, r = S / 2, c = document.createElement('canvas');
		c.width = c.height = S;
		var g = c.getContext('2d');
		var grad = g.createRadialGradient(r, r, 0, r, r, r);
		grad.addColorStop(0, 'rgba(227,206,149,.5)'); grad.addColorStop(1, 'rgba(201,162,78,0)');
		g.fillStyle = grad; g.fillRect(0, 0, S, S);
		return c;
	})();
	function frame(now) {
		var t = now / 1000;
		ctx.clearRect(0, 0, W, H);
		ctx.globalCompositeOperation = 'lighter';
		ctx.fillStyle = 'rgb(244,237,224)';
		motes.forEach(function (m) {
			m.life++; m.y -= m.v * 0.4; m.x += Math.sin(t * 0.6 + m.p) * 0.25;
			var r = m.s * 5, k = m.s * 2.4;
			ctx.globalAlpha = Math.max(0, Math.sin(Math.min(m.life / m.max, 1) * Math.PI) * (0.55 + 0.45 * Math.sin(t * 2 + m.p)));
			ctx.drawImage(glow, m.x - r, m.y - r, r * 2, r * 2);
			ctx.beginPath();
			ctx.moveTo(m.x, m.y - k); ctx.quadraticCurveTo(m.x, m.y, m.x + k, m.y);
			ctx.quadraticCurveTo(m.x, m.y, m.x, m.y + k); ctx.quadraticCurveTo(m.x, m.y, m.x - k, m.y);
			ctx.quadraticCurveTo(m.x, m.y, m.x, m.y - k); ctx.fill();
			if (m.life > m.max) mote(m);
		});
		ctx.globalAlpha = 1;
		ctx.globalCompositeOperation = 'source-over';
		if (!reduced) raf = requestAnimationFrame(frame);
	}
	size();
	for (var i = 0; i < 48; i++) { var m = mote({}); m.life = Math.random() * m.max; motes.push(m); }
	window.addEventListener('resize', size);
	if ('IntersectionObserver' in window && !reduced) {
		new IntersectionObserver(function (e) {
			cancelAnimationFrame(raf);
			if (e[0].isIntersecting) raf = requestAnimationFrame(frame);
		}).observe(canvas);
	} else {
		raf = requestAnimationFrame(frame);
	}
})();
