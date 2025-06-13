/**
 * تحسينات للقوائم المنسدلة
 * هذا الملف يحتوي على تحسينات لمعالجة القوائم المنسدلة بشكل أكثر كفاءة
 */

/**
 * إدارة القوائم المنسدلة بشكل موحد
 * @param {Object} config - إعدادات القوائم المنسدلة
 */
function setupDropdowns(config = {}) {
    const dropdowns = [
        {
            btnId: 'calculator-dropdown-btn',
            menuId: 'calculator-dropdown',
            color: '#00bcd4'
        },
        {
            btnId: 'markets-dropdown-btn',
            menuId: 'markets-dropdown',
            color: '#ff9800'
        },
        {
            btnId: 'finance-dropdown-btn',
            menuId: 'finance-dropdown',
            color: '#8e24aa'
        },
        {
            btnId: 'systems-dropdown-btn',
            menuId: 'systems-dropdown',
            color: '#4caf50'
        }
    ];

    // إعداد كل قائمة منسدلة
    dropdowns.forEach(dropdown => {
        const btn = document.getElementById(dropdown.btnId);
        const menu = document.getElementById(dropdown.menuId);
        
        if (btn && menu) {
            // إعداد النمط المخصص للقائمة
            if (dropdown.color) {
                menu.style.borderBottom = `3px solid ${dropdown.color}`;
            }
            
            // معالج النقر على زر القائمة
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // إغلاق القوائم الأخرى أولا
                closeAllDropdowns();
                
                // تبديل حالة القائمة الحالية
                menu.classList.toggle('active');
                btn.classList.toggle('active');
                
                // ضبط موقع القائمة المنسدلة
                positionDropdownMenu(btn, menu);
            });
        }
    });
    
    // إغلاق القوائم المنسدلة عند النقر خارجها
    document.addEventListener('click', (e) => {
        let isClickInsideDropdown = false;
        
        // التحقق مما إذا كان النقر داخل أي قائمة منسدلة
        dropdowns.forEach(dropdown => {
            const btn = document.getElementById(dropdown.btnId);
            const menu = document.getElementById(dropdown.menuId);
            
            if ((btn && btn.contains(e.target)) || (menu && menu.contains(e.target))) {
                isClickInsideDropdown = true;
            }
        });
        
        // إغلاق جميع القوائم إذا كان النقر خارجها
        if (!isClickInsideDropdown) {
            closeAllDropdowns();
        }
    });
    
    // إعادة ضبط مواقع القوائم عند تغيير حجم النافذة
    window.addEventListener('resize', debounce(() => {
        // إعادة ضبط مواقع القوائم المفتوحة فقط
        dropdowns.forEach(dropdown => {
            const btn = document.getElementById(dropdown.btnId);
            const menu = document.getElementById(dropdown.menuId);
            
            if (btn && menu && menu.classList.contains('active')) {
                positionDropdownMenu(btn, menu);
            }
        });
    }, 200));
}

/**
 * ضبط موقع القائمة المنسدلة بشكل مثالي
 * @param {HTMLElement} button - زر القائمة
 * @param {HTMLElement} dropdown - عنصر القائمة المنسدلة
 */
function positionDropdownMenu(button, dropdown) {
    if (!button || !dropdown) return;
    
    const buttonRect = button.getBoundingClientRect();
    
    // إعادة تعيين الموضع
    dropdown.style.position = 'absolute';
    dropdown.style.top = `${buttonRect.bottom + window.scrollY}px`;
    dropdown.style.left = 'auto';
    dropdown.style.right = 'auto';
    dropdown.style.transform = 'none';
    dropdown.style.zIndex = '1000'; // لضمان ظهور القائمة فوق العناصر الأخرى
    
    // للشاشات الصغيرة، استخدم عرض مناسب
    if (window.innerWidth <= 768) {
        dropdown.style.width = '90%';
        dropdown.style.left = '5%';
    } else {
        // للشاشات المتوسطة والكبيرة، ضع القائمة تحت الزر مباشرة
        const buttonCenter = buttonRect.left + (buttonRect.width / 2);
        const dropdownWidth = dropdown.offsetWidth;
        
        // محاذاة القائمة مع الزر
        let leftPos = buttonCenter - (dropdownWidth / 2);
        
        // التأكد أن القائمة لا تخرج خارج حدود الشاشة
        if (leftPos < 10) leftPos = 10;
        if (leftPos + dropdownWidth > window.innerWidth - 10) {
            leftPos = window.innerWidth - dropdownWidth - 10;
        }
        
        dropdown.style.left = `${leftPos}px`;
        dropdown.style.minWidth = `${buttonRect.width}px`;
    }
}

/**
 * إغلاق جميع القوائم المنسدلة
 */
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
}

/**
 * تطبيق تأخير للوظائف المتكررة
 * @param {Function} func - الوظيفة المراد تأخيرها
 * @param {number} delay - مدة التأخير بالميلي ثانية
 * @returns {Function} الوظيفة المؤجلة
 */
function debounce(func, delay) {
    let timeoutId;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(context, args);
        }, delay);
    };
}

// تصدير الدوال للاستخدام العام
window.setupDropdowns = setupDropdowns;
window.positionDropdownMenu = positionDropdownMenu;
window.closeAllDropdowns = closeAllDropdowns;
