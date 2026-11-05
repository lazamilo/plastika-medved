/* Homepage: hero line-up, scale track, bento, colours, countries, counters */
(function(){
  const P = window.PRODUCTS, by = s => P.find(p=>p.slug===s);
  const reduced = document.documentElement.classList.contains('reduced');
  const A = window.ARROW;

  /* ---------- HERO ---------- */
  const hero = document.getElementById('hero'), stage = hero.querySelector('.hero-stage');
  const candle = document.getElementById('heroCandle');
  const ghostSlugs = ['super-kapela','medo','zvonik','luc','mega-piramida','super-spirala','sima','velika-buca'];
  const ghosts = ghostSlugs.map(s => {
    const img = new Image(); img.src = by(s).img; img.className = 'hero-ghost'; img.alt = ''; img.dataset.h = by(s).h;
    stage.appendChild(img); return img;
  });
  const BASE_H = 196; // velika kapela, mm

  function layoutRow(){
    // final row: ghosts 0-3 left, candle centre, ghosts 4-7 right, all on one baseline at true scale
    const vh = innerHeight, vw = innerWidth, s = vw < 640 ? .36 : .5;
    const candleH = candle.getBoundingClientRect().height / (gsap.getProperty(candle,'scale')||1);
    const mmPx = candleH * s / BASE_H;
    const gap = vw * (vw < 640 ? .008 : .018);
    const items = [...ghosts.slice(0,4), candle, ...ghosts.slice(4)];
    const widths = items.map(el => {
      const h = el === candle ? BASE_H : (+el.dataset.h || BASE_H);
      const ar = (el.naturalWidth||400) / (el.naturalHeight||1000);
      return {h: h*mmPx, w: h*mmPx*ar};
    });
    let total = widths.reduce((a,b)=>a+b.w,0) + gap*(items.length-1);
    const fit = Math.min(1, (vw - 2*Math.min(64, Math.max(20, vw*.032))) / total);
    widths.forEach(d=>{ d.w *= fit; d.h *= fit; }); total *= fit;
    let x = (vw - total)/2;
    const out = [];
    widths.forEach((d,i)=>{ out.push({x, w:d.w, h:d.h}); x += d.w + gap; });
    ghosts.forEach((g,i)=>{ const o = out[i<4?i:i+1]; g.style.height = o.h+'px'; g.style.left = o.x+'px'; });
    const c = out[4];
    return {candleX: c.x + c.w/2 - vw/2, scale: s*fit};
  }

  function heroTimeline(){
    gsap.set(candle,{xPercent:-50,x:0});
    let row = layoutRow();
    const tl = gsap.timeline({defaults:{ease:'none'}, scrollTrigger:{trigger:hero, start:'top top', end:'+=130%', pin:true, scrub:.6, invalidateOnRefresh:true,
      onRefreshInit:()=>{ gsap.set(candle,{clearProps:'transform'}); gsap.set(candle,{xPercent:-50,x:0}); row = layoutRow(); }}});
    tl.to('#hw1',{xPercent:-60, opacity:0, duration:.5},0)
      .to('#hw2',{xPercent:60, opacity:0, duration:.5},0)
      .to('#heroFoot',{opacity:0, y:30, duration:.3},0)
      .to(candle,{scale:()=>row.scale, x:()=>row.candleX, transformOrigin:'50% 100%', xPercent:-50, duration:.6},.1)
      .fromTo(ghosts,{opacity:0, y:80},{opacity:1, y:0, duration:.4, stagger:{each:.05, from:'center'}},.3)
      .to('#heroEnd',{opacity:1, y:0, duration:.3},.55)
      .to({}, {duration:.25});
    gsap.set('#heroEnd',{y:30});
  }

  /* ---------- SCALE TRACK ---------- */
  const track = document.getElementById('scaleTrack');
  const scaleItems = P.filter(p => (p.cat==='nagrobni'||p.cat==='termo') && p.h).sort((a,b)=>a.h-b.h);
  track.innerHTML = scaleItems.map(p=>`<a class="sitem" href="izdelki.html?izdelek=${p.slug}"><img src="${p.img}" alt="${p.name}" loading="lazy" data-h="${p.h}"><span><b>${p.name}</b>${p.h} mm</span></a>`).join('');
  function sizeTrack(){
    const pin = document.querySelector('.scale-pin');
    const head = pin.querySelector('.scale-head').offsetHeight;
    const avail = pin.clientHeight - head - 200;
    const k = Math.max(avail,180) / 330;
    track.querySelectorAll('img').forEach(i => i.style.height = (i.dataset.h*k)+'px');
  }
  function scaleTimeline(){
    sizeTrack();
    const dist = () => track.scrollWidth - innerWidth;
    gsap.to(track,{x:()=>-dist(), ease:'none', scrollTrigger:{trigger:'#scale', start:'top top', end:()=>'+='+dist()*.55, pin:true, scrub:.6, invalidateOnRefresh:true, onRefreshInit:sizeTrack,
      onUpdate:self=>gsap.set('#scaleBar',{scaleX:self.progress})}});
  }

  /* ---------- BENTO ---------- */
  const tiles = [
    {k:'nagrobni', name:'Nagrobni program', p:'Veliki in srednji nagrobni lončki s pokrovi, v do devetih barvah.', imgs:['mita','srednje-srce','nova-kocka']},
    {k:'termo', name:'Termo program', p:'Mega, veliki in mali termo lončki.', imgs:['zvonik','medo','luc']},
    {k:'vlozki', name:'Vložki', p:'Prozorni vložki za polnjenje sveč.', imgs:['spiralni-vlozek','veliki-novi-vlozek','mali-vlozek']},
    {k:'loncki', name:'Lončki', p:'Lončki za industrijo sveč.', imgs:['13501','valj','at125']},
    {k:'party', name:'Party', p:'Lončki za praznične in vrtne sveče.', imgs:['party-1']},
    {k:'plastenke', name:'Plastenke', p:'Plastenke in kanistri za kis, sokove in kemično industrijo.', imgs:['kanister-5l','kanister-3l']}
  ];
  const n = k => P.filter(p=>p.cat===k).length;
  const word = {nagrobni:'Nagrobni',termo:'Termo',vlozki:'Vložki',loncki:'Lončki',party:'Party',plastenke:'Plastenke'};
  document.getElementById('bento').innerHTML = tiles.map((t,i)=>`
    <a class="tile t-${t.k} rv" data-d="${(i%3)*.06}" href="izdelki.html?program=${t.k}">
      <span class="word" aria-hidden="true">${word[t.k]}</span>
      <div class="t-top"><div><h3>${t.name}</h3><span class="cnt">${n(t.k)} ${n(t.k)===1?'izdelek':n(t.k)===2?'izdelka':n(t.k)<5?'izdelki':'izdelkov'}</span></div></div>
      <span class="go">${A}</span>
      <p>${t.p}</p>
      <div class="prods">${t.imgs.map(s=>`<img src="${by(s).img}" alt="${by(s).name}" loading="lazy">`).join('')}</div>
    </a>`).join('');

  /* ---------- COLOURS ---------- */
  const colors = [
    ['rdeca','Rdeča','#d51f2e'],['oranzna','Oranžna','#f39a1d'],['rumena','Rumena','#f7dc2c'],
    ['modra','Modra','#0b5da8'],['rjava','Rjava','#b5875a'],['crna','Črna','#2b2f31'],
    ['vijolicna','Vijolična','#7a1ea1'],['bela','Bela','#dfe3ea'],['zelena','Zelena','#00b092']
  ];
  const cStage = document.getElementById('colorStage'), sws = document.getElementById('swatches'), swName = document.getElementById('swName'), glow = document.getElementById('colorGlow');
  colors.forEach(([k,label,hex],i)=>{
    const img = new Image(); img.src = k==='rdeca' ? 'assets/products/velika-kapela.png' : `assets/colors/${k}.png`; img.alt = `Velika kapela, ${label.toLowerCase()}`; img.loading = 'lazy'; img.dataset.k = k;
    cStage.appendChild(img);
    const b = document.createElement('button'); b.className = 'sw'; b.style.background = hex; b.setAttribute('role','radio'); b.setAttribute('aria-label',label); b.dataset.i = i;
    sws.appendChild(b);
  });
  let ci = -1, auto;
  function setColor(i){
    if (i===ci) return; ci = i;
    cStage.querySelectorAll('img').forEach((im,j)=>im.classList.toggle('on', j===i));
    sws.querySelectorAll('.sw').forEach((b,j)=>{ b.classList.toggle('on', j===i); b.setAttribute('aria-checked', j===i); });
    swName.innerHTML = `${colors[i][1]}<small>Velika kapela · 196 mm</small>`;
    glow.style.background = colors[i][2];
  }
  setColor(0);
  sws.addEventListener('click', e => { const b = e.target.closest('.sw'); if (!b) return; clearInterval(auto); setColor(+b.dataset.i); });
  if (!reduced) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      clearInterval(auto);
      if (e.isIntersecting) auto = setInterval(()=>setColor((ci+1)%colors.length), 1800);
    }), {threshold:.4});
    io.observe(cStage);
  }

  /* ---------- COUNTRIES ---------- */
  const countries = ['Slovenija','Avstrija','Nemčija','Poljska','Madžarska','Portugalska','Španija','Češka','Slovaška','Grčija','Finska','Hrvaška','Bosna in Hercegovina'];
  const cEl = document.getElementById('countries');
  cEl.innerHTML = countries.map((c,i)=>`<span class="${i===0?'home':''}">${c}${i<countries.length-1?',':'.'}</span>`).join(' ');

  /* ---------- INIT (needs images sized) ---------- */
  function start(){
    if (!window.gsap || reduced) {
      cEl.querySelectorAll('span').forEach(s=>s.classList.add('lit'));
      ghosts.forEach(g=>g.style.display='none');
      sizeTrack();
      return;
    }
    heroTimeline();
    scaleTimeline();
    const spans = [...cEl.querySelectorAll('span:not(.home)')];
    ScrollTrigger.create({trigger:cEl, start:'top 75%', end:'bottom 55%', scrub:true, onUpdate:self=>{
      const lit = Math.round(self.progress*spans.length);
      spans.forEach((s,i)=>s.classList.toggle('lit', i<lit));
    }});
    document.querySelectorAll('[data-count]').forEach(el=>{
      const to = +el.dataset.count, from = el.hasAttribute('data-plain') ? 1900 : 0, o = {v:from};
      el.textContent = from===0 ? '0' : from;
      ScrollTrigger.create({trigger:el, start:'top 88%', once:true, onEnter:()=>gsap.to(o,{v:to, duration:1.6, ease:'expo.out', onUpdate:()=>{
        const v = Math.round(o.v); el.textContent = el.hasAttribute('data-plain') ? v : v.toLocaleString('sl-SI');
      }})});
    });
    ScrollTrigger.refresh();
  }
  const imgs = [candle, ...ghosts];
  Promise.all(imgs.map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; }))).then(()=>{
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(start);
  });
  let rt; addEventListener('resize', ()=>{ clearTimeout(rt); rt = setTimeout(()=>window.ScrollTrigger && ScrollTrigger.refresh(), 200); });
})();
