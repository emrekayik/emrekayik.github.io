---
layout: post
title: JavaScript’te Zaman Kazanmak İçin 20 Kısaltma

sources:
  - title: "20 JavaScript shorthand to save time"
    url: "https://blogemma.netlify.app/javascript/20-javascript-shortands-tosave-time"
  - title: "javaScript Template Literal"
    url: "https://www.webcebir.com/227-javascript-template-literal-dersi.html" 
  - title: "Bitwise NOT (~) - JavaScript | MDN"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_NOT"

---

JavaScript’te en sık kullanılan kod bloklarından bazılarının kısaltmaları vardır. Bu kısaltmalar, kodlarınızı daha hızlı ve okunabilir hale getirmenize yardımcı olur ve zaman kazandırır.

> Zaman kazandıracağına ve daha temiz kod yazmaya da yardımcı olacağına inanıyorum.

## Değişken Atama(Declaring variables)

Tek satırda birden fazla değişkeni tanımlayabiliyoruz.

```js
// Uzun versiyon
let a; 
let b = 1; 

// Kısayolu
let a, b = 1;
/*
a -> undefined(tanımsız)
b -> 1
*/
```

## Birden Çok Değişkene Değer Atama(Assigning values to multiple variables)

Javascriptte birden çok değişkene tek satırda atama yapabiliyoruz.

> Bir üstteki başlıktan farkı; Üstte a değişkeni “undefined” bir tipte, b değişkeni ie 1 değerini alıyor. Eğer a’ya da değer atamak istiyorsak bunu uygulayacağız.

```js
// Uzun versiyon
x = 1; 
y = 2; 
z = 3; 

// Kısayolu
let [x, y, z] = [1, 2, 3];
/* 
x -> 1
y -> 2
z -> 3
*/
```

## Varsayılan Değer Atama(Assigning default value)

|| (VEYA) operatörü ile varsayılan değerleri ayarlayabilirsiniz . Sol taraftaki değer yanlışsa, sağdaki değeri kullanacaktır.
```js
// Uzun versiyon
let finalName; 
let name = getName(); 
if(name !== null && name !== undefined && name !== '') {
    finalName = name; 
} else {
    finalName = 'Emre'
}
```

## Üçlü Operator(The ternary operator)

Üçlü (?:) operatörünü kullanarak if else deyimlerini bir satıra yazabilirsiniz.

```js
// Uzun versiyon
let points = 70; 
let result; 
if(marks >= 50){
    result = 'Geçti'; 
}else{
    result = 'Kaldı'; 
}

// Kısayol
let points = 70; 
let result = marks >= 50 ? 'Geçti' : 'Kaldı';
```

## Şablon Değişmezleri(Template Literals)

*Literal* kullanılan değer anlamına gelir. *Literal,* değişkenler tarafından kullanılan bir değerdir. Değerler bir integer, float veya string olabilir.

Dizeleri birleştirmek için + işlecini kullanmak yerine, ES6 şablon değişmez değerlerini kullanabiliriz. Bunu tanımlarken *backtick(`)* kullanıyoruz.

```js
// Uzun versiyon
console.log('Merhaba ' + isim +', bugün günlerden ' + bugun);

// Kısayol
console.log(`Merhaba ${isim}, bugün günlerden ${bugun}`);
```

## İki Değişkeni Değiştirme(Swap two variables)

Dizi yok etme(array destructuring) ile iki değişkeni üçüncü bir değişken kullanmadan değiştirebilirsiniz.

```js
let x = 1, y = 2; 
// Uzun versiyon
const z= x; 
x = y; 
y = z; 

// Kısayol
[x, y] = [y, x];
```

## VE(&&) Kısa Operatörü Değerlendirmesi(AND Short circuit evaluation)

Bir değişken *true* ise bir işlevi yürütmek istiyorsanız *&&* operatörünü kullanabilirsiniz.

```js
// Uzun versiyon
if (isLoggedin) { 
    redirectToHomepage();
}

// Kısayol
isLoggedin && redirectToHomepage();
```

## Ok Fonksiyonu(Arrow function)

Ok işlevi sözdizimini kullanarak daha kısa fonksiyonlar yazabilirsiniz.

```js
// Uzun versiyon
function topla(a, b) {
    return a + b;
}

// Kısayol
const topla = (a, b) => a + b;
```

## Çok Satırlı Dize(Multi-line string)

Yeni bir satır atlama *(\n)* ile *+* işleci kullanmak yerine çok satırlı dize için. *backtick(`)* kullanabiliriz.

```js
// Uzun versiyon
console.log(
'Yaş otuz beş! yolun yarısı eder.\n' +
'Dante gibi ortasındayız ömrün.\n' +
'Delikanlı çağımızdaki cevher,\n' +
'Yalvarmak, yakarmak nafile bugün,\n' +
'Gözünün yaşına bakmadan gider.'
)

// Kısayol
console.log(`
Yaş otuz beş! yolun yarısı eder.
Dante gibi ortasındayız ömrün.
Delikanlı çağımızdaki cevher,
Yalvarmak, yakarmak nafile bugün,
Gözünün yaşına bakmadan gider.
`);
```

