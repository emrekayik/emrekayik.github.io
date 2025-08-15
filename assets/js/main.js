// Sayfa tamamen yüklendiğinde Observer'ın başladığından emin olmak için
document.addEventListener('DOMContentLoaded', (event) => {
    // Bu script, global window nesnesine "Observer" adında bir nesne ekler.
    // Biz de o nesnenin .start() metodunu çağırırız.
    if (window.Observer) {
        window.Observer.start();
    }
});

// Tema ayarları
document.addEventListener('DOMContentLoaded', function () {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    function resolveSystemTheme() {
        return media.matches ? 'dark' : 'light';
    }

    function applyTheme(theme) {
        const htmlElement = document.documentElement;
        if (!theme || theme === 'system') {
            htmlElement.setAttribute('data-theme', resolveSystemTheme());
        } else {
            htmlElement.setAttribute('data-theme', theme);
        }
    }

    function setChecked(theme) {
        const radios = document.querySelectorAll('.theme-controller');
        radios.forEach(r => r.checked = (r.value === theme));
    }

    const themeControllers = document.querySelectorAll('.theme-controller');
    themeControllers.forEach(controller => {
        controller.addEventListener('change', function () {
            const selectedTheme = this.value;
            localStorage.setItem('selected-theme', selectedTheme);
            applyTheme(selectedTheme);
            setChecked(selectedTheme);
        });
    });

    let savedTheme = localStorage.getItem('selected-theme') || 'system';
    // Fallback: eğer geçersiz bir tema seçildiyse 'system' kullan
    const allowedThemes = new Set(['system','light','dark','cupcake','bumblebee','emerald','corporate','synthwave','retro','cyberpunk','valentine','halloween','garden','forest','aqua','lofi','pastel','mytheme']);
    if (!allowedThemes.has(savedTheme)) {
        savedTheme = 'system';
        localStorage.setItem('selected-theme', savedTheme);
    }
    applyTheme(savedTheme);
    setChecked(savedTheme);

    // Sistem teması değiştiğinde otomatik güncelle
    media.addEventListener('change', () => {
        if ((localStorage.getItem('selected-theme') || 'system') === 'system') {
            applyTheme('system');
        }
    });
});

// Sayfa yüklendiğinde görünür yap
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("content").classList.add('loaded');
});

// Tüm bağlantılara tıklanınca efekt uygula
document.querySelectorAll('a[href]').forEach(link => {
    link.addEventListener('click', function (e) {
        // Harici linkleri geç
        if (this.hostname !== window.location.hostname) return;

        // Yeni sekme ya da anchor değilse
        if (!this.getAttribute('target') && !this.href.includes('#')) {
            e.preventDefault();
            document.body.classList.remove('loaded');
            document.body.classList.add('transition-fade');

            setTimeout(() => {
                window.location.href = this.href;
            }, 300); // CSS süresinden biraz kısa olmalı
        }
    });
});


// gsap
const card = document.querySelector(".glow-card");

document.addEventListener("mousemove", (e) => {
    gsap.to(card, {
        x: (e.clientX - window.innerWidth / 2) * 0.05,
        y: (e.clientY - window.innerHeight / 2) * 0.05,
        duration: 0.5,
        ease: "power2.out"
    });
});

// Global DaisyUI toast helper
(function(){
  function ensureToastContainer(){
    let container = document.getElementById('global-toast-stack');
    if(!container){
      container = document.createElement('div');
      container.id = 'global-toast-stack';
      container.className = 'toast toast-top toast-end z-[1000]';
      document.body.appendChild(container);
    }
    return container;
  }
  function buildAlert(type, message){
    const alert = document.createElement('div');
    const typeClass = type === 'success' ? 'alert-success' : (type === 'error' ? 'alert-error' : (type === 'warning' ? 'alert-warning' : 'alert-info'));
    alert.className = 'alert ' + typeClass + ' shadow';
    alert.setAttribute('role','status');
    alert.innerHTML = '<span>' + message + '</span>';
    return alert;
  }
  window.showToast = function(message, type='info', timeout=3000){
    try{
      const container = ensureToastContainer();
      const alert = buildAlert(type, message);
      container.appendChild(alert);
      // auto-remove after timeout
      window.setTimeout(() => {
        if(alert && alert.parentNode){
          alert.classList.add('opacity-0');
          alert.style.transition = 'opacity 200ms ease';
          window.setTimeout(() => {
            alert.parentNode && alert.parentNode.removeChild(alert);
          }, 220);
        }
      }, Math.max(800, timeout|0));
    }catch(e){
      // Fallback: console + alert
      console.debug('Toast fallback:', e);
      try{ alert(message); }catch(_){ /* no-op */ }
    }
  }
})();
