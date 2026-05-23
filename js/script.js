// ==========================================
// 1. SELECTOR ELEMEN (PENGUMPULAN KOMPONEN)
// ==========================================
const navbarNav = document.querySelector('.navbar-nav');
const hamburger = document.querySelector('#hamburger-menu');

const searchForm = document.querySelector('.search-form');
const searchBtn = document.querySelector('#search');
const searchInput = document.querySelector('#search-input');

const shoppingCart = document.querySelector('.shopping-cart');
const cartBtn = document.querySelector('#shopping-cart-button');

const cartContainer = document.querySelector('.cart-items-container');
const totalPriceDisplay = document.querySelector('#total-price-display');

// Data internal penampung daftar belanjaan (Array of Object)
let cartData = [];


// ==========================================
// 2. KONTROL INTERAKSI TOMBOL (TOGGLE MENU)
// ==========================================

// Kontrol Hamburger Menu
hamburger.onclick = (e) => {
    navbarNav.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    e.preventDefault();
};

// Kontrol Search Form
searchBtn.onclick = (e) => {
    searchForm.classList.toggle('active');
    navbarNav.classList.remove('active');
    shoppingCart.classList.remove('active');
    if (searchForm.classList.contains('active')) {
        searchInput.focus(); 
    }
    e.preventDefault();
};

// Kontrol Shopping Cart Sidebar
cartBtn.onclick = (e) => {
    shoppingCart.classList.toggle('active');
    navbarNav.classList.remove('active');
    searchForm.classList.remove('active');
    e.preventDefault();
};


// ==========================================
// 3. LOGIKA UX (PENGAMAN & LINK NAVIGASI)
// ==========================================

// Klik di luar komponen untuk menutup otomatis sidebar/modal
document.addEventListener('click', function(e) {
    if (!hamburger.contains(e.target) && !navbarNav.contains(e.target)) {
        navbarNav.classList.remove('active');
    }
    
    if (!searchBtn.contains(e.target) && !searchForm.contains(e.target)) {
        searchForm.classList.remove('active');
    }

    if (!cartBtn.contains(e.target) && 
        !shoppingCart.contains(e.target) && 
        !e.target.closest('.add-to-cart-btn') && 
        !e.target.classList.contains('qty-btn') &&
        !e.target.closest('.remove-item')) {
        shoppingCart.classList.remove('active');
    }
});

// Otomatis menutup menu link navigasi saat diklik
document.querySelectorAll('.navbar-nav a').forEach(link => {
    link.addEventListener('click', () => {
        navbarNav.classList.remove('active');
    });
});


// ==========================================
// 4. LOGIKA INTEGRASI PENCARIAN & FOKUS PRODUK
// ==========================================

// A. Filter Produk Real-Time saat Mengetik
searchInput.addEventListener('input', function (e) {
    const keyword = e.target.value.toLowerCase().trim();
    const productCards = document.querySelectorAll('.products-slider-container .products-card');

    productCards.forEach(card => {
        const title = card.querySelector('.products-card-title').textContent.toLowerCase();

        if (title.includes(keyword)) {
            card.style.display = 'flex'; 
        } else {
            card.style.display = 'none';  
        }
    });
});

// B. Aksi Enter: Tutup Search, Reset Slider, Scroll & Beri Efek Fokus Glowing
searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        const keyword = this.value.toLowerCase().trim();
        const productCards = document.querySelectorAll('.products-slider-container .products-card');
        const productsSection = document.querySelector('#products');
        
        let targetCard = null;

        // 1. Cari produk yang cocok terlebih dahulu
        productCards.forEach(card => {
            const title = card.querySelector('.products-card-title').textContent.toLowerCase();
            if (title.includes(keyword) && !targetCard) {
                targetCard = card; 
            }
        });

        // 2. Tampilkan kembali semua produk agar slider utuh
        productCards.forEach(card => {
            card.style.display = 'flex';
        });

        // 3. Tutup overlay pencarian hitam
        searchForm.classList.remove('active');

        // 4. Geser layar dan nyalakan efek animasi fokus pada kartu produk
        if (targetCard) {
            setTimeout(() => {
                targetCard.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                targetCard.classList.add('search-focused');
                
                setTimeout(() => {
                    targetCard.classList.remove('search-focused');
                }, 2000);
            }, 300); 
        } else if (productsSection) {
            setTimeout(() => {
                productsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        }

        this.value = '';
    }
});


// ==========================================
// 5. LOGIKA OPERASIONAL KERANJANG BELANJA
// ==========================================

