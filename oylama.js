// Oylama Sistemi JavaScript

class OylamaSistemi {
    constructor() {
        this.oylamaVerileri = null;
        this.seciliSecenek = null;
        this.oyKullanildi = false;
        this.init();
    }

    init() {
        this.oylamaVerileriniYukle();
        this.eventListenerEkle();
        this.oyDurumuKontrol();
        this.zamanSayacBaslat();
    }

    // LocalStorage'dan oylama verilerini yükle
    oylamaVerileriniYukle() {
        const kaydedilmisVeri = localStorage.getItem('haftaninOylamasi');
        if (kaydedilmisVeri) {
            this.oylamaVerileri = JSON.parse(kaydedilmisVeri);
        } else {
            // Varsayılan oylama verisi
            this.oylamaVerileri = {
                baslik: "Bu Haftanın En İyi Kahvesi",
                baslangicTarihi: new Date().toISOString(),
                bitisTarihi: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 gün sonra
                aktif: true,
                secenekler: [
                    {
                        id: 1,
                        isim: "Espresso",
                        aciklama: "İtalya'nın kalbi 1884'te Angelo Moriondo tarafından icat edilen bu yoğun kahve",
                        resim: "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg",
                        oylar: 0
                    },
                    {
                        id: 2,
                        isim: "Cappuccino",
                        aciklama: "Espresso, sıcak süt ve süt köpüğünün mükemmel uyumu",
                        resim: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg",
                        oylar: 0
                    },
                    {
                        id: 3,
                        isim: "Latte",
                        aciklama: "Yumuşak espresso ve bol miktarda buharda pişirilmiş süt",
                        resim: "https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg",
                        oylar: 0
                    },
                    {
                        id: 4,
                        isim: "Americano",
                        aciklama: "Espresso ve sıcak suyun klasik birleşimi",
                        resim: "https://images.pexels.com/photos/1195350/pexels-photo-1195350.jpeg",
                        oylar: 0
                    },
                    {
                        id: 5,
                        isim: "Mocha",
                        aciklama: "Espresso, çikolata ve süt köpüğünün lezzetli karışımı",
                        resim: "https://images.pexels.com/photos/982612/pexels-photo-982612.jpeg",
                        oylar: 0
                    }
                ],
                toplamOy: 0
            };
            this.oylamaVerileriniKaydet();
        }
        
        this.oylamaVerileriniGoster();
    }

    // Oylama verilerini localStorage'a kaydet
    oylamaVerileriniKaydet() {
        localStorage.setItem('haftaninOylamasi', JSON.stringify(this.oylamaVerileri));
    }

    // Oylama verilerini sayfada göster
    oylamaVerileriniGoster() {
        // Tarihleri göster
        const baslangic = new Date(this.oylamaVerileri.baslangicTarihi);
        const bitis = new Date(this.oylamaVerileri.bitisTarihi);
        
        document.getElementById('oylama-baslangic').textContent = 
            baslangic.toLocaleDateString('tr-TR');
        document.getElementById('oylama-bitis').textContent = 
            bitis.toLocaleDateString('tr-TR');

        // Seçenekleri göster
        const seceneklerContainer = document.getElementById('oylama-secenekleri');
        seceneklerContainer.innerHTML = '';

        this.oylamaVerileri.secenekler.forEach(secenek => {
            const kartHTML = `
                <div class="oylama-kart" data-id="${secenek.id}">
                    <div class="kart-resim" style="background-image: url('${secenek.resim}')">
                        <div class="kart-overlay">
                            <div class="kart-baslik">${secenek.isim}</div>
                            <div class="kart-aciklama">${secenek.aciklama}</div>
                        </div>
                    </div>
                    <div class="kart-bilgi">
                        <div class="kart-detay">Oy sayısı: <span class="oy-sayisi">${secenek.oylar}</span></div>
                    </div>
                </div>
            `;
            seceneklerContainer.innerHTML += kartHTML;
        });

        // Sonuçları göster (eğer oy kullanıldıysa)
        if (this.oyKullanildi) {
            this.sonuclariGoster();
        }
    }

