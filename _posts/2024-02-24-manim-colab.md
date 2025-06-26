---
layout: post
title: "Manim, Colab’da nasıl çalıştırılır?"
description: Manim, Colab’da nasıl çalıştırılır?

sources:
    - title: "ManimCE resmi web adresi"
    - url: "https://docs.manim.community/en/stable/index.html"
---

*Manim*, özellikle matematik ve fizik konularında animasyonlar üretmenize olanak sağlayan bir Python kütüphanesidir.

*Colab* ise google tarafından geliştirilen ve içerisinde kodlarımızı çalıştırmamıza olanak veren bir servistir.

Pekâlâ şimdi nasıl çalıştıracağımıza bakalım.

## 1. adım:

[Colab](https://colab.research.google.com/) adresine gidelim ve google hesabımıza giriş yapalım.

## 2. adım:

açılan panelde “yeni not defteri” açalım.

## 3. adım:

Açılan paneldeki kısma aşağıdaki kodları yapıştıralım ve kodu çalıştıralım.

```bash
!sudo apt update
!sudo apt install libcairo2-dev ffmpeg \
    texlive texlive-latex-extra texlive-fonts-extra \
    texlive-latex-recommended texlive-science \
    tipa libpango1.0-dev
!pip install manim
!pip install IPython --upgrade
```

## 4. adım:

Üst taraftaki menüden “çalışma zamanı” üzerine gelelim ve “çalışma zamanını yeniden başlat” seçeneğini seçelim ve açılan kısımda izinlere izin verelim.

## 5. adım:

Yeni kod bloğu ekleyelim ve açılan kısma aşağıdaki kodu yazıp çalıştıralım.

```python
from manim import *
```

## 6. adım:

Yeni bir kod bloğu oluşturalım ve alttaki kodu yazıp çalıştıralım.

```python
%%manim -qm -v WARNING SquareToCircle 

class SquareToCircle(Scene):
   def construct(self):
      square = Square()
      circle = Circle()
      circle.set_fill(PINK, opacity=0.5)
      self.play(Create(square))
      self.play(Transform(square, circle))
      self.wait()
```

kodu çalıştırdığınızda aşağıdaki çıktıyı elde etmiş olmalısınız.

![](https://miro.medium.com/v2/resize:fit:720/format:webp/1*v2t0szUrnzN0iQC_FUBKhw.gif)

Artık Manim animasyonlarınızı Colab içerisinde çalıştırabilirsiniz.

Daha fazla örnek ve Manim’i öğrenmek için web sitesine bakın.
