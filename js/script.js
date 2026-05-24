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
const checkoutBtn = document.querySelector('.checkout-btn');

// NOMOR ADMIN WHATSAPP
const waAdminNumber = '6281234567890';

// Data internal penampung daftar belanjaan
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

    if (
        !cartBtn.contains(e.target) &&
        !shoppingCart.contains(e.target) &&
        !e.target.closest('.add-to-cart-btn') &&
        !e.target.classList.contains('qty-btn') &&
        !e.target.closest('.remove-item')
    ) {
        shoppingCart.classList.remove('active');
    }
});

// Tutup navbar saat link diklik
document.querySelectorAll('.navbar-nav a').forEach(link => {
    link.addEventListener('click', () => {
        navbarNav.classList.remove('active');
    });
});


// ==========================================
// 4. LOGIKA PENCARIAN PRODUK
// ==========================================

// Filter realtime
searchInput.addEventListener('input', function(e) {

    const keyword = e.target.value.toLowerCase().trim();

    const productCards = document.querySelectorAll(
        '.products-slider-container .products-card'
    );

    productCards.forEach(card => {

        const title = card
            .querySelector('.products-card-title')
            .textContent
            .toLowerCase();

        if (title.includes(keyword)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

// Fokus produk saat Enter
searchInput.addEventListener('keydown', function(e) {

    if (e.key === 'Enter') {

        const keyword = this.value.toLowerCase().trim();

        const productCards = document.querySelectorAll(
            '.products-slider-container .products-card'
        );

        const productsSection = document.querySelector('#products');

        let targetCard = null;

        productCards.forEach(card => {

            const title = card
                .querySelector('.products-card-title')
                .textContent
                .toLowerCase();

            if (title.includes(keyword) && !targetCard) {
                targetCard = card;
            }
        });

        productCards.forEach(card => {
            card.style.display = 'flex';
        });

        searchForm.classList.remove('active');

        if (targetCard) {

            setTimeout(() => {

                targetCard.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'center'
                });

                targetCard.classList.add('search-focused');

                setTimeout(() => {
                    targetCard.classList.remove('search-focused');
                }, 2000);

            }, 300);

        } else if (productsSection) {

            setTimeout(() => {
                productsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300);
        }

        this.value = '';
    }
});


// ==========================================
// 5. LOGIKA KERANJANG BELANJA
// ==========================================

// Render keranjang
function renderCart() {

    cartContainer.innerHTML = '';

    if (cartData.length === 0) {

        cartContainer.innerHTML =
            '<p class="empty-cart-text">Keranjang masih kosong.</p>';

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

                <div class="item-price">
                    IDR ${item.price.toLocaleString('id-ID')}
                </div>

                <div class="quantity-control">

                    <button class="qty-btn minus"
                        onclick="changeQuantity(${index}, -1)">
                        -
                    </button>

                    <span class="qty-number">
                        ${item.quantity}
                    </span>

                    <button class="qty-btn plus"
                        onclick="changeQuantity(${index}, 1)">
                        +
                    </button>

                </div>

            </div>

            <i data-feather="trash-2"
               class="remove-item"
               onclick="removeFromCart(${index})">
            </i>
        `;

        cartContainer.appendChild(cartItem);
    });

    totalPriceDisplay.textContent =
        'IDR ' + total.toLocaleString('id-ID');

    feather.replace();
}

// Ubah jumlah produk
window.changeQuantity = function(index, delta) {

    cartData[index].quantity += delta;

    if (cartData[index].quantity < 1) {
        cartData.splice(index, 1);
    }

    renderCart();
};

// Tambah produk ke keranjang
function addToCart(product) {

    const existingItem = cartData.find(
        item => item.id === product.id
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cartData.push({
            ...product,
            quantity: 1
        });
    }

    renderCart();

    const cartBtnIcon =
        document.querySelector('#shopping-cart-button');

    cartBtnIcon.style.transform = 'scale(1.3)';
    cartBtnIcon.style.transition = 'transform 0.1s ease';

    setTimeout(() => {
        cartBtnIcon.style.transform = 'scale(1)';
    }, 150);
}

// Hapus produk
window.removeFromCart = function(index) {
    cartData.splice(index, 1);
    renderCart();
};

// Tombol tambah keranjang
document.querySelectorAll('.add-to-cart-btn').forEach(button => {

    button.addEventListener('click', function() {

        const id = this.getAttribute('data-id');
        const name = this.getAttribute('data-name');

        const price = parseInt(
            this.getAttribute('data-price')
        );

        const img = this.getAttribute('data-img');

        addToCart({
            id,
            name,
            price,
            img
        });
    });
});


// ==========================================
// 6. FILTER KATEGORI PRODUK
// ==========================================
const categoryButtons =
    document.querySelectorAll('.category-btn');

const allProductCards =
    document.querySelectorAll(
        '.products-slider-container .products-card'
    );

const sliderContainer =
    document.querySelector('.products-slider-container');

categoryButtons.forEach(button => {

    button.addEventListener('click', function() {

        categoryButtons.forEach(btn => {
            btn.classList.remove('active');
        });

        this.classList.add('active');

        const filterValue =
            this.getAttribute('data-filter');

        allProductCards.forEach(card => {

            const cardCategory =
                card.getAttribute('data-category');

            if (
                filterValue === 'all' ||
                cardCategory === filterValue
            ) {

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
// 7. NAVIGASI SLIDER
// ==========================================
const prevBtn = document.querySelector('#prev-slide-btn');
const nextBtn = document.querySelector('#next-slide-btn');

const productSlider =
    document.querySelector('.products-slider-container');

if (prevBtn && nextBtn && productSlider) {

    prevBtn.addEventListener('click', () => {

        const slideWidth = productSlider.clientWidth;

        productSlider.scrollLeft -= slideWidth;
    });

    nextBtn.addEventListener('click', () => {

        const slideWidth = productSlider.clientWidth;

        productSlider.scrollLeft += slideWidth;
    });
}


// ==========================================
// 8. CHECKOUT MIDTRANS
// ==========================================
if (checkoutBtn) {

    checkoutBtn.addEventListener('click', async function(e) {

        e.preventDefault();

        if (cartData.length === 0) {

            alert('Keranjang belanja Anda masih kosong!');
            return;
        }

        // Hitung total
        let totalAmount = 0;

        cartData.forEach(item => {
            totalAmount += item.price * item.quantity;
        });

        try {

            // Request ke backend
            const response = await fetch(
                'http://localhost:5000/checkout',
                {
                    method: 'POST',

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify({
                        items: cartData,
                        total: totalAmount
                    })
                }
            );

            if (!response.ok) {
                throw new Error(
                    'Gagal berkomunikasi dengan backend.'
                );
            }

            const data = await response.json();

            console.log(data);

            // Ambil token Midtrans
            const token = data.token;

            if (!token) {

                console.error(data);

                alert(
                    'Gagal mendapatkan token pembayaran Midtrans.'
                );

                return;
            }

            // Popup Midtrans
            window.snap.pay(token, {

                onSuccess: function(result) {

                    alert(
                        'Pembayaran berhasil! Terima kasih.'
                    );

                    // WhatsApp otomatis
                    let pesan =
                        `Halo Admin NN Hijab,%0A%0A`;

                    pesan +=
                        `Saya sudah berhasil melakukan pembayaran.%0A`;

                    pesan +=
                        `Order ID: ${result.order_id}%0A`;

                    pesan +=
                        `Total: IDR ${result.gross_amount}%0A%0A`;

                    pesan +=
                        `Mohon diproses ya admin. Terima kasih.`;

                    window.open(
                        `https://wa.me/${waAdminNumber}?text=${pesan}`,
                        '_blank'
                    );

                    // Kosongkan keranjang
                    cartData = [];

                    renderCart();
                },

                onPending: function(result) {

                    alert(
                        'Menunggu pembayaran Anda.'
                    );

                    console.log(result);
                },

                onError: function(result) {

                    alert(
                        'Pembayaran gagal.'
                    );

                    console.log(result);
                },

                onClose: function() {

                    alert(
                        'Anda menutup popup pembayaran.'
                    );
                }
            });

        } catch (error) {

            console.error(error);

            alert(
                'Terjadi kesalahan saat checkout.'
            );
        }
    });
}


