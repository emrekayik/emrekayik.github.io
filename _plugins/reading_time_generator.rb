# _plugins/reading_time_generator.rb

module ReadingTime
    # Jekyll Generator sınıfından miras alırız
    class Generator < Jekyll::Generator
      safe true # Pluginin güvenli modda çalışmasına izin ver
  
      # generate metodu, Jekyll build sürecinde çalışır
      def generate(site)
        # Yapılandırma (config.yml) dosyasından ayarları al, yoksa varsayılanları kullan
        site_config = site.config['reading_time'] || {}
        # Dakika başına kelime sayısı (Ortalama okuma hızı)
        words_per_minute = site_config['words_per_minute'] || 200
        # Her bir resim için eklenecek yaklaşık dakika sayısı
        minutes_per_image = site_config['minutes_per_image'] || 0.17 # Yaklaşık 10 saniye
  
        # Blog yazıları ve sayfalar üzerinde döngü yap
        # site.posts Jekyll 4+ için site.posts.docs olmalıdır. Daha eski versiyonlar için site.posts kullanılabilir.
        # Güvenli olmak adına hem posts.docs hem de pages'ı işleyelim.
        items_to_process = site.posts.docs + site.pages
  
        items_to_process.each do |item|
          # Layout kullanılmayan veya front matter'da reading_time: false olarak belirtilen sayfaları atla
          next if item.data['layout'].nil? || item.data['reading_time'] == false
  
          # --- Kelime Sayısını Hesaplama ---
          # HTML etiketlerini temizle
          # Basit bir regex ile etiketleri temizliyoruz. Daha karmaşık senaryolar Nokogiri gibi gem'ler gerektirebilir.
          text = item.content.gsub(/<\/?[^>]*>/, '')
          # HTML entity'lerini temizle (örneğin &nbsp;)
          text = text.gsub(/&[a-z]+;|&#\d+;/, ' ')
          # Noktalama işaretlerini boşlukla değiştir (kelime sayısını daha doğru yapmak için)
          text = text.gsub(/[^a-zA-Z0-9\s]/, ' ')
  
          # Metni kelimelere ayır ve say
          words = text.split(/\s+/).reject(&:empty?) # Birden fazla boşluğa ve boş kelimelere dikkat et
          word_count = words.length
  
          # --- Resim Sayısını Hesaplama ---
          # İçerikteki img etiketlerini bul (hem HTML hem Markdown'da olabilecek img tag'leri)
          # Markdown resimleri ![]() bu regex ile bulunmaz. Sadece img tag'leri sayılır.
          image_count = item.content.scan(/<\s*img[^>]*>/i).length
  
          # --- Okuma Süresini Hesaplama ---
          # Toplam kelime süresi
          total_word_minutes = word_count / words_per_minute.to_f # Float bölme için .to_f
          # Toplam resim süresi
          total_image_minutes = image_count * minutes_per_image
  
          # Toplam tahmini süre
          total_minutes = total_word_minutes + total_image_minutes
  
          # Süreyi en yakın üst tam dakikaya yuvarla (örn. 2.1 -> 3 dakika)
          estimated_time = total_minutes.ceil
  
          # Hesaplanan okuma süresini sayfa/yazı verilerine ekle
          # Bu bilgiye Liquid'de {{ page.reading_time }} veya {{ post.reading_time }} olarak erişilebilir
          item.data['reading_time'] = estimated_time
  
          # İsteğe bağlı: Konsola bilgi yazdır
          # puts "Hesaplanan okuma süresi için #{item.url}: #{estimated_time} dakika (#{word_count} kelime, #{image_count} resim)"
        end
      end
    end
  end