// Admin Panel JavaScript

class AdminPanel {
    constructor() {
        this.adminPassword = 'portre2024'; // Şifreyi değiştirebilirsiniz
        this.isLoggedIn = false;
        this.currentPoll = null;
        this.optionCounter = 0;
        this.init();
    }

    init() {
        this.checkLoginStatus();
        this.setupEventListeners();
        this.loadCurrentPoll();
    }

    // Login durumunu kontrol et
    checkLoginStatus() {
        const loginStatus = sessionStorage.getItem('adminLoggedIn');
        if (loginStatus === 'true') {
            this.isLoggedIn = true;
            this.showAdminContent();
        }
    }

    // Event listener'ları kur
    setupEventListeners() {
        // Login form
        document.getElementById('admin-login').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.handleLogout();
        });

        // Seçenek ekle
        document.getElementById('add-option-btn').addEventListener('click', () => {
            this.addOption();
        });

        // Önizleme
        document.getElementById('preview-btn').addEventListener('click', () => {
            this.showPreview();
        });

        // Oylama oluştur
        document.getElementById('create-poll-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.createPoll();
        });

        // Sonuçları dışa aktar
        document.getElementById('export-results-btn').addEventListener('click', () => {
            this.exportResults();
        });

        // Oyları sıfırla
        document.getElementById('reset-votes-btn').addEventListener('click', () => {
            this.resetVotes();
        });

        // Oylamayı sonlandır
        document.getElementById('end-poll-btn').addEventListener('click', () => {
            this.endPoll();
        });

        // Oy geçmişini göster
        document.getElementById('show-vote-history-btn').addEventListener('click', () => {
            this.showVoteHistory();
        });

        // Güvenlik istatistiklerini göster
        document.getElementById('show-security-stats-btn').addEventListener('click', () => {
            this.showSecurityStats();
        });

        // Modal kapatma
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('close-modal') || 
                e.target.classList.contains('close-modal-btn')) {
                this.closeModal();
            }
        });
    }

    // Login işlemi
    handleLogin() {
        const password = document.getElementById('admin-password').value;
        const errorDiv = document.getElementById('login-error');

        if (password === this.adminPassword) {
            this.isLoggedIn = true;
            sessionStorage.setItem('adminLoggedIn', 'true');
            this.showAdminContent();
            errorDiv.style.display = 'none';
        } else {
            errorDiv.style.display = 'block';
            document.getElementById('admin-password').value = '';
        }
    }

    // Logout işlemi
    handleLogout() {
        this.isLoggedIn = false;
        sessionStorage.removeItem('adminLoggedIn');
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('admin-content').style.display = 'none';
        document.getElementById('admin-password').value = '';
    }

    // Admin içeriğini göster
    showAdminContent() {
        document.getElementById('login-form').style.display = 'none';
        document.getElementById('admin-content').style.display = 'block';
        this.loadCurrentPoll();
        this.setupDefaultOptions();
    }

    // Mevcut oylamayı yükle
    loadCurrentPoll() {
        if (!this.isLoggedIn) return;

        const pollData = localStorage.getItem('haftaninOylamasi');
        if (pollData) {
            this.currentPoll = JSON.parse(pollData);
            this.updateCurrentStatus();
            this.loadResults();
        }
    }

    // Mevcut durum bilgilerini güncelle
    updateCurrentStatus() {
        if (!this.currentPoll) return;

        const statusElement = document.getElementById('current-status');
        const startElement = document.getElementById('current-start');
        const endElement = document.getElementById('current-end');
        const votesElement = document.getElementById('current-votes');

        statusElement.textContent = this.currentPoll.aktif ? 'Aktif' : 'Pasif';
        statusElement.style.color = this.currentPoll.aktif ? '#4CAF50' : '#f44336';

        startElement.textContent = new Date(this.currentPoll.baslangicTarihi).toLocaleDateString('tr-TR');
        endElement.textContent = new Date(this.currentPoll.bitisTarihi).toLocaleDateString('tr-TR');
        votesElement.textContent = this.currentPoll.toplamOy || 0;
    }

    // Varsayılan seçenekleri kur
    setupDefaultOptions() {
        const container = document.getElementById('options-container');
        container.innerHTML = '';
        this.optionCounter = 0;

        // 5 varsayılan seçenek ekle
        const defaultOptions = [
            { name: 'Espresso', description: 'İtalyan usulü yoğun kahve', image: 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg' },
            { name: 'Cappuccino', description: 'Espresso, süt ve köpük', image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg' },
            { name: 'Latte', description: 'Yumuşak espresso ve bol süt', image: 'https://images.pexels.com/photos/3727250/pexels-photo-3727250.jpeg' },
            { name: 'Americano', description: 'Espresso ve sıcak su', image: 'https://images.pexels.com/photos/1195350/pexels-photo-1195350.jpeg' },
            { name: 'Mocha', description: 'Çikolatalı kahve', image: 'https://images.pexels.com/photos/982612/pexels-photo-982612.jpeg' }
        ];

        defaultOptions.forEach(option => {
            this.addOption(option);
        });
    }

    // Yeni seçenek ekle
    addOption(defaultData = null) {
        this.optionCounter++;
        const container = document.getElementById('options-container');
        
        const optionHTML = `
            <div class="option-item" data-option-id="${this.optionCounter}">
                <div class="option-header">
                    <span class="option-number">Seçenek ${this.optionCounter}</span>
                    <button type="button" class="remove-option" onclick="adminPanel.removeOption(${this.optionCounter})">
                        Kaldır
                    </button>
                </div>
                <div class="option-form">
                    <div class="form-group">
                        <label>Ürün Adı:</label>
                        <input type="text" name="option-name" value="${defaultData?.name || ''}" required>
                    </div>
                    <div class="form-group">
                        <label>Açıklama:</label>
                        <textarea name="option-description" rows="2" required>${defaultData?.description || ''}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Resim URL:</label>
                        <input type="url" name="option-image" value="${defaultData?.image || ''}" required>
                    </div>
                </div>
            </div>
        `;
        
        container.insertAdjacentHTML('beforeend', optionHTML);
    }

    // Seçenek kaldır
    removeOption(optionId) {
        const optionElement = document.querySelector(`[data-option-id="${optionId}"]`);
        if (optionElement) {
            optionElement.remove();
        }
    }

    // Önizleme göster
    showPreview() {
        const formData = this.getFormData();
        if (!formData) return;

        const previewContent = document.getElementById('preview-content');
        let previewHTML = `
            <h3>${formData.title}</h3>
            <p><strong>Süre:</strong> ${formData.duration} gün</p>
            <div style="margin-top: 2rem;">
        `;

        formData.options.forEach(option => {
            previewHTML += `
                <div class="preview-option">
                    <div class="preview-image" style="background-image: url('${option.image}')"></div>
                    <div class="preview-info">
                        <h4>${option.name}</h4>
                        <p>${option.description}</p>
                    </div>
                </div>
            `;
        });

        previewHTML += '</div>';
        previewContent.innerHTML = previewHTML;
        document.getElementById('preview-modal').style.display = 'flex';
    }

    // Modal kapat
    closeModal() {
        document.getElementById('preview-modal').style.display = 'none';
    }

    // Form verilerini al
    getFormData() {
        const title = document.getElementById('poll-title').value.trim();
        const duration = parseInt(document.getElementById('poll-duration').value);
        
        if (!title || !duration) {
            this.showMessage('Lütfen tüm alanları doldurun!', 'error');
            return null;
        }

        const options = [];
        const optionItems = document.querySelectorAll('.option-item');
        
        optionItems.forEach((item, index) => {
            const name = item.querySelector('[name="option-name"]').value.trim();
            const description = item.querySelector('[name="option-description"]').value.trim();
            const image = item.querySelector('[name="option-image"]').value.trim();
            
            if (name && description && image) {
                options.push({
                    id: index + 1,
                    isim: name,
                    aciklama: description,
                    resim: image,
                    oylar: 0
                });
            }
        });

        if (options.length < 2) {
            this.showMessage('En az 2 seçenek eklemelisiniz!', 'error');
            return null;
        }

        return { title, duration, options };
    }

    // Yeni oylama oluştur
    createPoll() {
        const formData = this.getFormData();
        if (!formData) return;

        const confirmMessage = `
            Yeni oylama oluşturulacak:
            - Başlık: ${formData.title}
            - Süre: ${formData.duration} gün
            - Seçenek sayısı: ${formData.options.length}
            
            Mevcut oylama verileri silinecek. Devam etmek istiyor musunuz?
        `;

        if (!confirm(confirmMessage)) return;

        const now = new Date();
        const endDate = new Date(now.getTime() + formData.duration * 24 * 60 * 60 * 1000);

        const newPoll = {
            baslik: formData.title,
            baslangicTarihi: now.toISOString(),
            bitisTarihi: endDate.toISOString(),
            aktif: true,
            secenekler: formData.options,
            toplamOy: 0
        };

        // Yeni oylamayı kaydet
        localStorage.setItem('haftaninOylamasi', JSON.stringify(newPoll));
        
        // Eski oy verme kayıtlarını temizle
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('oyKullanildi_')) {
                localStorage.removeItem(key);
            }
        });

        this.currentPoll = newPoll;
        this.updateCurrentStatus();
        this.loadResults();
        this.showMessage('Yeni oylama başarıyla oluşturuldu!', 'success');
    }

    // Sonuçları yükle
    loadResults() {
        if (!this.currentPoll) return;

        const container = document.getElementById('admin-results-container');
        container.innerHTML = '';

        const sortedOptions = [...this.currentPoll.secenekler]
            .sort((a, b) => b.oylar - a.oylar);

        sortedOptions.forEach((option, index) => {
            const percentage = this.currentPoll.toplamOy > 0 
                ? Math.round((option.oylar / this.currentPoll.toplamOy) * 100) 
                : 0;

            const resultHTML = `
                <div class="admin-result-item">
                    <div class="admin-result-image" style="background-image: url('${option.resim}')"></div>
                    <div class="admin-result-info">
                        <div class="admin-result-name">
                            ${index === 0 ? '🏆 ' : ''}${option.isim}
                        </div>
                        <div class="admin-result-stats">
                            <span class="admin-result-votes">${option.oylar} oy (%${percentage})</span>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += resultHTML;
        });

        if (sortedOptions.length === 0) {
            container.innerHTML = '<p style="text-align: center; color: #ccc;">Henüz sonuç yok</p>';
        }
    }

    // Sonuçları dışa aktar
    exportResults() {
        if (!this.currentPoll) return;

        const data = {
            oylama: {
                baslik: this.currentPoll.baslik,
                baslangic: this.currentPoll.baslangicTarihi,
                bitis: this.currentPoll.bitisTarihi,
                toplamOy: this.currentPoll.toplamOy
            },
            sonuclar: this.currentPoll.secenekler.map(option => ({
                isim: option.isim,
                oylar: option.oylar,
                yuzde: this.currentPoll.toplamOy > 0 
                    ? Math.round((option.oylar / this.currentPoll.toplamOy) * 100) 
                    : 0
            })).sort((a, b) => b.oylar - a.oylar)
        };

        const jsonString = JSON.stringify(data, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `oylama-sonuclari-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showMessage('Sonuçlar başarıyla dışa aktarıldı!', 'success');
    }

    // Oyları sıfırla
    resetVotes() {
        if (!this.currentPoll) return;

        const confirmMessage = 'Tüm oylar sıfırlanacak. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?';
        if (!confirm(confirmMessage)) return;

        this.currentPoll.secenekler.forEach(option => {
            option.oylar = 0;
        });
        this.currentPoll.toplamOy = 0;

        localStorage.setItem('haftaninOylamasi', JSON.stringify(this.currentPoll));
        
        // Oy verme kayıtlarını temizle
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
            if (key.startsWith('oyKullanildi_')) {
                localStorage.removeItem(key);
            }
        });

        this.updateCurrentStatus();
        this.loadResults();
        this.showMessage('Tüm oylar başarıyla sıfırlandı!', 'success');
    }

    // Oylamayı sonlandır
    endPoll() {
        if (!this.currentPoll) return;

        const confirmMessage = 'Oylama sonlandırılacak ve yeni oylar alınamayacak. Devam etmek istiyor musunuz?';
        if (!confirm(confirmMessage)) return;

        this.currentPoll.aktif = false;
        this.currentPoll.bitisTarihi = new Date().toISOString();

        localStorage.setItem('haftaninOylamasi', JSON.stringify(this.currentPoll));
        this.updateCurrentStatus();
        this.showMessage('Oylama başarıyla sonlandırıldı!', 'success');
    }

    // Mesaj göster
    showMessage(message, type) {
        // Eski mesajları temizle
        const existingMessages = document.querySelectorAll('.success-message, .error-message');
        existingMessages.forEach(msg => msg.remove());

        const messageDiv = document.createElement('div');
        messageDiv.className = type === 'success' ? 'success-message' : 'error-message';
        messageDiv.textContent = message;

        const container = document.querySelector('.admin-header');
        container.appendChild(messageDiv);

        // 5 saniye sonra mesajı kaldır
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Global admin panel instance
let adminPanel;

// Sayfa yüklendiğinde admin paneli başlat
document.addEventListener('DOMContentLoaded', () => {
    adminPanel = new AdminPanel();
});
