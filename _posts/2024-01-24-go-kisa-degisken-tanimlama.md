---
title: Go dilinde Kısa Değişken Tanımlama(:=) Avantajları-Dezavantajları
description: Go dilinde Kısa Değişken Tanımlama(:=) Avantajları-Dezavantajları
layout: post
reading_time: true
---

# Go'da Değişken Tanımlama

Go dilinde değişkenleri tanımlamanın birden çok yolu var. İlk olarak, değişken bildirmenin normal sözdizimini görelim.

```go
var degiskenAdi degisgenTipi
```

Bildiğiniz üzere `degiskenTipi` yazan yerde atadığımız değişkenin tipini belirliyoruz ve bu sayede değişkeni tanımlıyoruz.
Kısa tanımlamada buna ihtiyaç duymuyoruz. Örneğin:

```go
degiskenAdi := deger
```

"Short Variable Declaration" (Kısa Değişken Tanımlama) Go dilinde değişken tanımlamak için kullanılan bir yöntemdir. Bu yöntem, değişkenin türünün belirtilmesine gerek kalmadan, değişkenin değerine göre türün otomatik olarak belirlenmesine izin verir. Örneğin;

```go
sayi := 5
```

Bu kod, `sayi` değişkenini otomatik olarak `int` türüne atar.

> Kısa değişken tanımlama yöntemi, sadece yeni değişkenler için kullanılabilir. Önceden tanımlanmış bir değişken için bu yöntem kullanılamaz.

> Ayrıca, kısa değişken tanımlama yöntemi sadece fonksiyon içinde kullanılabilir. Global değişkenler için bu yöntem kullanılamaz.

## Avantajları:

- Kodun okunulabilirliğini arttırır.
- Yazım süresini kısaltır.
- Bir değişkene yanlış tip atamayı durdurur.
- Birden değişken tek satırda atanabilir.

## Dezavantajları

- Global değişken olarak kullanılamaz.
- Bir değişkene başka bir değer atanamaz.