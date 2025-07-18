// Marketplace JavaScript

// Sample offers data
let offersData = [
    {
        id: 1,
        trader: 'CryptoTrader123',
        rating: 4.9,
        trades: 156,
        online: true,
        type: 'buy',
        crypto: 'BTC',
        price: 45850.00,
        margin: 1.37,
        minAmount: 500,
        maxAmount: 5000,
        paymentMethods: ['bank', 'paypal'],
        terms: 'Fast and secure transactions. Payment within 15 minutes. Verified accounts only.',
        paymentWindow: 15,
        location: 'United States'
    },
    {
        id: 2,
        trader: 'BitcoinMaster',
        rating: 4.8,
        trades: 89,
        online: false,
        lastSeen: '2h ago',
        type: 'sell',
        crypto: 'BTC',
        price: 44950.00,
        margin: -0.62,
        minAmount: 100,
        maxAmount: 2500,
        paymentMethods: ['card', 'mobile'],
        terms: 'Quick release after payment confirmation. Available 24/7. New traders welcome.',
        paymentWindow: 30,
        location: 'United Kingdom'
    },
    {
        id: 3,
        trader: 'EthereumPro',
        rating: 4.7,
        trades: 234,
        online: true,
        type: 'buy',
        crypto: 'ETH',
        price: 3145.00,
        margin: 0.78,
        minAmount: 200,
        maxAmount: 10000,
        paymentMethods: ['bank', 'cash'],
        terms: 'Experienced trader with fast processing. Bulk orders welcome. ID verification required.',
        paymentWindow: 10,
        location: 'Canada'
    }
];

let currentFilters = {
    type: 'buy',
    crypto: 'all',
    payment: 'all',
    minAmount: null,
    maxAmount: null,
    location: 'all'
};

// Initialize marketplace
document.addEventListener('DOMContentLoaded', function() {
    initializeFilters();
    initializeOfferForm();
    initializeTradeModal();
    renderOffers();
});

// Initialize filters
function initializeFilters() {
    // Trade type tabs
    const tradeTabs = document.querySelectorAll('.trade-tab');
    tradeTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.dataset.type;
            
            // Update active tab
            tradeTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update current filters
            currentFilters.type = type;
            
            // Re-render offers
            renderOffers();
        });
    });
    
    // Filter controls
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', () => {
            updateFiltersFromForm();
            renderOffers();
        });
    });
    
    // Amount inputs
    const amountInputs = document.querySelectorAll('#minAmount, #maxAmount');
    amountInputs.forEach(input => {
        input.addEventListener('input', () => {
            updateFiltersFromForm();
            renderOffers();
        });
    });
    
    // Sort control
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', () => {
            renderOffers();
        });
    }
}

// Update filters from form
function updateFiltersFromForm() {
    currentFilters.crypto = document.getElementById('cryptoFilter').value;
    currentFilters.payment = document.getElementById('paymentFilter').value;
    currentFilters.location = document.getElementById('locationFilter').value;
    currentFilters.minAmount = parseFloat(document.getElementById('minAmount').value) || null;
    currentFilters.maxAmount = parseFloat(document.getElementById('maxAmount').value) || null;
}

// Apply filters
function applyFilters() {
    updateFiltersFromForm();
    renderOffers();
    showNotification('Filters applied successfully', 'success');
}

// Filter offers based on current filters
function filterOffers(offers) {
    return offers.filter(offer => {
        // Type filter
        if (currentFilters.type !== 'all' && offer.type !== currentFilters.type) {
            return false;
        }
        
        // Crypto filter
        if (currentFilters.crypto !== 'all' && offer.crypto !== currentFilters.crypto) {
            return false;
        }
        
        // Payment method filter
        if (currentFilters.payment !== 'all') {
            if (!offer.paymentMethods.includes(currentFilters.payment)) {
                return false;
            }
        }
        
        // Amount range filter
        if (currentFilters.minAmount !== null) {
            if (offer.maxAmount < currentFilters.minAmount) {
                return false;
            }
        }
        
        if (currentFilters.maxAmount !== null) {
            if (offer.minAmount > currentFilters.maxAmount) {
                return false;
            }
        }
        
        return true;
    });
}

