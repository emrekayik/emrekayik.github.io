---
layout: project
title: SihirEK
repo: https://github.com/emrekayik/sihirek-web
date: 2022-08-04
---

## SihirEK

> Aklınızdan tuttuğunuz sayıyı matematik sayesinde bulun.

React - React Native - Expo - Native Base, teknolojileri kullanarak hem web hem de mobil sürümünü geliştirdim.

Proje basit bir matematik işlemine dayanıyor. Bu matematik problemini [Nesin Köyleri Popüler Matematik Yazıları](https://nesinkoyleri.org/populer-matematik-yazilari/) web adresindeki
yazılardan keşfettim. Hâlâ bilgisayar evrenine aktarmaya değer yazılar olduğunu düşünüyorum. Göz atılabilir.

Fonksiyonun JavaScript dilinde yazımını aşağıdaki şekilde yapmıştım. Proje biraz eski TypeScript kullanmıyordum o zamanlar.

```js
// Sonucu hesaplama fonksiyonu :
function hesap(uc, bes, yedi) {
    // üçe bölümünden kalanı 70 ile ;
    // Beşe bölümünden kalanı 21 ile ;
    // Yediye bölümünden kalanı 15 ile çarpıyoruz :
    var sayi = 70 * uc + 21 * bes + 15 * yedi;
    //  105 üzerinden modunu alıyoruz :
    sayi %= 105;

    // Sayıyı return ediyoruz :
    return sayi;
}
```


[SihirEK Web Adresi](https://sihirek-web.vercel.app/)
