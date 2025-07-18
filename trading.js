// Trading Dashboard JavaScript

// Chart Configuration
let priceChart;

// Initialize Trading Dashboard
document.addEventListener('DOMContentLoaded', function() {
    initializePriceChart();
    initializeTradingForms();
    initializePanelTabs();
    initializeMarketTabs();
    startRealTimeUpdates();
});

// Initialize Price Chart
function initializePriceChart() {
    const ctx = document.getElementById('priceChart');
    if (!ctx) return;

    // Generate sample price data
    const labels = [];
    const data = [];
    const basePrice = 45230;
    
    for (let i = 23; i >= 0; i--) {
        const time = new Date();
        time.setHours(time.getHours() - i);
        labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
        
        const variation = (Math.random() - 0.5) * 1000;
        data.push(basePrice + variation);
    }

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'BTC/USDT',
                data: data,
                borderColor: '#00d4ff',
                backgroundColor: 'rgba(0, 212, 255, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: '#00d4ff',
                pointHoverBorderColor: '#ffffff',
                pointHoverBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(26, 31, 46, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#a0a9c0',
                    borderColor: '#2d3748',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return 'Time: ' + context[0].label;
                        },
                        label: function(context) {
                            return 'Price: $' + context.parsed.y.toLocaleString('en-US', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            });
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        color: 'rgba(45, 55, 72, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b7280',
                        maxTicksLimit: 8
                    }
                },
                y: {
                    display: true,
                    position: 'right',
                    grid: {
                        color: 'rgba(45, 55, 72, 0.5)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#6b7280',
                        callback: function(value) {
                            return '$' + value.toLocaleString('en-US', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0
                            });
                        }
                    }
                }
            },
            interaction: {
                mode: 'index',
                intersect: false
            },
            elements: {
                point: {
                    hoverRadius: 8
                }
            }
        }
    });
}

