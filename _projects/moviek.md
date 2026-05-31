---
layout: project
title: Moviek
repo: https://github.com/emrekayik/moviek
date: 2026-01-26
last_modified_at: 2026-06-01
---

Film öneri sistemi - bir film seçin, size benzer filmler önerelim!

**Moviek**, kullanıcıların seçtiği bir filme dayalı olarak benzer filmler öneren akıllı bir film öneri sistemidir. **LightFM** ve **Streamlit** kullanılarak geliştirilmiş olup, geniş kapsamlı **MovieLens 25M** veri setinden yararlanır.

### Öne Çıkan Özellikler

*   **Film Bazlı Öneriler:** 
    *   **Hibrit Algoritma:** En iyi sonuçlar için yapay zeka gömmeleri (embeddings) ve tür benzerliğini birleştirir.
    *   **Yapay Zeka Gömmeleri:** LightFM modeli tarafından öğrenilen gizli özellikleri (latent features) kullanır.
    *   **Tür Benzerliği:** Film türlerinin Jaccard benzerliğine dayalı öneriler sunar.
*   **Akıllı Arama:** Başlığa göre hızlı film araması yapmanızı sağlar.
*   **Etkileşimli Arayüz:** Streamlit ile oluşturulmuş, benzerlik skorları ve görsel göstergeler içeren kullanıcı dostu bir arayüz.
*   **Teknik Detaylar:**
    *   **WARP Kaybı (Loss):** Sıralama performansı için optimize edilmiştir.
    *   **Akıllı Önbellekleme:** Gereksiz model eğitimlerini önler.
    *   **Docker Desteği:** Geliştirme için sıcak yeniden yükleme (hot-reload) yetenekleri içerir.

### Kullanılan Teknolojiler

*   **Dil:** Python 3.10
*   **Öneri Motoru:** LightFM
*   **Web Çerçevesi:** Streamlit
*   **Konteynerleştirme:** Docker & Docker Compose
*   **Paket Yönetimi:** uv
*   **Veri Seti:** MovieLens 25M (25 milyon derecelendirme, 62.000 film)

### Yol Haritası

- [ ] Model değerlendirme metrikleri.
- [ ] Film afişleri için TMDb API entegrasyonu.
- [ ] Önerileri CSV olarak dışa aktarma.
- [ ] REST API uç noktası.
- [ ] Kullanıcı bazlı kişiselleştirilmiş öneriler.