## Çoklu Durum Kontrolü(Multiple condition checking)

Birden fazla değeri kontrol ederken, bir dizideki tüm değerleri çekebilir ve *indexOf()* / *includes()* yöntemini kullanabiliriz.

```js
// Uzun versiyon
if (value === 1 || value === 'bir' || value === 2 || value === 'iki') {
    // Kod
}

// Kısayol 1
if ([1, 'bir', 2, 'iki'].indexOf(value) >= 0) {
// Kod
}
// Kısayol 2
if ([1, 'bir', 2, 'iki'].includes(value)) {
// Kod
}
```

## Metni Sayıya Dönüştürme(String into a number)

Dizeden önce bir *+* işleci yazarak bir dizeyi sayıya dönüştürebilirsiniz.

```js
// Uzun versiyon
let total = parseInt('45'); 
let average = parseFloat('421.6'); 

// Kısayol
let total = +'45'; 
let average = +'421.6'; 
```

## Nesne özelliği Atama(Object property Assignment)

Değişken adı ve nesne anahtarı adı *aynıysa*, hem anahtar hem de değer yerine nesne değişmez değerlerinde değişken adından bahsedebiliriz.

```js
let firstname = 'Emre'; 
let lastname = 'Kayık'; 
// Uzun versiyon
let obj = {firstname: firstname, lastname: lastname}; 

// Kısayol
let obj = {firstname, lastname}; 
```

## Dizideki Maksimum ve Minimum Sayıları Bulma(Find max and min numbe rin array)

Döngü yazmak yerine, *Array.reduce()*’nin *spread* operatörünü kullanabilirsiniz.

```js
// Kısayol
const arr = [2, 8, 15, 4]; 
Math.max(...arr); // 15
Math.min(...arr); // 2
```

## Üs Alma(Exponent Power)

*Math.pow()* yerine, bir sayının üst almasını bulmak için <em>**</em> operatörünü kullanabiliriz.

```js
// Uzun versiyon
const power = Math.pow(4, 3); // 64

// Kısayol
const power = 4**3; // 64
```

## Bitsel Ters Alma Operatörü(Double NOT bitwise operator)

*Math.floor()* yerine *~~* kullanabilirsiniz. Sadece 32-bit sayılar için çalışır, bu yüzden dikkatli kullanın.

```js
// Uzun versiyon
const floor = Math.floor(4.8); // 4

// Kısayol
const floor = ~~4.8; // 4
```

## Bir Diziyi Çok Kez Tekrarla(Repeat a string multiple time)

Bir dizgiyi tekrarlamak için bir for döngüsü yerine *repeat()* string yöntemini kullanabilirsiniz.


```js
// Uzun versiyon
let str = ''; 
for(let i = 0; i < 5; i ++) {
    str += 'Merhaba '; 
}
console.log(str); // Merhaba Merhaba Merhaba Merhaba Merhaba

// Kısayol
'Merhaba'.repeat(5); 
```

## For Döngüsü(For loop)

*for* döngüsü yerine `for of` veya `for in` kullanabiliriz.

```js
let arr = [1, 2, 3, 4]; 
// Uzun versiyon
for (let i = 0; 1 < arr.length; i++) {
    console.log(arr[i]); 
}
// Kısayol
//for of döngüsü
for (const val of arr) {
    console.log(val); 
}
// for in döngüsü
for (const index in arr) {
    console.log(arr[index]);
}
```

## Çok Nesneli Objeyi Kopyalama(Deep clong of multi-level object)

> Türkçeye çeviremedim(Çok Nesneli Objeyi Kopyalama?)

İşlevleri(fonksiyonları) değer olarak kullandığınızda çalışmaz, ancak aksi takdirde kullanmaktan çekinmeyin.

```js
let obj = {x: 20, y: {z: 30}}; 

// Uzun versiyon
const makeDeepClone = (obj) => {
    let newObject = {}; 
    Object.keys(obj).map(key => {
        if(typeof obj[key] === 'object'){
            newObject[key] = makeDeepClone(obj[key]); 
        } else {
            newObject[key] = obj[key]; 
        }
    }); 
    return newObject; 
}
const cloneObj = makeDeepClone(obj);

// Kısayol
const cloneObj = JSON.parse(JSON.stringify(obj)); 
```

## Dizeden Karakter Alma(Get character from string)

Bir diziden karakter almak için *[]* operatörünü kullanabilirsiniz.

```js
let str = 'merhabadunya'; 
// Uzun versiyon
str.charAt(1); // e

// Kısayol
str[1]; // e
```

## Dizileri birleştirme(Merging arrays)

*Array.concat()* kullanmak yerine dizileri birleştirmek için *rest* operatörünü kullanabiliriz.

```js
let arr1 = [2, 3]; 
//Long version
let arr2 = arr1.concat([4, 5]); 
// [2, 3, 4, 5]

// Shorthand
let arr2 = [...arr1, 4, 5]; 
// [2, 3, 4, 5]
```

> Bu blog bir çeviri yazısıdır lütfen kaynaklara göz gezdirmeyi unutmayın!
