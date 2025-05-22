// Tema ayarları
document.addEventListener('DOMContentLoaded', function () {
  // Tema değiştiren radyo butonlarını seçin
  const themeControllers = document.querySelectorAll('.theme-controller');

  // Her bir radyo butonu için olay dinleyici ekleyin
  themeControllers.forEach(controller => {
    controller.addEventListener('change', function () {
      // Seçilen radyo butonunun değerini alın
      const selectedTheme = this.value;

      // html etiketini seçin
      const htmlElement = document.documentElement;

      // html etiketinin data-theme özelliğini güncelleyin
      htmlElement.setAttribute('data-theme', selectedTheme);

      // İsteğe bağlı olarak: Kullanıcının seçimini yerel depolamada saklayabilirsiniz
      localStorage.setItem('selected-theme', selectedTheme);
    });
  });

  // İsteğe bağlı olarak: Sayfa yüklendiğinde daha önce kaydedilmiş bir tema varsa onu uygulayın
  const savedTheme = localStorage.getItem('selected-theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    // İlgili radyo butonunu işaretleyebilirsiniz
    const savedThemeRadio = document.querySelector(`.theme-controller[value="${savedTheme}"]`);
    if (savedThemeRadio) {
      savedThemeRadio.checked = true;
    }
  }
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