// ==========================================
// 9. KONFIRMASI PEMBAYARAN WHATSAPP
// ==========================================
const contactForm = document.querySelector('.contact .row form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const inputs = contactForm.querySelectorAll('input');

        const payerName = inputs[0] ? inputs[0].value.trim() : '';
        const payerEmail = inputs[1] ? inputs[1].value.trim() : '';
        const payerPhone = inputs[2] ? inputs[2].value.trim() : '';
        const shippingAddress = inputs[3] ? inputs[3].value.trim() : '';

        if (!payerName || !payerPhone) {
            alert('Mohon lengkapi Nama Pembayar dan No HP!');
            return;
        }

        // --- PERBAIKAN DI SINI ---
        // Membuat detail string pengganti karena paymentReference tidak ada.
        // Anda bisa mengisinya dengan pesan manual atau total harga dari keranjang terakhir.
        let paymentDetail = "Mohon verifikasi pembayaran saya."; 

        let confirmationMessage = `💳 *KONFIRMASI PEMBAYARAN - NN HIJAB*\n\n`;
        confirmationMessage += `👤 Nama: ${payerName}\n`;
        confirmationMessage += `📱 No HP: ${payerPhone}\n`;

        if (payerEmail) {
            confirmationMessage += `📧 Email: ${payerEmail}\n`;
        }

        if (shippingAddress) {
            confirmationMessage += `📍 Alamat: ${shippingAddress}\n`;
        }

        // Menggunakan variabel paymentDetail yang sudah dibuat di atas
        confirmationMessage += `💵 Detail: ${paymentDetail}\n`;

        const encodedConfirm = encodeURIComponent(confirmationMessage);

        // --- PERBAIKAN DI SINI (Menghapus spasi setelah phone=) ---
        const whatsappConfirmUrl = `https://api.whatsapp.com/send?phone=6282293249433&text=${encodedConfirm}`;

        window.open(whatsappConfirmUrl, '_blank');

        contactForm.reset();
    });
}
