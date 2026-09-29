---
layout: project
title: needle_tr
repo: https://github.com/emrekayik/needle_tr
date: 2026-09-28
---
\***\*Türkçe Araç Çağırıcı ve İnce Ayar Sistemi**(Turkish Tool Calling & Fine-Tuning System)\*\*

## Genel Bakış

`needle-tr`, Türkçe dilinde** \*\***tool calling** (araç çağırma) ve** \***\*function calling** (fonksiyon çağırma) yeteneklerine sahip yapay zeka modelleri geliştirmek,** \*\***synthetic dataset** (sentetik veri kümesi) üretmek, LoRA yöntemiyle** \*\* **fine-tuning** (modele ince ayar yapma) gerçekleştirmek ve modelleri Ollama üzerinde** \*\***deploy\*\* etmek (dağıtmak/yayınlamak) için tasarlanmış uçtan uca bir Python kütüphanesi ve CLI (komut satırı) aracıdır.

Proje,\*\* **[Cactus Compute](https://github.com/cactus-compute/needle) tarafından geliştirilen ve doğrudan yerel donanımda çalışan** \***\*on-device** (cihaz üstü) araç çağırma modeli** \*\***[Needle](https://github.com/cactus-compute/needle)\*\* (`cactus-needle`) altyapısını temel alarak Türkçe dil desteği, veri üretim bantları ve eğitim araçlarıyla genişletilmiştir.

## Öne Çıkan Özellik

- **Yerleşik Türkçe Araçlar (`Built-in Tools`):** Hava durumu sorgulama, mesaj gönderme, alarm kurma ve matematiksel işlem şablon fonksiyonları.
- **Sentetik Veri Üretici (`Synthetic Dataset Generator`):** **Seed** (tohum / başlangıç) veriler ve yerel Ollama modelleri (`qwen2.5:7b` vb.) desteğiyle Türkçe veri seti çoğaltma (`data/train.jsonl`,\*\* \*\*`data/val.jsonl`).
- **LoRA İnce Ayar Desteği (`LoRA Fine-Tuning`):** Hugging Face\*\* **`transformers`,** **`peft` ve** \*\*`trl` kütüphaneleriyle açık ağırlıklı modelleri Türkçe araç şemasına uyarlama.
- **Ollama Dağıtımı (`Ollama Deployment`):** Eğitilen modeller için optimize edilmiş\*\* \*\*`Modelfile` şablonunu otomatik üretme.
- **Cihaz Üstü Ajan (`On-Device Agent`):** `cactus-needle` ile buluta bağımlı olmadan hızlı ve yerel\*\* \*\* **inference** (model çıkarımı / tahmin yürütme).
- **Otomatik Başarım Testi (`Benchmark Suite`):** Araç seçim doğruluğu (`tool accuracy`), parametre eşleşmesi (`argument match`) ve** \*\***latency\*\* (yanıt gecikme süresi) ölçen, vektörel SVG grafik üreten yerleşik test aracı.
- **Sürüm Yönetimi (`Release Management`):** Tek komutla sürüm artırma (`version bump`), Git etiketi (`tag`) ve GitHub Actions üzerinden PyPI'ye otomatik** \*\***release\*\* (sürüm yayınlama).

## Kurulum

Standart hafif kurulum (yalnızca yerel ajan ve CLI, ~20 MB):

```bash
pip install needle-tr
```

**Fine-tuning** (ince ayar) ve **Hugging Face** eğitim kütüphaneleriyle birlikte kurulum:

```bash
pip install "needle-tr[train]"
```

Geliştirici ortamı için [uv](https://github.com/astral-sh/uv) ile senkronize edin:

```bash
git clone https://github.com/emrekayik/needle-tr.git
cd needle-tr
uv sync --extra train
```

---

## 🛠️ CLI (Komut Satırı) Kullanımı

Tüm işlemler `needle-tr` komut arayüzü ile yönetilebilir:

### 1. Sentetik Veri Üretimi (`Dataset Generation`)

```bash
# Yerel tohum verileri kullanarak temel veri seti üret
uv run needle-tr generate-data

# Yerel Ollama modeli kullanarak verileri çeşitlendir ve çoğalt
uv run needle-tr generate-data --use-ollama --ollama-model qwen2.5:7b
```

### 2. İnce Ayar Eğitimi & Hugging Face Dağıtımı (`Fine-Tuning & Hub Push`)

```bash
# Dry-run (eğitimi başlatmadan veri setini ve GPU ayarlarını ön doğrulama)
uv run needle-tr train --dry-run

# LoRA eğitimini başlat
uv run needle-tr train --base-model Qwen/Qwen2.5-7B-Instruct --epochs 3

# Modeli eğitip otomatik olarak Hugging Face Hub'a yükle
uv run needle-tr train --base-model Qwen/Qwen2.5-7B-Instruct --push-to-hub --hub-model-id kullanici_adi/needle-tr-lora

# Eğitilmiş modeli veya veri setini dilediğiniz zaman Hugging Face'e aktarın
uv run needle-tr push-hub kullanici_adi/needle-tr-lora --model-dir models/needle_lora
uv run needle-tr push-hub kullanici_adi/needle-tr-dataset --dataset
```

### 3. Ollama Ortamına Aktarım (`Ollama Export`)

```bash
# Modelfile dosyasını oluştur
uv run needle-tr export-ollama --base-model qwen2.5:7b --model-name needle-tr

# Ollama üzerinde modeli derle ve çalıştır
ollama create needle-tr -f Modelfile
ollama run needle-tr "25 * 4 hesapla"
```

### 4. Başarım ve Hız Testi (`Benchmark`)

```bash
# Cihaz üstü (on-device) Cactus Needle ajanını test et ve grafiği güncelle
uv run needle-tr benchmark --suite

# Ollama modelini test et
uv run needle-tr benchmark --target ollama --ollama-model needle-tr
```

### 5. Sürüm Yayınlama (`Release & Publish`)

```bash
# Tek komutla sürüm artırma, git etiketleme, paket derleme ve PyPI yayını:
./release.sh          # Patch artırma (örn: 0.1.5 -> 0.1.6)
./release.sh minor    # Minor artırma (örn: 0.1.5 -> 0.2.0)

# Veya Python CLI üzerinden:
uv run needle-tr release patch --push
```

---

## 🐍 Python Ajanı Kullanımı (`On-Device Inference`)

Python kodunuz içerisinden yerel **tool calling** (araç çağırma) ajanını çalıştırma:

```python
from needle_tr import agent

# Türkçe hava durumu sorgusu
cevap = agent.run("İstanbul'da hava durumu nasıl?")
print("Hava Durumu:", cevap["results"])

# Matematiksel hesaplama sorgusu
hesap = agent.run("25 * 4 hesapla")
print("Hesaplama Sonucu:", hesap["results"])
```

Hazır terminal ajanıyla denemek için:

```bash
uv run needle-agent
```

---

<!-- BENCHMARK_TR_START -->

## 📊 Benchmark (Başarım Testi) Sonuçları

`needle-tr benchmark` aracıyla otomatik üretilen son performans raporu:

![Needle-TR Benchmark Sonuçları](https://raw.githubusercontent.com/emrekayik/needle-tr/main/benchmark_results.svg)

| Metrik                               | Değer                              | Açıklama                                     |
| :----------------------------------- | :---------------------------------- | :--------------------------------------------- |
| **Test Edilen Hedef**          | `Cactus Needle (On-Device Agent)` | Test edilen ortam / ajan modeli                |
| **Toplam Test Sorgusu**        | **210**                       | Değerlendirilen Türkçe komut sayısı       |
| **Araç Seçim Doğruluğu**   | **%81.4** (171/210)           | Doğru fonksiyonu seçme başarısı           |
| **Argüman Doğruluğu**       | **%62.4** (131/210)           | Parametreleri eksiksiz ayrıştırma oranı    |
| **Geçerli Yanıt Oranı**     | **%100.0** (210/210)          | Hatasız parse edilen yapısal çıktı oranı |
| **Ortalama Gecikme (Latency)** | **224.2 ms**                  | İstek başına ortalama yanıt süresi        |
| **Son Güncelleme**            | `2026-09-28 21:11:53`             | Testin çalıştırıldığı zaman            |

| Araç (`Tool`) | Araç Doğruluğu | Argüman Eşleşmesi | Test Sayısı | Ortalama Gecikme |
| :--------------- | :---------------: | :------------------: | :-----------: | :--------------: |
| `calculate`    |       %98.2       |        %63.6        |      55      |     194.7 ms     |
| `get_weather`  |       %81.8       |        %69.1        |      55      |     228.2 ms     |
| `send_message` |       %46.0       |        %30.0        |      50      |     287.1 ms     |
| `set_alarm`    |       %98.0       |        %86.0        |      50      |     189.3 ms     |

<!-- BENCHMARK_TR_END -->

---

## 📚 Detaylı Rehber

Model eğitimi mimarisi, veri formatları ve hiperparametreler için [FINETUNE_GUIDE.md](FINETUNE_GUIDE.md) dokümanını inceleyebilirsiniz.

---

## 🙏 Referanslar & Teşekkürler

- **[Cactus Compute - Needle](https://github.com/cactus-compute/needle):** Cihaz üzerinde (**on-device**) çalışan hafif ve verimli fonksiyon / araç çağırma (**tool calling**) temel kütüphanesi (`cactus-needle`).
