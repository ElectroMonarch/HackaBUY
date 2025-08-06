# YapBoz Kodlama Platformu

YapBoz, 9-12 yaş çocuklara programlama konseptlerini öğretmek amacıyla geliştirilmiş **yapay zeka destekli** bir blok kodlama aracıdır. Kod blokları eş zamanlı olarak Python'a çevirilir ve istenildiği zaman çalıştırılabilir.

## Özellikler

* **Yapay zeka desteği:** Kullanıcılar, istedikleri program bloklarını yapay zeka ile oluşturabilirler. (Yapay zeka desteğinin çalışması için credentials.json dosyası gereklidir. Bu dosyanın public bir repo içerisinde bulunması güvenlik açıkları oluşturacağından, iletişim halinde paylaşılması uygun görülmüştür.)
* **Eğitici örnekler ve dökümantasyon:** Blok kodlamayı öğrenmek için dökümantasyonu takip edebilir ve eğitici örneklere göz atabilirsiniz.
* **Kullanım kolaylığı:** Blokların kullanımını kolaylaştırmak için bloklar kategorilere ayrılmıştır ve çalışma alanı esnek bir şekilde hareket ettirilebilmektedir.

## Teknolojiler

* **Frontend:** HTML, CSS, Webpack, Blockly
* **Backend:** Node.js, Webpack, Blockly
* **Yapay Zeka** Gemini
* **Paket Yöneticisi:** npm

## Kurulum

1.  Projeyi klonlayın:
    ```bash
    git clone ElektroMonarch/HackaBUY
    ```

2.  Proje dizinine gidin:
    ```bash
    cd HackaBUY
    ```

3.  Gerekli bağımlılıkları yükleyin:
    ```bash
    npm install
    ```

## Çalıştırma

Frontend: 
```bash
npm run start
```

Backend server: 
```bash
node src/server.js
```

İki ayrı konsol ekranında bu komutlar çalıştırıldığında uygulama çalışmaktadır.

## Lisans

Bu proje [Unlicense](LICENSE) ile lisanslanmıştır.