// Initialize Trading Forms
function initializeTradingForms() {
    // Form tab switching
    const formTabs = document.querySelectorAll('.form-tab');
    const tradingForms = document.querySelectorAll('.trading-form');
    
    formTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update active tab
            formTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding form
            tradingForms.forEach(form => {
                form.classList.remove('active');
                if (form.classList.contains(`${targetTab}-form`)) {
                    form.classList.add('active');
                }
            });
        });
    });
    
    // Order type switching
    const orderTypes = document.querySelectorAll('.order-type');
    orderTypes.forEach(type => {
        type.addEventListener('click', () => {
            const form = type.closest('.trading-form');
            const orderTypes = form.querySelectorAll('.order-type');
            
            orderTypes.forEach(t => t.classList.remove('active'));
            type.classList.add('active');
            
            // Toggle price input based on order type
            const priceInput = form.querySelector('input[id*="Price"]');
            if (type.dataset.type === 'market') {
                priceInput.disabled = true;
                priceInput.style.opacity = '0.5';
            } else {
                priceInput.disabled = false;
                priceInput.style.opacity = '1';
            }
        });
    });
    
    // Percentage buttons
    const percentageButtons = document.querySelectorAll('.percentage-btn');
    percentageButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const percent = parseInt(btn.dataset.percent);
            const form = btn.closest('.trading-form');
            const isBuyForm = form.classList.contains('buy-form');
            
            // Calculate amount based on percentage
            let availableBalance, price, amountInput, totalInput;
            
            if (isBuyForm) {
                availableBalance = 2450.67; // USDT balance
                price = parseFloat(document.getElementById('buyPrice').value) || 45230.50;
                amountInput = document.getElementById('buyAmount');
                totalInput = document.getElementById('buyTotal');
                
                const totalToSpend = (availableBalance * percent) / 100;
                const amountToBuy = totalToSpend / price;
                
                amountInput.value = amountToBuy.toFixed(8);
                totalInput.value = totalToSpend.toFixed(2);
            } else {
                availableBalance = 0.2567; // BTC balance
                amountInput = document.getElementById('sellAmount');
                totalInput = document.getElementById('sellTotal');
                price = parseFloat(document.getElementById('sellPrice').value) || 45230.50;
                
                const amountToSell = (availableBalance * percent) / 100;
                const totalToReceive = amountToSell * price;
                
                amountInput.value = amountToSell.toFixed(8);
                totalInput.value = totalToReceive.toFixed(2);
            }
        });
    });
    
    // Real-time calculation
    const priceInputs = document.querySelectorAll('input[id*="Price"]');
    const amountInputs = document.querySelectorAll('input[id*="Amount"]');
    const totalInputs = document.querySelectorAll('input[id*="Total"]');
    
    function updateCalculations(changedInput) {
        const form = changedInput.closest('.trading-form');
        const priceInput = form.querySelector('input[id*="Price"]');
        const amountInput = form.querySelector('input[id*="Amount"]');
        const totalInput = form.querySelector('input[id*="Total"]');
        
        const price = parseFloat(priceInput.value) || 0;
        const amount = parseFloat(amountInput.value) || 0;
        const total = parseFloat(totalInput.value) || 0;
        
        if (changedInput === priceInput || changedInput === amountInput) {
            totalInput.value = (price * amount).toFixed(2);
        } else if (changedInput === totalInput && price > 0) {
            amountInput.value = (total / price).toFixed(8);
        }
    }
    
    [...priceInputs, ...amountInputs, ...totalInputs].forEach(input => {
        input.addEventListener('input', () => updateCalculations(input));
    });
    
    // Trading button handlers
    const tradingButtons = document.querySelectorAll('.trading-btn');
    tradingButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const isBuy = btn.classList.contains('buy-btn');
            const form = btn.closest('.trading-form');
            const amount = form.querySelector('input[id*="Amount"]').value;
            const price = form.querySelector('input[id*="Price"]').value;
            
            if (!amount || parseFloat(amount) <= 0) {
                showNotification('Please enter a valid amount', 'error');
                return;
            }
            
            // Simulate order placement
            const originalText = btn.textContent;
            btn.textContent = 'Processing...';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.textContent = 'Order Placed!';
                btn.style.background = '#10b981';
                
                // Add to open orders (simulation)
                addOpenOrder(isBuy ? 'Buy' : 'Sell', amount, price);
                
                // Reset form
                setTimeout(() => {
                    form.reset();
                    form.querySelector('input[id*="Price"]').value = getCurrentPrice();
                    btn.textContent = originalText;
                    btn.disabled = false;
                    btn.style.background = '';
                    
                    showNotification(`${isBuy ? 'Buy' : 'Sell'} order placed successfully!`, 'success');
                }, 1500);
            }, 2000);
        });
    });
}

// Initialize Panel Tabs
function initializePanelTabs() {
    const panelTabs = document.querySelectorAll('.panel-tab');
    const panelContents = document.querySelectorAll('.panel-content');
    
    panelTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetPanel = tab.dataset.panel;
            
            // Update active tab
            panelTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Show corresponding panel
            panelContents.forEach(panel => {
                panel.classList.remove('active');
                if (panel.classList.contains(`${targetPanel}-panel`)) {
                    panel.classList.add('active');
                }
            });
        });
    });
}

// Initialize Market Tabs
function initializeMarketTabs() {
    const marketTabs = document.querySelectorAll('.market-tab');
    
    marketTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const market = tab.dataset.market;
            
            // Update active tab
            marketTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update price display and forms
            updateMarketData(market);
        });
    });
    
    // Chart interval buttons
    const chartIntervals = document.querySelectorAll('.chart-interval');
    chartIntervals.forEach(interval => {
        interval.addEventListener('click', () => {
            chartIntervals.forEach(i => i.classList.remove('active'));
            interval.classList.add('active');
            
            // Update chart data (simulation)
            updateChartData(interval.dataset.interval);
        });
    });
}

