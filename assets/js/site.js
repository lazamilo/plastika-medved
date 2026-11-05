/* Shared chrome: header, mega menu, mobile menu, footer, smooth scroll, reveals */
(function(){
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.remove('no-js');
  if (reduced) document.documentElement.classList.add('reduced');

  const PROGRAMS = [
    {key:'nagrobni', name:'Nagrobni program', img:'velika-kapela'},
    {key:'termo', name:'Termo program', img:'zvonik'},
    {key:'loncki', name:'Lončki', img:'valj'},
    {key:'vlozki', name:'Vložki', img:'spiralni-vlozek'},
    {key:'party', name:'Party', img:'party-1'},
    {key:'plastenke', name:'Plastenke', img:'kanister-5l'}
  ];
  window.PROGRAMS = PROGRAMS;
  const count = k => (window.PRODUCTS||[]).filter(p=>p.cat===k).length;
  const page = document.body.dataset.page;
  const cur = p => page===p ? ' aria-current="page"' : '';
  const arrow = '<svg viewBox="0 0 16 16" fill="none"><path d="M1 8h13M9 3l5 5-5 5" stroke="currentColor" stroke-width="1.6"/></svg>';
  window.ARROW = arrow;

  const header = `
  <header class="nav" id="nav">
    <a class="nav-logo" href="index.html" aria-label="Plastika Medved, domov"><img src="assets/img/logo.png" alt="Plastika Medved d.o.o."></a>
    <nav class="nav-links" aria-label="Glavna navigacija">
      <button id="megaBtn" aria-expanded="false" aria-controls="mega"${cur('izdelki')}>Izdelki <svg class="chev" viewBox="0 0 10 10" fill="none"><path d="M1 3l4 4 4-4" stroke="currentColor" stroke-width="1.6"/></svg></button>
      <a href="proizvodnja.html"${cur('proizvodnja')}>Proizvodnja</a>
      <a href="o-nas.html"${cur('onas')}>O nas</a>
      <a href="kontakt.html"${cur('kontakt')}>Kontakt</a>
    </nav>
    <div class="nav-cta">
      <a class="btn" href="kontakt.html">Povpraševanje ${arrow}</a>
      <button class="burger" id="burger" aria-label="Meni"><span></span><span></span></button>
    </div>
  </header>
  <div class="mega-scrim" id="megaScrim"></div>
  <div class="mega" id="mega">
    ${PROGRAMS.map(p=>`<a href="izdelki.html?program=${p.key}"><b>${p.name}</b><small>${count(p.key)} ${count(p.key)===1?'izdelek':(count(p.key)===2?'izdelka':(count(p.key)<5?'izdelki':'izdelkov'))}</small><img src="assets/products/${p.img}.png" alt=""></a>`).join('')}
  </div>
  <div class="mnav" id="mnav">
    <a href="izdelki.html">Izdelki</a>
    <div class="sub">${PROGRAMS.map(p=>`<a href="izdelki.html?program=${p.key}">${p.name}</a>`).join('')}</div>
    <a href="proizvodnja.html">Proizvodnja</a>
    <a href="o-nas.html">O nas</a>
    <a href="kontakt.html">Kontakt</a>
    <a class="btn red-btn" href="kontakt.html">Povpraševanje ${arrow}</a>
  </div>`;

  const footer = `
  <footer class="foot">
    <div class="wrap">
      <div class="foot-top">
        <h3>Potrebujete lončke za naslednjo sezono? <a href="kontakt.html">Pišite nam.</a></h3>
        <div class="foot-col"><b>Naslov</b>Plastika Medved d.o.o.<br>Dragonja vas 30<br>2326 Cirkovce, Slovenija</div>
        <div class="foot-col"><b>Telefon</b><a href="tel:+38627923331">+386 2 792 33 31</a><br><a href="tel:+38627890190">+386 2 789 01 90</a><br><a href="tel:+38631313902">+386 31 313 902</a></div>
        <div class="foot-col"><b>E-pošta</b><a href="mailto:info@plastika-medved.com">info@plastika-medved.com</a><br><a href="assets/docs/katalog-plastika-medved.pdf" target="_blank">Katalog (PDF)</a><br><a href="assets/docs/certifikat.pdf" target="_blank">Certifikat Excellent SME</a></div>
      </div>
      <div class="foot-word" aria-hidden="true">Plastika Medved</div>
      <div class="foot-base"><span>© ${new Date().getFullYear()} Plastika Medved d.o.o. Vse pravice pridržane.</span><span><a href="izdelki.html">Izdelki</a> &nbsp;·&nbsp; <a href="proizvodnja.html">Proizvodnja</a> &nbsp;·&nbsp; <a href="o-nas.html">O nas</a> &nbsp;·&nbsp; <a href="kontakt.html">Kontakt</a></span></div>
    </div>
  </footer>`;

  document.body.insertAdjacentHTML('afterbegin', header);
  const fslot = document.getElementById('footer');
  if (fslot) fslot.outerHTML = footer;

  // mega menu
  const nav = document.getElementById('nav'), mega = document.getElementById('mega'), scrim = document.getElementById('megaScrim'), mbtn = document.getElementById('megaBtn');
  let closeT;
  const openMega = () => { clearTimeout(closeT); mega.classList.add('open'); scrim.classList.add('open'); nav.classList.add('mega-open','solid'); mbtn.setAttribute('aria-expanded','true'); };
  const closeMega = () => { closeT = setTimeout(()=>{ mega.classList.remove('open'); scrim.classList.remove('open'); nav.classList.remove('mega-open'); mbtn.setAttribute('aria-expanded','false'); onScroll(); }, 120); };
  mbtn.addEventListener('mouseenter', openMega);
  mbtn.addEventListener('click', () => mega.classList.contains('open') ? closeMega() : openMega());
  mbtn.addEventListener('mouseleave', closeMega);
  mega.addEventListener('mouseenter', ()=>clearTimeout(closeT));
  mega.addEventListener('mouseleave', closeMega);
  scrim.addEventListener('click', closeMega);
  addEventListener('keydown', e => { if (e.key==='Escape') { closeMega(); document.body.classList.remove('menu-open'); } });

  // mobile
  document.getElementById('burger').addEventListener('click', () => document.body.classList.toggle('menu-open'));

  // header state
  let lastY = 0;
  function onScroll(){
    const y = scrollY;
    if (!mega.classList.contains('open')) nav.classList.toggle('solid', y > 40 || document.body.dataset.solid === '1');
    nav.classList.toggle('hide', y > 400 && y > lastY && !mega.classList.contains('open') && !document.body.classList.contains('menu-open'));
    lastY = y;
  }
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  // smooth scroll + gsap
  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
    if (!reduced && window.Lenis) {
      const lenis = new Lenis({lerp:.1, smoothWheel:true});
      window.lenis = lenis;
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add(t => lenis.raf(t*1000));
      gsap.ticker.lagSmoothing(0);
    }
    if (!reduced) setTimeout(() => {
      gsap.utils.toArray('.rv').forEach(el => {
        gsap.to(el, {opacity:1, y:0, duration:1.1, ease:'expo.out', delay:+(el.dataset.d||0),
          scrollTrigger:{trigger:el, start:'top 88%', once:true}});
      });
      // mini parallax inside frames
      gsap.utils.toArray('[data-par]').forEach(img => {
        gsap.fromTo(img, {yPercent:-6}, {yPercent:6, ease:'none', scrollTrigger:{trigger:img.parentElement, start:'top bottom', end:'bottom top', scrub:true}});
      });
      // gray to ink text fill
      gsap.utils.toArray('[data-fill]').forEach(el => {
        const words = el.textContent.trim().split(/\s+/);
        el.innerHTML = words.map(w=>`<span class="fw">${w}</span>`).join(' ');
        gsap.fromTo(el.querySelectorAll('.fw'), {color:'#c4c0b9'}, {color:'#121212', stagger:.08, ease:'none',
          scrollTrigger:{trigger:el, start:'top 80%', end:'bottom 45%', scrub:true}});
      });
      ScrollTrigger.refresh();
    }, 0);
  }
})();
