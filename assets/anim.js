(function(){
  "use strict";
  if(!window.gsap || !window.ScrollTrigger) return; // fallback: main.js cuida dos reveals via CSS

  var gsap = window.gsap;
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("gsap");

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if(reduce){
    gsap.set(".reveal", {opacity:1, y:0});
    return;
  }

  // ---- Reveal com stagger ao entrar na viewport ----
  gsap.set(".reveal", {opacity:0, y:30});
  ScrollTrigger.batch(".reveal", {
    start: "top 88%",
    once: true,
    onEnter: function(batch){
      gsap.to(batch, {opacity:1, y:0, duration:.8, ease:"power3.out", stagger:.09, overwrite:true});
    }
  });

  // ---- Entrada do HERO (home) em timeline — apenas o slide ativo ----
  if(document.querySelector(".hero-slide.active")){
    var a = ".hero-slide.active ";
    var tl = gsap.timeline({defaults:{ease:"power3.out", duration:.85}});
    tl.from(a + ".hero-badge", {y:22, opacity:0})
      .from(a + "h1",          {y:26, opacity:0}, "-=.55")
      .from(a + ".hero-p",     {y:20, opacity:0}, "-=.6")
      .from(a + ".hero-btns",  {y:18, opacity:0}, "-=.6")
      .from(a + ".hero-card",  {y:18, opacity:0, stagger:.1}, "-=.55")
      .from(".hero-stats",     {y:22, opacity:0}, "-=.5");
  }

  // ---- Entrada das páginas internas (page-hero) ----
  if(document.querySelector(".page-hero")){
    gsap.timeline({defaults:{ease:"power3.out", duration:.8}})
      .from(".page-hero .crumb", {y:14, opacity:0})
      .from(".page-hero h1",     {y:24, opacity:0}, "-=.5")
      .from(".page-hero p",      {y:18, opacity:0}, "-=.55");
  }

  // ---- Parallax suave nos brilhos do hero ----
  gsap.utils.toArray(".hero-glow").forEach(function(g, i){
    gsap.to(g, {
      yPercent: i % 2 ? 28 : -24,
      ease: "none",
      scrollTrigger: { trigger: g.closest("section"), start: "top top", end: "bottom top", scrub: true }
    });
  });

  // ---- Contadores animados nas estatísticas ----
  gsap.utils.toArray(".stat-num").forEach(function(el){
    var m = el.textContent.trim().match(/^(\d+)(.*)$/);
    if(!m) return;
    var end = parseInt(m[1], 10), suffix = m[2], obj = {v:0};
    el.textContent = "0" + suffix;
    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: function(){
        gsap.to(obj, {
          v: end, duration: 1.5, ease: "power2.out",
          onUpdate: function(){ el.textContent = Math.round(obj.v) + suffix; }
        });
      }
    });
  });

  // ---- Leve parallax/zoom nas imagens "mock" ao rolar ----
  gsap.utils.toArray(".sobre-img").forEach(function(img){
    gsap.fromTo(img, {scale:1.04}, {
      scale:1, ease:"none",
      scrollTrigger:{ trigger:img, start:"top bottom", end:"bottom top", scrub:true }
    });
  });

  // Recalcula posições depois que tudo (fontes/imagens) assenta
  window.addEventListener("load", function(){ ScrollTrigger.refresh(); });
})();