// Fungsi Render Keranjang Belanja
function renderCart() {
    cartContainer.innerHTML = ''; 
    
    if (cartData.length === 0) {
        cartContainer.innerHTML = '<p class="empty-cart-text">Keranjang masih kosong.</p>';
        totalPriceDisplay.textContent = 'IDR 0';
        return;
    }

    let total = 0;

    cartData.forEach((item, index) => {
        total += item.price * item.quantity;

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item');
        cartItem.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="item-detail">
                <h3>${item.name}</h3>
                <div class="item-price">IDR ${item.price.toLocaleString('id-ID')}</div>
                <div class="quantity-control">
                    <button class="qty-btn minus" onclick="changeQuantity(${index}, -1)">-</button>
                    <span class="qty-number">${item.quantity}</span>
                    <button class="qty-btn plus" onclick="changeQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <i data-feather="trash-2" class="remove-item" onclick="removeFromCart(${index})"></i>
        `;
        cartContainer.appendChild(cartItem);
    });

    totalPriceDisplay.textContent = 'IDR ' + total.toLocaleString('id-ID');
    feather.replace();
}

// Mengubah Jumlah Produk
window.changeQuantity = function(index, delta) {
    cartData[index].quantity += delta;

    if (cartData[index].quantity < 1) {
        cartData.splice(index, 1);
    }

    renderCart();
};

// Menambah Produk Baru ke Keranjang
function addToCart(product) {
    const existingItem = cartData.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1; 
    } else {
        cartData.push({ ...product, quantity: 1 }); 
    }

    renderCart();
    
    const cartBtnIcon = document.querySelector('#shopping-cart-button');
    cartBtnIcon.style.transform = 'scale(1.3)';
    cartBtnIcon.style.transition = 'transform 0.1s ease';
    
    setTimeout(() => {
        cartBtnIcon.style.transform = 'scale(1)';
    }, 150);
}

// Menghapus Produk Instan
window.removeFromCart = function(index) {
    cartData.splice(index, 1);
    renderCart();
};

// Mendaftarkan Event Klik Beli ke Semua Tombol
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');
        const price = parseInt(this.getAttribute('data-price'));
        const img = this.getAttribute('data-img');

        addToCart({ id, name, price, img });
    });
});


// ==========================================
// 6. LOGIKA FILTER KATEGORI PRODUK INTERAKTIF
// ==========================================
const categoryButtons = document.querySelectorAll('.category-btn');
const allProductCards = document.querySelectorAll('.products-slider-container .products-card');
const sliderContainer = document.querySelector('.products-slider-container');

categoryButtons.forEach(button => {
    button.addEventListener('click', function() {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const filterValue = this.getAttribute('data-filter');

        allProductCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');

            if (filterValue === 'all' || cardCategory === filterValue) {
                card.style.display = 'flex'; 
            } else {
                card.style.display = 'none';  
            }
        });

        if (sliderContainer) {
            sliderContainer.scrollLeft = 0;
        }
    });
});


// ==========================================
// 7. LOGIKA NAVIGASI TOMBOL PANAH SLIDER (PC)
// ==========================================
const prevBtn = document.querySelector('#prev-slide-btn');
const nextBtn = document.querySelector('#next-slide-btn');
const productSlider = document.querySelector('.products-slider-container');

if (prevBtn && nextBtn && productSlider) {
    // Geser ke kiri saat tombol Prev diklik
    prevBtn.addEventListener('click', () => {
        // PERBAIKAN: Mengambil lebar riil kontainer pembungkus (1 slide utuh)
        const slideWidth = productSlider.clientWidth;
        productSlider.scrollLeft -= slideWidth;
    });

    // Geser ke kanan saat tombol Next diklik
    nextBtn.addEventListener('click', () => {
        // PERBAIKAN: Mengambil lebar riil kontainer pembungkus (1 slide utuh)
        const slideWidth = productSlider.clientWidth;
        productSlider.scrollLeft += slideWidth;
    });
}

// Jalankan render awal saat website dimuat pertama kali
renderCart();

// ==========================================
// 8. LOGIKA KIRIM PESAN KE WHATSAPP
// ==========================================

// Ambil form kontak
const contactForm = document.querySelector('#contact-form');

// Nomor WhatsApp Admin
// Gunakan format: 628xxxxxxxxxx
const adminWhatsApp = '6282293249433';

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // Ambil data dari input HTML
        const nama = document.querySelector('#contact-name').value.trim();
        const email = document.querySelector('#contact-email').value.trim();
        const phone = document.querySelector('#contact-phone').value.trim();
        const address = document.querySelector('#contact-address').value.trim();

        // Validasi form
        if (!nama || !email || !phone || !address) {
            alert('Semua data wajib diisi!');
            return;
        }

        // Validasi email sederhana
        const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/i;

        if (!emailPattern.test(email)) {
            alert('Format email tidak valid!');
            return;
        }

        // Susun pesan WhatsApp
        const message = `Halo Admin NN Hijab,

Saya ingin menghubungi Anda dengan data berikut:

👤 Nama : ${nama}
📧 Email : ${email}
📱 No HP : ${phone}
🏠 Alamat : ${address}

Terima kasih.`;

        // Encode pesan agar aman di URL
        const encodedMessage = encodeURIComponent(message);

        // Link WhatsApp
        const whatsappURL = `https://wa.me/${adminWhatsApp}?text=${encodedMessage}`;

        // Buka WhatsApp
        window.open(whatsappURL, '_blank');

        // Reset form setelah dikirim
        contactForm.reset();
    });
}