    // Event listener'ları ekle
    eventListenerEkle() {
        // Kart seçimi
        document.addEventListener('click', (e) => {
            const kart = e.target.closest('.oylama-kart');
            if (kart && this.oylamaVerileri.aktif && !this.oyKullanildi) {
                this.secenekSec(parseInt(kart.dataset.id));
            }
        });

        // Oy verme butonu
        document.getElementById('oy-ver-btn').addEventListener('click', () => {
            if (this.seciliSecenek && !this.oyKullanildi) {
                this.oyVer();
            }
        });
    }

    // Seçenek seç
    secenekSec(id) {
        // Önceki seçimi temizle
        document.querySelectorAll('.oylama-kart').forEach(kart => {
            kart.classList.remove('secili');
        });

        // Yeni seçimi işaretle
        const secilenKart = document.querySelector(`[data-id="${id}"]`);
        secilenKart.classList.add('secili');

        this.seciliSecenek = id;
        this.oyVerButonunuGuncelle();
    }

    // Oy ver butonu durumunu güncelle
    oyVerButonunuGuncelle() {
        const btn = document.getElementById('oy-ver-btn');
        const btnText = btn.querySelector('.btn-text');

        if (this.oyKullanildi) {
            btn.disabled = true;
            btnText.textContent = 'Oy kullanıldı';
        } else if (!this.oylamaVerileri.aktif) {
            btn.disabled = true;
            btnText.textContent = 'Oylama sona erdi';
        } else if (this.seciliSecenek) {
            btn.disabled = false;
            btnText.textContent = 'Oy Ver';
        } else {
            btn.disabled = true;
            btnText.textContent = 'Bir seçenek seçin';
        }
    }

    // Oy ver
    oyVer() {
        if (!this.seciliSecenek || this.oyKullanildi || !this.oylamaVerileri.aktif) {
            return;
        }

        // Çoklu oy kontrolü
        if (this.oyKontrolEt()) {
            this.hataMesajiGoster('Bu hafta zaten oy kullandınız!');
            return;
        }

        // Loading göster
        const btn = document.getElementById('oy-ver-btn');
        const btnText = btn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        btnText.innerHTML = '<span class="loading"></span> Oy veriliyor...';
        btn.disabled = true;

        // Simüle edilmiş API çağrısı (1 saniye bekle)
        setTimeout(() => {
            // Oyu kaydet
            const secenek = this.oylamaVerileri.secenekler.find(s => s.id === this.seciliSecenek);
            secenek.oylar++;
            this.oylamaVerileri.toplamOy++;

            // Oy durumunu kaydet (çoklu yöntem)
            this.oyDurumuKaydet();
            this.oyKullanildi = true;

            // Verileri kaydet
            this.oylamaVerileriniKaydet();

            // UI'ı güncelle
            this.oylamaVerileriniGoster();
            this.tesekkurMesajiGoster();
            this.sonuclariGoster();
            this.oyVerButonunuGuncelle();

            btnText.textContent = 'Oy kullanıldı';
        }, 1000);
    }

    // Hafta ID'si oluştur (oylama başlangıç tarihine göre)
    getHaftaId() {
        return new Date(this.oylamaVerileri.baslangicTarihi).getTime();
    }

    // Çoklu oy kontrolü sistemi
    oyKontrolEt() {
        const haftaId = this.getHaftaId();
        
        // 1. LocalStorage kontrolü
        if (localStorage.getItem('oyKullanildi_' + haftaId)) {
            return true;
        }
        
        // 2. SessionStorage kontrolü (tarayıcı kapatılana kadar)
        if (sessionStorage.getItem('oyKullanildi_' + haftaId)) {
            return true;
        }
        
        // 3. Cookie kontrolü
        if (this.getCookie('oyKullanildi_' + haftaId)) {
            return true;
        }
        
        // 4. Browser fingerprint kontrolü (basit)
        const fingerprint = this.getBrowserFingerprint();
        if (localStorage.getItem('oyFingerprint_' + haftaId + '_' + fingerprint)) {
            return true;
        }
        
        // 5. Zaman bazlı kontrol (aynı gün içinde tekrar oy vermeyi engelle)
        const bugununOyu = localStorage.getItem('gunlukOy_' + this.getBugununTarihi());
        if (bugununOyu && bugununOyu === haftaId.toString()) {
            return true;
        }
        
        return false;
    }
    
