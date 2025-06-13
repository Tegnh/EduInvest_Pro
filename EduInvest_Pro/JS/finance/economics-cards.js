/**
 * economics-cards.js
 * ملف JavaScript لتعزيز تفاعل البطاقات في صفحة أساسيات الاقتصاد
 */

document.addEventListener('DOMContentLoaded', function() {
    // إضافة تفاعلات البطاقات
    initializeCards();
    
    // إضافة تأثيرات التحرك عند التمرير
    initializeScrollEffects();
    
    // إضافة تأثيرات تحويم للأيقونات
    initializeIconHoverEffects();
});

/**
 * تهيئة تفاعلات البطاقات
 */
function initializeCards() {
    const economicsCards = document.querySelectorAll('.economics-card');
    
    economicsCards.forEach(card => {
        // إضافة تأثير النقر
        card.addEventListener('click', function(event) {
            // تجاهل النقر إذا كان على الزر أو المحتوى الموسع
            if (event.target.closest('.expand-btn') || event.target.closest('.card-expanded-content')) {
                return;
            }
            
            // تبديل حالة التوسيع
            toggleCardExpansion(this);
        });
        
        // إضافة تأثير التحويم
        card.addEventListener('mouseenter', function() {
            animateCardIcon(this, true);
        });
        
        card.addEventListener('mouseleave', function() {
            animateCardIcon(this, false);
        });
        
        // تكوين أزرار التوسيع
        const expandButton = card.querySelector('.expand-btn');
        if (expandButton) {
            expandButton.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                toggleCardExpansion(card);
            });
        }
    });
}

/**
 * تبديل حالة توسيع البطاقة
 * @param {HTMLElement} card - عنصر البطاقة
 */
function toggleCardExpansion(card) {
    const isExpanded = card.classList.contains('expanded');
    const expandButton = card.querySelector('.expand-btn');
    
    // إغلاق جميع البطاقات الأخرى المفتوحة في نفس الشبكة
    const parentGrid = card.closest('.economics-grid');
    if (parentGrid) {
        const otherExpandedCards = parentGrid.querySelectorAll('.economics-card.expanded');
        otherExpandedCards.forEach(expandedCard => {
            if (expandedCard !== card) {
                expandedCard.classList.remove('expanded');
                updateExpandButtonText(expandedCard.querySelector('.expand-btn'), false);
            }
        });
    }
    
    // تبديل حالة البطاقة الحالية
    card.classList.toggle('expanded');
    
    // تحديث نص الزر
    updateExpandButtonText(expandButton, !isExpanded);
    
    // تمرير إلى البطاقة إذا كانت خارج نطاق الرؤية
    if (!isExpanded) {
        setTimeout(() => {
            ensureCardVisible(card);
        }, 300);
    }
}

/**
 * تحديث نص زر التوسيع
 * @param {HTMLElement} button - عنصر الزر
 * @param {boolean} isExpanded - حالة التوسيع
 */
function updateExpandButtonText(button, isExpanded) {
    if (!button) return;
    
    if (isExpanded) {
        button.innerHTML = `
            عرض أقل
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        `;
    } else {
        button.innerHTML = `
            عرض المزيد
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        `;
    }
}

/**
 * تحريك أيقونة البطاقة
 * @param {HTMLElement} card - عنصر البطاقة
 * @param {boolean} isHovering - حالة التحويم
 */
function animateCardIcon(card, isHovering) {
    const icon = card.querySelector('.card-icon');
    if (!icon) return;
    
    if (isHovering) {
        icon.style.transform = 'scale(1.15) rotate(5deg)';
    } else {
        icon.style.transform = '';
    }
}

/**
 * التأكد من أن البطاقة مرئية على الشاشة
 * @param {HTMLElement} card - عنصر البطاقة
 */
function ensureCardVisible(card) {
    const rect = card.getBoundingClientRect();
    const isInViewport = (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
    
    if (!isInViewport) {
        card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

/**
 * إضافة تأثيرات عند التمرير
 */
function initializeScrollEffects() {
    // مراقبة العناصر ليتم تحريكها عند ظهورها في الشاشة
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // مراقبة جميع البطاقات
    document.querySelectorAll('.economics-card').forEach(card => {
        card.style.opacity = 0;
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
    
    // إضافة تأثير CSS للعناصر المرئية
    const style = document.createElement('style');
    style.textContent = `
        .economics-card.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * إضافة تأثيرات تحويم للأيقونات
 */
function initializeIconHoverEffects() {
    const icons = document.querySelectorAll('.card-icon');
    
    icons.forEach(icon => {
        const svg = icon.querySelector('svg');
        if (!svg) return;
        
        // إضافة تأثيرات بالماوس
        icon.addEventListener('mouseenter', () => {
            // إضافة نبضات للأيقونة
            icon.style.animation = 'pulse 1s infinite';
        });
        
        icon.addEventListener('mouseleave', () => {
            // إزالة النبضات
            icon.style.animation = '';
        });
    });
    
    // إضافة تأثير CSS للنبضات
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

/**
 * تحديث مسارات الأيقونات للعمل مع الوضع المظلم
 */
function updateIconsForDarkMode() {
    const isDarkMode = document.body.classList.contains('dark-theme');
    const icons = document.querySelectorAll('.card-icon svg');
    
    icons.forEach(icon => {
        if (isDarkMode) {
            icon.style.stroke = '#4dabf7';
        } else {
            icon.style.stroke = '#0066cc';
        }
    });
}

// استدعاء وظيفة تحديث الأيقونات عند تغيير السمة
document.addEventListener('themeChanged', updateIconsForDarkMode);