// Sort offers
function sortOffers(offers) {
    const sortBy = document.getElementById('sortBy')?.value || 'price';
    
    return offers.sort((a, b) => {
        switch (sortBy) {
            case 'price':
                return currentFilters.type === 'buy' ? b.price - a.price : a.price - b.price;
            case 'rating':
                return b.rating - a.rating;
            case 'trades':
                return b.trades - a.trades;
            case 'online':
                return b.online - a.online;
            default:
                return 0;
        }
    });
}

// Render offers
function renderOffers() {
    const offersList = document.getElementById('offersList');
    const offersCount = document.getElementById('offersCount');
    
    if (!offersList || !offersCount) return;
    
    // Filter and sort offers
    let filteredOffers = filterOffers(offersData);
    filteredOffers = sortOffers(filteredOffers);
    
    // Update count
    offersCount.textContent = filteredOffers.length;
    
    // Clear existing offers
    offersList.innerHTML = '';
    
    // Render each offer
    filteredOffers.forEach(offer => {
        const offerCard = createOfferCard(offer);
        offersList.appendChild(offerCard);
    });
    
    // Show no results message if needed
    if (filteredOffers.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <div class="no-results-content">
                <i class="fas fa-search"></i>
                <h3>No offers found</h3>
                <p>Try adjusting your filters to see more results</p>
                <button class="btn-primary" onclick="clearFilters()">
                    Clear Filters
                </button>
            </div>
        `;
        offersList.appendChild(noResults);
    }
}

// Create offer card element
function createOfferCard(offer) {
    const card = document.createElement('div');
    card.className = 'offer-card';
    
    const paymentMethodsHtml = offer.paymentMethods.map(method => {
        const icons = {
            bank: 'fas fa-university',
            paypal: 'fab fa-paypal',
            card: 'fas fa-credit-card',
            cash: 'fas fa-money-bill-wave',
            mobile: 'fas fa-mobile-alt'
        };
        
        const names = {
            bank: 'Bank Transfer',
            paypal: 'PayPal',
            card: 'Credit Card',
            cash: 'Cash',
            mobile: 'Mobile Payment'
        };
        
        return `
            <span class="payment-method">
                <i class="${icons[method]}"></i>
                ${names[method]}
            </span>
        `;
    }).join('');
    
    const marginClass = offer.margin >= 0 ? 'positive' : 'negative';
    const marginSign = offer.margin >= 0 ? '+' : '';
    
    const actionText = offer.type === 'buy' ? 'Sell to this user' : 'Buy from this user';
    const actionIcon = offer.type === 'buy' ? 'fas fa-arrow-down' : 'fas fa-arrow-up';
    
    card.innerHTML = `
        <div class="offer-header">
            <div class="trader-info">
                <div class="trader-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="trader-details">
                    <span class="trader-name">${offer.trader}</span>
                    <div class="trader-stats">
                        <span class="rating">
                            <i class="fas fa-star"></i>
                            ${offer.rating} (${offer.trades} trades)
                        </span>
                        <span class="online-status ${offer.online ? 'online' : 'offline'}">
                            <i class="fas fa-circle"></i>
                            ${offer.online ? 'Online' : (offer.lastSeen ? `Last seen ${offer.lastSeen}` : 'Offline')}
                        </span>
                    </div>
                </div>
            </div>
            <div class="offer-type ${offer.type}">
                <i class="fas fa-arrow-${offer.type === 'buy' ? 'up' : 'down'}"></i>
                ${offer.type === 'buy' ? 'Buying' : 'Selling'} ${offer.crypto}
            </div>
        </div>

        <div class="offer-details">
            <div class="price-info">
                <div class="price">
                    <span class="price-value">$${offer.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                    <span class="price-label">per ${offer.crypto}</span>
                </div>
                <div class="price-margin ${marginClass}">
                    ${marginSign}${Math.abs(offer.margin).toFixed(2)}% ${offer.margin >= 0 ? 'above' : 'below'} market
                </div>
            </div>

            <div class="limits">
                <span class="limit-label">Limits:</span>
                <span class="limit-range">$${offer.minAmount.toLocaleString()} - $${offer.maxAmount.toLocaleString()}</span>
            </div>

            <div class="payment-methods">
                ${paymentMethodsHtml}
            </div>

            <div class="offer-terms">
                <p>${offer.terms}</p>
            </div>
        </div>

        <div class="offer-actions">
            <div class="offer-stats">
                <span><i class="fas fa-clock"></i> ~${offer.paymentWindow} min</span>
                <span><i class="fas fa-map-marker-alt"></i> ${offer.location}</span>
            </div>
            <button class="btn-primary" onclick="startTrade('${offer.type}', '${offer.trader}', ${offer.id})">
                ${actionText}
            </button>
        </div>
    `;
    
    return card;
}

// Clear filters
function clearFilters() {
    currentFilters = {
        type: 'buy',
        crypto: 'all',
        payment: 'all',
        minAmount: null,
        maxAmount: null,
        location: 'all'
    };
    
    // Reset form
    document.getElementById('cryptoFilter').value = 'all';
    document.getElementById('paymentFilter').value = 'all';
    document.getElementById('locationFilter').value = 'all';
    document.getElementById('minAmount').value = '';
    document.getElementById('maxAmount').value = '';
    
    renderOffers();
    showNotification('Filters cleared', 'info');
}

// Load more offers
function loadMoreOffers() {
    // Simulate loading more offers
    const additionalOffers = [
        {
            id: 4,
            trader: 'CryptoExpert',
            rating: 4.6,
            trades: 67,
            online: true,
            type: 'sell',
            crypto: 'ETH',
            price: 3098.50,
            margin: -1.25,
            minAmount: 150,
            maxAmount: 3000,
            paymentMethods: ['bank', 'paypal'],
            terms: 'Reliable trader with competitive rates. Quick processing guaranteed.',
            paymentWindow: 20,
            location: 'Australia'
        }
    ];
    
    offersData = [...offersData, ...additionalOffers];
    renderOffers();
    showNotification('More offers loaded', 'success');
}

// Initialize offer form
function initializeOfferForm() {
    const offerForm = document.querySelector('.offer-form');
    if (!offerForm) return;
    
    offerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(offerForm);
        const offerData = {
            type: formData.get('offerType'),
            crypto: offerForm.querySelector('select').value,
            price: parseFloat(offerForm.querySelectorAll('input[type="number"]')[0].value),
            minAmount: parseFloat(offerForm.querySelectorAll('input[type="number"]')[1].value),
            maxAmount: parseFloat(offerForm.querySelectorAll('input[type="number"]')[2].value),
            paymentMethods: Array.from(offerForm.querySelectorAll('input[type="checkbox"]:checked')).map(cb => cb.value),
            terms: offerForm.querySelector('textarea').value,
            paymentWindow: parseInt(offerForm.querySelectorAll('select')[1].value),
            location: offerForm.querySelectorAll('select')[2].value
        };
        
        // Validate form
        if (!validateOfferForm(offerData)) {
            return;
        }
        
        // Simulate offer creation
        const submitBtn = offerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Creating...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            // Add new offer to data
            const newOffer = {
                id: offersData.length + 1,
                trader: 'You',
                rating: 5.0,
                trades: 0,
                online: true,
                ...offerData
            };
            
            offersData.unshift(newOffer);
            
            // Reset form and close modal
            offerForm.reset();
            closeModal('createOfferModal');
            
            // Re-render offers
            renderOffers();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            showNotification('Offer created successfully!', 'success');
        }, 2000);
    });
}

// Validate offer form
function validateOfferForm(data) {
    if (!data.crypto) {
        showNotification('Please select a cryptocurrency', 'error');
        return false;
    }
    
    if (!data.price || data.price <= 0) {
        showNotification('Please enter a valid price', 'error');
        return false;
    }
    
    if (!data.minAmount || data.minAmount <= 0) {
        showNotification('Please enter a valid minimum amount', 'error');
        return false;
    }
    
    if (!data.maxAmount || data.maxAmount <= 0) {
        showNotification('Please enter a valid maximum amount', 'error');
        return false;
    }
    
    if (data.minAmount >= data.maxAmount) {
        showNotification('Maximum amount must be greater than minimum amount', 'error');
        return false;
    }
    
    if (data.paymentMethods.length === 0) {
        showNotification('Please select at least one payment method', 'error');
        return false;
    }
    
    if (!data.paymentWindow) {
        showNotification('Please select a payment window', 'error');
        return false;
    }
    
    if (!data.location) {
        showNotification('Please select your location', 'error');
        return false;
    }
    
    return true;
}

// Initialize trade modal
function initializeTradeModal() {
    const tradeForm = document.querySelector('.trade-form');
    if (!tradeForm) return;
    
    // Amount input calculation
    const amountInput = document.getElementById('tradeAmount');
    const cryptoAmountSpan = document.getElementById('cryptoAmount');
    
    if (amountInput && cryptoAmountSpan) {
        amountInput.addEventListener('input', () => {
            const amount = parseFloat(amountInput.value) || 0;
            const price = getCurrentTradePrice();
            const cryptoAmount = amount / price;
            
            cryptoAmountSpan.textContent = cryptoAmount.toFixed(8);
        });
    }
    
    // Form submission
    tradeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const amount = parseFloat(document.getElementById('tradeAmount').value);
        const paymentMethod = document.getElementById('selectedPaymentMethod').value;
        
        if (!amount || amount <= 0) {
            showNotification('Please enter a valid amount', 'error');
            return;
        }
        
        if (!paymentMethod) {
            showNotification('Please select a payment method', 'error');
            return;
        }
        
        // Simulate trade start
        const submitBtn = tradeForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Starting Trade...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            closeModal('tradeModal');
            
            // Reset form
            tradeForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            showNotification('Trade started successfully! Check your active trades.', 'success');
        }, 2000);
    });
}

// Start trade
function startTrade(type, trader, offerId) {
    const offer = offersData.find(o => o.id === offerId);
    if (!offer) return;
    
    // Update modal content
    document.getElementById('tradeModalTitle').textContent = `Trade with ${trader}`;
    document.getElementById('traderName').textContent = trader;
    document.getElementById('tradePrice').textContent = `$${offer.price.toLocaleString()} per ${offer.crypto}`;
    
    const paymentMethodsText = offer.paymentMethods.map(method => {
        const names = {
            bank: 'Bank Transfer',
            paypal: 'PayPal',
            card: 'Credit Card',
            cash: 'Cash',
            mobile: 'Mobile Payment'
        };
        return names[method];
    }).join(', ');
    
    document.getElementById('tradePaymentMethods').textContent = paymentMethodsText;
    document.getElementById('tradePaymentWindow').textContent = `${offer.paymentWindow} minutes`;
    
    // Update payment method options
    const paymentSelect = document.getElementById('selectedPaymentMethod');
    paymentSelect.innerHTML = '<option value="">Select payment method</option>';
    
    offer.paymentMethods.forEach(method => {
        const names = {
            bank: 'Bank Transfer',
            paypal: 'PayPal',
            card: 'Credit Card',
            cash: 'Cash',
            mobile: 'Mobile Payment'
        };
        
        const option = document.createElement('option');
        option.value = method;
        option.textContent = names[method];
        paymentSelect.appendChild(option);
    });
    
    // Store current trade data
    window.currentTrade = {
        offer: offer,
        type: type,
        trader: trader
    };
    
    showModal('tradeModal');
}

// Get current trade price
function getCurrentTradePrice() {
    if (window.currentTrade && window.currentTrade.offer) {
        return window.currentTrade.offer.price;
    }
    return 45000; // Default price
}

// Show create offer modal
function showCreateOfferModal() {
    showModal('createOfferModal');
}

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Add no results styles
const noResultsStyles = `
    .no-results {
        text-align: center;
        padding: 3rem;
        color: var(--text-secondary);
    }
    
    .no-results-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
    }
    
    .no-results i {
        font-size: 3rem;
        color: var(--text-muted);
    }
    
    .no-results h3 {
        font-size: 1.5rem;
        color: var(--text-primary);
        margin: 0;
    }
    
    .no-results p {
        margin: 0;
        max-width: 400px;
    }
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = noResultsStyles;
document.head.appendChild(styleSheet);

// Export functions for global use
window.MarketplaceApp = {
    showCreateOfferModal,
    startTrade,
    applyFilters,
    clearFilters,
    loadMoreOffers,
    showModal,
    closeModal,
    showNotification
};