    // Oy durumunu çoklu yöntemle kaydet
    oyDurumuKaydet() {
        const haftaId = this.getHaftaId();
        const fingerprint = this.getBrowserFingerprint();
        const bugun = this.getBugununTarihi();
        
        // 1. LocalStorage'a kaydet
        localStorage.setItem('oyKullanildi_' + haftaId, 'true');
        
        // 2. SessionStorage'a kaydet
        sessionStorage.setItem('oyKullanildi_' + haftaId, 'true');
        
        // 3. Cookie'ye kaydet (7 gün)
        this.setCookie('oyKullanildi_' + haftaId, 'true', 7);
        
        // 4. Browser fingerprint ile kaydet
        localStorage.setItem('oyFingerprint_' + haftaId + '_' + fingerprint, 'true');
        
        // 5. Günlük oy kaydı
        localStorage.setItem('gunlukOy_' + bugun, haftaId.toString());
        
        // 6. Oy geçmişi (istatistik için)
        this.oyGecmisineEkle(haftaId);
    }
    
    // Browser fingerprint oluştur (basit)
    getBrowserFingerprint() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('Browser fingerprint', 2, 2);
        
        const fingerprint = [
            navigator.userAgent,
            navigator.language,
            screen.width + 'x' + screen.height,
            new Date().getTimezoneOffset(),
            canvas.toDataURL()
        ].join('|');
        
