document.addEventListener('DOMContentLoaded', () => {

    // Header'ın arkaplanını değiştiren kod (Değişiklik yok)
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Sayfa kaydırıldıkça içeriği görünür yapan animasyon kodu (Değişiklik yok)
    // Yeni eklenen .fade-in-section class'lı elemanlarda da çalışacaktır.
    const sections = document.querySelectorAll('.fade-in-section');

    const options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Eşik değerini biraz artırarak animasyonun daha erken başlamasını sağlayabiliriz
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    // YENİ: Scroll durduğunda tetiklenen ürün görseli animasyonları
    const productImages = document.querySelectorAll('.feature-image');
    let scrollTimeout;

    const imageOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Görselin %30'u görünür olduğunda hazır ol
    };

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Görsel görünür alanda, scroll durduğunda animasyon tetiklenecek
                entry.target.classList.add('in-viewport');
            } else {
                // Görsel ekrandan çıktığında sınıfları temizle
                entry.target.classList.remove('in-viewport', 'scroll-stopped-animated');
            }
        });
    }, imageOptions);

    // Scroll durduğunda animasyon tetikleme
    window.addEventListener('scroll', () => {
        // Önceki timeout'u temizle
        clearTimeout(scrollTimeout);
        
        // Scroll durduğunda çalışacak fonksiyon (100ms sonra)
        scrollTimeout = setTimeout(() => {
            // Görünür alandaki tüm görselleri animasyonla
            const visibleImages = document.querySelectorAll('.feature-image.in-viewport');
            visibleImages.forEach(image => {
                image.classList.add('scroll-stopped-animated');
                
                // 1 saniye sonra animasyonu kaldır (normale dön)
                setTimeout(() => {
                    image.classList.remove('scroll-stopped-animated');
                }, 1000);
            });
        }, 100); // 100ms scroll durması beklenir
    });

    // Tüm ürün görsellerini gözlemle
    productImages.forEach(image => {
        imageObserver.observe(image);
    });
});
