(function(){
  "use strict";

  // === Config (único lugar para alterar o número) ===
  var WA_NUMBER = "5547997862275"; // (47) 99786-2275

  // === Toast ===
  var toastEl, toastMsg, tmr;
  function ensureToast(){
    toastEl = document.getElementById("toast");
    if(!toastEl){
      toastEl = document.createElement("div");
      toastEl.className = "toast"; toastEl.id = "toast";
      toastEl.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span id="toastMsg"></span>';
      document.body.appendChild(toastEl);
    }
    toastMsg = document.getElementById("toastMsg");
  }
  function showToast(msg){
    if(!toastEl) ensureToast();
    toastMsg.textContent = msg; toastEl.classList.add("show");
    clearTimeout(tmr); tmr = setTimeout(function(){ toastEl.classList.remove("show"); }, 2600);
  }

  // === WhatsApp ===
  function openWA(text){
    var url = "https://wa.me/" + WA_NUMBER + (text ? "?text=" + encodeURIComponent(text) : "");
    showToast("Abrindo o WhatsApp...");
    window.open(url, "_blank", "noopener");
  }
  document.querySelectorAll("[data-wa]").forEach(function(el){
    el.style.cursor = "pointer";
    el.addEventListener("click", function(e){ e.preventDefault(); openWA(el.getAttribute("data-wa")); });
  });

  // === Mobile nav ===
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if(toggle && links){
    function closeMenu(){ links.classList.remove("open"); toggle.classList.remove("open"); toggle.setAttribute("aria-expanded","false"); }
    toggle.addEventListener("click", function(){
      var open = links.classList.toggle("open");
      toggle.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    links.querySelectorAll("a").forEach(function(a){ a.addEventListener("click", closeMenu); });
  }

  // === Nav shadow on scroll ===
  var nav = document.getElementById("nav");
  if(nav){
    function onScroll(){ nav.classList.toggle("scrolled", window.scrollY > 12); }
    onScroll(); window.addEventListener("scroll", onScroll, {passive:true});
  }

  // === Scroll reveal (fallback se o GSAP não estiver disponível) ===
  // Quando o GSAP carrega, o anim.js assume os reveals e animações.
  if(!window.gsap){
    if("IntersectionObserver" in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); } });
      }, {threshold:.12, rootMargin:"0px 0px -40px 0px"});
      document.querySelectorAll(".reveal").forEach(function(el){ io.observe(el); });
    } else {
      document.querySelectorAll(".reveal").forEach(function(el){ el.classList.add("in"); });
    }
  }

  // === FAQ accordion ===
  document.querySelectorAll(".faq-item").forEach(function(item){
    var q = item.querySelector(".faq-q");
    var a = item.querySelector(".faq-a");
    if(!q || !a) return;
    q.addEventListener("click", function(){
      var open = item.classList.toggle("open");
      a.style.maxHeight = open ? a.scrollHeight + "px" : null;
      q.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  // === Form -> WhatsApp ===
  var form = document.getElementById("orcForm");
  if(form){
    form.addEventListener("submit", function(e){
      e.preventDefault();
      var required = ["nome","fone","servico"], ok = true;
      required.forEach(function(id){
        var field = document.getElementById(id); if(!field) return;
        var row = field.closest(".form-row");
        if(!field.value.trim()){ if(row) row.classList.add("err"); ok = false; }
        else if(row) row.classList.remove("err");
      });
      if(!ok){ showToast("Preencha os campos obrigatórios."); return; }

      function val(id){ var f = document.getElementById(id); return f ? f.value.trim() : ""; }
      var t = "*Solicitação de Orçamento — Site Moraes*\n\n";
      t += "👤 *Nome:* " + val("nome") + "\n";
      t += "📱 *Contato:* " + val("fone") + "\n";
      t += "🛠️ *Serviço:* " + val("servico") + "\n";
      if(val("cidade")) t += "📍 *Cidade da obra:* " + val("cidade") + "\n";
      if(val("msg"))    t += "📝 *Detalhes:* " + val("msg") + "\n";
      openWA(t);
    });
    form.querySelectorAll("input,select,textarea").forEach(function(f){
      f.addEventListener("input", function(){ var r = f.closest(".form-row"); if(r) r.classList.remove("err"); });
    });
  }

  // === Year ===
  var y = document.getElementById("year");
  if(y) y.textContent = new Date().getFullYear();
})();