        // Basit hash fonksiyonu
        let hash = 0;
        for (let i = 0; i < fingerprint.length; i++) {
            const char = fingerprint.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit integer'a çevir
        }
        return Math.abs(hash).toString();
    }
    
    // Bugünün tarihini al (YYYY-MM-DD formatında)
    getBugununTarihi() {
        return new Date().toISOString().split('T')[0];
    }
    
    // Cookie işlemleri
    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
    
    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    
    // Oy geçmişine ekle
    oyGecmisineEkle(haftaId) {
        let gecmis = JSON.parse(localStorage.getItem('oyGecmisi') || '[]');
        gecmis.push({
            haftaId: haftaId,
            tarih: new Date().toISOString(),
            secim: this.seciliSecenek
        });
        
        // Son 10 oyu sakla
        if (gecmis.length > 10) {
            gecmis = gecmis.slice(-10);
        }
        
        localStorage.setItem('oyGecmisi', JSON.stringify(gecmis));
    }

    // Oy durumu kontrol et
    oyDurumuKontrol() {
        if (this.oyKontrolEt()) {
            this.oyKullanildi = true;
            this.sonuclariGoster();
        }

        // Oylama süresi kontrol et
        const simdi = new Date();
        const bitis = new Date(this.oylamaVerileri.bitisTarihi);
        
        if (simdi > bitis) {
            this.oylamaVerileri.aktif = false;
            document.body.classList.add('oylama-kapali');
        }

        this.oyVerButonunuGuncelle();
        this.durumMesajiGuncelle();
    }

    // Durum mesajını güncelle
    durumMesajiGuncelle() {
        const durumText = document.getElementById('durum-text');
        
        if (!this.oylamaVerileri.aktif) {
            durumText.textContent = 'Oylama sona erdi';
            durumText.style.color = '#f44336';
        } else if (this.oyKullanildi) {
            durumText.textContent = 'Oyunuz alındı';
            durumText.style.color = '#4CAF50';
        } else {
            durumText.textContent = 'Oylama aktif';
            durumText.style.color = '#d4a373';
        }
    }

    // Zaman sayacını başlat
    zamanSayacBaslat() {
        const kalanSureElement = document.getElementById('kalan-sure');
        
        const sayacGuncelle = () => {
            const simdi = new Date();
            const bitis = new Date(this.oylamaVerileri.bitisTarihi);
            const fark = bitis - simdi;

            if (fark <= 0) {
                kalanSureElement.textContent = 'Süre doldu';
                this.oylamaVerileri.aktif = false;
                document.body.classList.add('oylama-kapali');
                this.oyVerButonunuGuncelle();
                this.durumMesajiGuncelle();
                return;
            }

            const gunler = Math.floor(fark / (1000 * 60 * 60 * 24));
            const saatler = Math.floor((fark % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const dakikalar = Math.floor((fark % (1000 * 60 * 60)) / (1000 * 60));

            let kalanSureText = '';
            if (gunler > 0) {
                kalanSureText = `${gunler} gün ${saatler} saat kaldı`;
            } else if (saatler > 0) {
                kalanSureText = `${saatler} saat ${dakikalar} dakika kaldı`;
            } else {
                kalanSureText = `${dakikalar} dakika kaldı`;
            }

            kalanSureElement.textContent = kalanSureText;
        };

        sayacGuncelle();
        setInterval(sayacGuncelle, 60000); // Her dakika güncelle
    }

    // Sonuçları göster
    sonuclariGoster() {
        const sonuclarSection = document.getElementById('sonuclar-section');
        const sonuclarContainer = document.getElementById('sonuclar-container');
        const toplamOySayisi = document.getElementById('toplam-oy-sayisi');

        sonuclarSection.style.display = 'block';
        toplamOySayisi.textContent = this.oylamaVerileri.toplamOy;

        // Seçenekleri oy sayısına göre sırala
        const siraliSecenekler = [...this.oylamaVerileri.secenekler]
            .sort((a, b) => b.oylar - a.oylar);

        sonuclarContainer.innerHTML = '';

        siraliSecenekler.forEach((secenek, index) => {
            const yuzde = this.oylamaVerileri.toplamOy > 0 
                ? Math.round((secenek.oylar / this.oylamaVerileri.toplamOy) * 100) 
                : 0;

            const sonucHTML = `
                <div class="sonuc-item">
                    <div class="sonuc-resim" style="background-image: url('${secenek.resim}')"></div>
                    <div class="sonuc-bilgi">
                        <div class="sonuc-isim">
                            ${index === 0 ? '🏆 ' : ''}${secenek.isim}
                        </div>
                        <div class="sonuc-bar-container">
                            <div class="sonuc-bar" style="width: ${yuzde}%"></div>
                        </div>
                        <div class="sonuc-yuzde">
                            <span>${secenek.oylar} oy</span>
                            <span>%${yuzde}</span>
                        </div>
                    </div>
                </div>
            `;
            sonuclarContainer.innerHTML += sonucHTML;
        });
    }

    // Teşekkür mesajını göster
    tesekkurMesajiGoster() {
        const mesaj = document.getElementById('tesekkur-mesaji');
        mesaj.style.display = 'block';
        
        // 5 saniye sonra gizle
        setTimeout(() => {
            mesaj.style.display = 'none';
        }, 5000);
    }

    // Hata mesajını göster
    hataMesajiGoster(mesajMetni) {
        const mesaj = document.getElementById('hata-mesaji');
        const mesajText = document.getElementById('hata-text');
        
        mesajText.textContent = mesajMetni;
        mesaj.style.display = 'block';
        
        // 5 saniye sonra gizle
        setTimeout(() => {
            mesaj.style.display = 'none';
        }, 5000);
    }
}

// Admin panel erişimi için URL parametresi kontrolü
function adminErisimKontrol() {
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    
    if (adminParam === 'portre2024') {
        if (confirm('Admin paneline gitmek istiyor musunuz?')) {
            window.location.href = 'admin-oylama.html';
        }
    }
}

// Gizli admin erişim butonu (Ctrl+Alt+A kombinasyonu)
let adminKombinasyon = [];
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        if (confirm('Admin paneline gitmek istiyor musunuz?')) {
            window.location.href = 'admin-oylama.html';
        }
    }
});

// Sayfa yüklendiğinde oylama sistemini başlat
document.addEventListener('DOMContentLoaded', () => {
    adminErisimKontrol(); // Admin erişim kontrolü
    new OylamaSistemi();
});