// Update Market Data
function updateMarketData(market) {
    const prices = {
        'BTC/USDT': { price: 45230.50, change: '+2.45%' },
        'ETH/USDT': { price: 3120.75, change: '+1.82%' },
        'BNB/USDT': { price: 315.25, change: '-0.95%' }
    };
    
    const marketData = prices[market];
    if (marketData) {
        document.querySelector('.current-price').textContent = '$' + marketData.price.toLocaleString();
        const changeElement = document.querySelector('.price-change');
        changeElement.textContent = marketData.change;
        changeElement.className = 'price-change ' + (marketData.change.startsWith('+') ? 'positive' : 'negative');
        
        // Update form prices
        document.getElementById('buyPrice').value = marketData.price;
        document.getElementById('sellPrice').value = marketData.price;
    }
}

// Update Chart Data
function updateChartData(interval) {
    if (!priceChart) return;
    
    // Generate new data based on interval
    const dataPoints = {
        '1h': 24,
        '4h': 24,
        '1d': 30,
        '1w': 52
    };
    
    const points = dataPoints[interval] || 24;
    const labels = [];
    const data = [];
    const basePrice = 45230;
    
    for (let i = points - 1; i >= 0; i--) {
        const time = new Date();
        
        switch (interval) {
            case '1h':
                time.setHours(time.getHours() - i);
                labels.push(time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
                break;
            case '4h':
                time.setHours(time.getHours() - (i * 4));
                labels.push(time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' ' + 
                           time.toLocaleTimeString('en-US', { hour: '2-digit' }));
                break;
            case '1d':
                time.setDate(time.getDate() - i);
                labels.push(time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                break;
            case '1w':
                time.setDate(time.getDate() - (i * 7));
                labels.push(time.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
                break;
        }
        
        const variation = (Math.random() - 0.5) * 2000;
        data.push(basePrice + variation);
    }
    
    priceChart.data.labels = labels;
    priceChart.data.datasets[0].data = data;
    priceChart.update();
}

// Start Real-time Updates
function startRealTimeUpdates() {
    // Update prices every 5 seconds
    setInterval(() => {
        updatePrices();
        updateOrderBook();
        updateRecentTrades();
    }, 5000);
    
    // Update chart every 30 seconds
    setInterval(() => {
        if (priceChart) {
            addNewDataPoint();
        }
    }, 30000);
}

// Update Prices
function updatePrices() {
    const priceElement = document.querySelector('.current-price');
    const changeElement = document.querySelector('.price-change');
    
    if (priceElement) {
        const currentPrice = parseFloat(priceElement.textContent.replace('$', '').replace(',', ''));
        const variation = (Math.random() - 0.5) * 0.01; // ±0.5% variation
        const newPrice = currentPrice * (1 + variation);
        
        priceElement.textContent = '$' + newPrice.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
        
        // Update change percentage
        const changePercent = (variation * 100).toFixed(2);
        changeElement.textContent = (changePercent >= 0 ? '+' : '') + changePercent + '%';
        changeElement.className = 'price-change ' + (changePercent >= 0 ? 'positive' : 'negative');
        
        // Update form prices
        document.getElementById('buyPrice').value = newPrice.toFixed(2);
        document.getElementById('sellPrice').value = newPrice.toFixed(2);
    }
}

// Update Order Book
function updateOrderBook() {
    const sellOrders = document.querySelectorAll('.sell-orders .order-row');
    const buyOrders = document.querySelectorAll('.buy-orders .order-row');
    
    [...sellOrders, ...buyOrders].forEach(order => {
        const priceElement = order.querySelector('.price');
        const currentPrice = parseFloat(priceElement.textContent);
        const variation = (Math.random() - 0.5) * 0.005; // ±0.25% variation
        const newPrice = currentPrice * (1 + variation);
        
        priceElement.textContent = newPrice.toFixed(2);
    });
}

// Update Recent Trades
function updateRecentTrades() {
    const tradesContainer = document.querySelector('.trades-content');
    const tradeItems = tradesContainer.querySelectorAll('.trade-item');
    
    // Remove oldest trade and add new one
    if (tradeItems.length >= 10) {
        tradeItems[tradeItems.length - 1].remove();
    }
    
    // Create new trade
    const newTrade = document.createElement('div');
    const isBuy = Math.random() > 0.5;
    const price = getCurrentPrice() + (Math.random() - 0.5) * 10;
    const amount = (Math.random() * 0.5).toFixed(4);
    const time = new Date().toLocaleTimeString('en-US', { 
        hour12: false, 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
    });
    
    newTrade.className = `trade-item ${isBuy ? 'buy' : 'sell'}`;
    newTrade.innerHTML = `
        <span class="trade-price">${price.toFixed(2)}</span>
        <span class="trade-amount">${amount}</span>
        <span class="trade-time">${time}</span>
    `;
    
    // Insert at the beginning
    const firstTrade = tradesContainer.querySelector('.trade-item');
    if (firstTrade) {
        tradesContainer.insertBefore(newTrade, firstTrade);
    } else {
        tradesContainer.appendChild(newTrade);
    }
}

// Add New Data Point to Chart
function addNewDataPoint() {
    if (!priceChart) return;
    
    const newTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const lastPrice = priceChart.data.datasets[0].data[priceChart.data.datasets[0].data.length - 1];
    const variation = (Math.random() - 0.5) * 100;
    const newPrice = lastPrice + variation;
    
    // Add new data point
    priceChart.data.labels.push(newTime);
    priceChart.data.datasets[0].data.push(newPrice);
    
    // Remove oldest data point if too many
    if (priceChart.data.labels.length > 50) {
        priceChart.data.labels.shift();
        priceChart.data.datasets[0].data.shift();
    }
    
    priceChart.update('none');
}

// Helper Functions
function getCurrentPrice() {
    const priceElement = document.querySelector('.current-price');
    return parseFloat(priceElement.textContent.replace('$', '').replace(',', ''));
}

function addOpenOrder(side, amount, price) {
    const ordersContent = document.querySelector('.orders-content');
    const orderItem = document.createElement('div');
    orderItem.className = 'order-item';
    
    orderItem.innerHTML = `
        <div class="order-info">
            <span class="order-pair">BTC/USDT</span>
            <span class="order-type ${side.toLowerCase()}">${side} Limit</span>
        </div>
        <div class="order-details">
            <span>${amount} BTC @ $${parseFloat(price).toLocaleString()}</span>
            <button class="cancel-order-btn" onclick="cancelOrder(this)">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    ordersContent.insertBefore(orderItem, ordersContent.firstChild);
}

function cancelOrder(button) {
    const orderItem = button.closest('.order-item');
    orderItem.style.opacity = '0.5';
    
    setTimeout(() => {
        orderItem.remove();
        showNotification('Order cancelled successfully', 'success');
    }, 500);
}

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

// Add notification styles
const notificationStyles = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--bg-card);
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius);
        padding: 1rem;
        min-width: 300px;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        box-shadow: var(--shadow-lg);
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification.success {
        border-left: 4px solid var(--success-color);
    }
    
    .notification.error {
        border-left: 4px solid var(--error-color);
    }
    
    .notification.info {
        border-left: 4px solid var(--primary-color);
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: var(--text-primary);
    }
    
    .notification-content i {
        font-size: 1.2rem;
    }
    
    .notification.success .notification-content i {
        color: var(--success-color);
    }
    
    .notification.error .notification-content i {
        color: var(--error-color);
    }
    
    .notification.info .notification-content i {
        color: var(--primary-color);
    }
`;

// Inject notification styles
const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Export functions for global use
window.TradingDashboard = {
    updateMarketData,
    updateChartData,
    cancelOrder,
    showNotification
};

