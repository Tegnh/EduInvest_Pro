document.addEventListener('DOMContentLoaded', () => {
    // Initialize application
    console.log('تم تهيئة تطبيق إديو إنفست برو');
    
    // تعيين القائمة الحالية
    const currentPath = window.location.pathname;
    markCurrentMenu(currentPath);
    
    // إضافة تأثيرات حركية للأيقونات
    addNavIconEffects();
    
    // إضافة تأثير العنوان عند التمرير
    handleHeaderScroll();
    
    // استخدام النظام المحسن للقوائم المنسدلة
    if (window.setupDropdowns) {
        setupDropdowns();
    } else {
        // الرجوع للنظام القديم في حالة عدم وجود النظام المحسن
        adjustDropdownPositions();
        
        // تحسين معالجة زر الحاسبة ليعمل مع جميع أحجام الشاشات
        setupCalculatorDropdown();
    }
    
    // Handle markets dropdown
    const marketsBtn = document.getElementById('markets-dropdown-btn');
    const marketsDropdown = document.getElementById('markets-dropdown');

    if (marketsBtn && marketsDropdown) {        // Toggle dropdown on button click
        marketsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            marketsDropdown.classList.toggle('active');
            marketsBtn.classList.toggle('active'); // إضافة صنف active للزر
            
            // Close other dropdowns
            if (calculatorDropdown) calculatorDropdown.classList.remove('active');
            if (calculatorBtn) calculatorBtn.classList.remove('active');
            const financeBtn = document.getElementById('finance-dropdown-btn');
            if (financeBtn) financeBtn.classList.remove('active');
            const financeDropdown = document.getElementById('finance-dropdown');
            if (financeDropdown) financeDropdown.classList.remove('active');
            const systemsDropdown = document.getElementById('systems-dropdown');
            if (systemsDropdown) systemsDropdown.classList.remove('active');
            const systemsBtn = document.getElementById('systems-dropdown-btn');
            if (systemsBtn) systemsBtn.classList.remove('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!marketsBtn.contains(e.target) && !marketsDropdown.contains(e.target)) {
                marketsDropdown.classList.remove('active');
            }
        });
    }
    
    // Handle finance dropdown
    const financeBtn = document.getElementById('finance-dropdown-btn');
    const financeDropdown = document.getElementById('finance-dropdown');

    if (financeBtn && financeDropdown) {
        // معالجة خاصة لقائمة المالية
        financeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            financeDropdown.classList.toggle('active');
            financeBtn.classList.toggle('active');
            
            // تطبيق الموضع الصحيح للقائمة فورًا عند النقر
            setTimeout(() => {
                const rect = financeBtn.getBoundingClientRect();
                financeDropdown.style.right = 'auto';
                financeDropdown.style.left = (rect.left + (rect.width / 2) - (financeDropdown.offsetWidth / 2)) + 'px';
                financeDropdown.style.top = (rect.bottom + 5 + window.scrollY) + 'px';
            }, 0);
            
            // Close other dropdowns
            if (calculatorDropdown) calculatorDropdown.classList.remove('active');
            if (marketsDropdown) marketsDropdown.classList.remove('active');
            if (calculatorBtn) calculatorBtn.classList.remove('active');
            if (marketsBtn) marketsBtn.classList.remove('active');
            const systemsDropdown = document.getElementById('systems-dropdown');
            if (systemsDropdown) systemsDropdown.classList.remove('active');
            const systemsBtn = document.getElementById('systems-dropdown-btn');
            if (systemsBtn) systemsBtn.classList.remove('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!financeBtn.contains(e.target) && !financeDropdown.contains(e.target)) {
                financeDropdown.classList.remove('active');
            }
        });
        
        // Handle submenu interactions
        const submenuItems = document.querySelectorAll('.has-submenu');
        submenuItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Toggle submenu visibility
                const submenu = item.nextElementSibling;
                if (submenu && submenu.classList.contains('dropdown-submenu-content')) {
                    submenu.classList.toggle('active');
                }
            });
        });
    }

    // Handle systems dropdown
    const systemsBtn = document.getElementById('systems-dropdown-btn');
    const systemsDropdown = document.getElementById('systems-dropdown');

    if (systemsBtn && systemsDropdown) {
        // معالجة خاصة لقائمة الأنظمة
        systemsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            systemsDropdown.classList.toggle('active');
            systemsBtn.classList.toggle('active');
            
            // تطبيق الموضع الصحيح للقائمة فورًا عند النقر
            setTimeout(() => {
                const rect = systemsBtn.getBoundingClientRect();
                systemsDropdown.style.right = 'auto';
                systemsDropdown.style.left = (rect.left + (rect.width / 2) - (systemsDropdown.offsetWidth / 2)) + 'px';
                systemsDropdown.style.top = (rect.bottom + 5 + window.scrollY) + 'px';
            }, 0);
            
            // Close other dropdowns
            if (calculatorDropdown) calculatorDropdown.classList.remove('active');
            if (marketsDropdown) marketsDropdown.classList.remove('active');
            if (calculatorBtn) calculatorBtn.classList.remove('active');
            if (marketsBtn) marketsBtn.classList.remove('active');
            if (financeDropdown) financeDropdown.classList.remove('active');
            if (financeBtn) financeBtn.classList.remove('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!systemsBtn.contains(e.target) && !systemsDropdown.contains(e.target)) {
                systemsDropdown.classList.remove('active');
            }
        });
        
        // تطبيق تأثيرات خاصة على ايقونات الأنظمة
        const mainSystemItems = document.querySelectorAll('.main-system-item');
        mainSystemItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'scale(1.05)';
                item.style.backgroundColor = 'var(--hover-color)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.transform = '';
                item.style.backgroundColor = '';
            });
            
            item.addEventListener('click', (e) => {
                // تأثير النقر
                item.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    item.style.transform = '';
                }, 150);
            });
        });
    }
    
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update theme icon when theme changes
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.src = 'assets/icons/light-mode.svg';
            themeIcon.alt = 'الوضع المضيء';
        } else {            themeIcon.src = 'assets/icons/dark-mode.svg';
            themeIcon.alt = 'الوضع المظلم';
        }
    });
    
    // تنفيذ ضبط المواقع مباشرة بعد تحميل الصفحة
    adjustDropdownPositions();
    
    // تنفيذه مرة أخرى بعد تحميل جميع الموارد للتأكد من الضبط الصحيح
    window.addEventListener('load', () => {
        // تأخير قليل لضمان ضبط جميع العناصر بشكل صحيح
        setTimeout(adjustDropdownPositions, 100);
    });
    
    // تنفيذه عند تغيير حجم النافذة أيضًا
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            adjustDropdownPositions();
            
            // تحديث موضع قائمة الحاسبة عند تغيير حجم النافذة
            const calculatorBtn = document.getElementById('calculator-dropdown-btn');
            const calculatorDropdown = document.getElementById('calculator-dropdown');
            if (calculatorBtn && calculatorDropdown && calculatorDropdown.classList.contains('active')) {
                positionDropdownMenu(calculatorBtn, calculatorDropdown);
            }
        }, 100);
    });
    
    // إضافة مستمع حدث النقر على المستند لإغلاق القوائم المنسدلة
    document.addEventListener('click', function(e) {
        // الحصول على جميع القوائم المنسدلة النشطة
        const activeDropdowns = document.querySelectorAll('.dropdown-menu.active');
        
        // إذا تم النقر خارج أي قائمة منسدلة نشطة، يجب إغلاقها
        activeDropdowns.forEach(dropdown => {
            // الحصول على زر القائمة المرتبط بهذه القائمة المنسدلة
            const btnId = dropdown.id + '-btn';
            const btn = document.getElementById(btnId);
            
            // إذا لم يتم النقر على القائمة نفسها أو على الزر المرتبط بها
            if (!dropdown.contains(e.target) && (!btn || !btn.contains(e.target))) {
                dropdown.classList.remove('active');
                if (btn) btn.classList.remove('active');
            }
        });
    });
});

/**
 * تحديد القائمة الحالية بناءً على المسار
 * @param {string} path - المسار الحالي للصفحة
 */
function markCurrentMenu(path) {
    // إزالة أي / أمامية والامتداد
    path = path.replace(/^\//, '').split('.')[0];
    
    // التحقق من نوع الصفحة ووضع علامة على القائمة المناسبة
    if (path.includes('finance')) {
        const financeBtn = document.getElementById('finance-dropdown-btn');
        if (financeBtn) {
            financeBtn.classList.add('active');
            
            // إظهار القائمة المنسدلة المالية
            setTimeout(() => {
                const financeDropdown = document.getElementById('finance-dropdown');
                if (financeDropdown) {
                    financeDropdown.classList.add('active');
                }
            }, 300);
        }
    } else if (path.includes('markets')) {
        const marketsBtn = document.getElementById('markets-dropdown-btn');
        if (marketsBtn) marketsBtn.classList.add('active');
    } else if (path.includes('calculator')) {
        const calculatorBtn = document.getElementById('calculator-dropdown-btn');
        if (calculatorBtn) calculatorBtn.classList.add('active');
    }
}

/**
 * إضافة تأثيرات حركية للأيقونات
 */
function addNavIconEffects() {
    // تأثير النبض لأيقونة المالية
    const financeBtn = document.getElementById('finance-dropdown-btn');
    if (financeBtn) {
        // إضافة تأثير لفت الانتباه للأيقونات المالية
        financeBtn.classList.add('pulse-attention');
        
        // إزالة التأثير بعد ٣ ثوانٍ
        setTimeout(() => {
            financeBtn.classList.remove('pulse-attention');
        }, 3000);
        
        // تأثير انبثاق لكل أيقونة عند التمرير عليها
        const allNavButtons = document.querySelectorAll('.nav-button');
        allNavButtons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                // إضافة تأثير النبض المؤقت عند التمرير
                button.classList.add('hover-pop');
                button.style.transform = 'scale(1.05)';
            });
            
            button.addEventListener('mouseleave', () => {
                // إزالة التأثير عند إزالة المؤشر
                button.classList.remove('hover-pop');
                button.style.transform = '';
            });
        });
        
        // تحسين العرض البصري للأنظمة المالية
        highlightFinancialSystems();
    }
}

/**
 * تسليط الضوء على قسم الأنظمة المالية
 */
function highlightFinancialSystems() {
    // تحديد قائمة الأنظمة
    const allSystemMenuItems = document.querySelectorAll('.dropdown-submenu .has-submenu span');
    
    allSystemMenuItems.forEach(span => {
        if (span.textContent === 'الأنظمة') {
            // إضافة تأثير بصري خاص
            const parentLink = span.closest('a');
            if (parentLink) {
                parentLink.style.fontWeight = '700';
                parentLink.style.color = 'var(--primary-color)';
            }
        }
    });
    
    // تعزيز التفاعلية للقوائم المنسدلة
    enhanceDropdownInteractions();
}

/**
 * تعزيز التفاعلية للقوائم المنسدلة
 */
function enhanceDropdownInteractions() {
    // تحسين سلوك الأيقونات عند النقر
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            // إضافة تأثير النقر
            this.style.transform = 'scale(0.95)';
            
            // إعادة الحجم الطبيعي بعد التأثير
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

/**
 * التعامل مع تمرير الصفحة وتأثير العنوان
 */
function handleHeaderScroll() {
    const header = document.querySelector('header');
    
    if (header) {
        // إضافة مراقب للتمرير
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
                
                // تسليط الضوء على زر المالية عند التمرير
                const financeBtn = document.getElementById('finance-dropdown-btn');
                if (financeBtn) {
                    financeBtn.style.transform = 'scale(1.05)';
                }
            } else {
                header.classList.remove('scrolled');
                
                // إعادة الحجم الطبيعي
                const financeBtn = document.getElementById('finance-dropdown-btn');
                if (financeBtn) {
                    financeBtn.style.transform = '';
                }
            }
        });
        
        // ضبط موقع القوائم المنسدلة
        adjustDropdownPositions();
        
        // تنشيط القوائم المنسدلة بشكل تلقائي عند فتح الصفحة
        activateDropdownsOnLoad();
    }
}

/**
 * ضبط موقع القوائم المنسدلة بناءً على حجم الشاشة
 */
function adjustDropdownPositions() {
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    const buttons = document.querySelectorAll('.nav-button');
    
    // تحديث مواقع القوائم عند تغيير حجم النافذة
    window.addEventListener('resize', () => {
        dropdownMenus.forEach(menu => {
            const button = document.getElementById(menu.id + '-btn');
            if (button) {
                const rect = button.getBoundingClientRect();
                const parentDropdown = button.closest('.dropdown');
                
                // معالجة خاصة لقائمة الأنظمة - تظهر مباشرة تحت الزر
                if (menu.id === 'systems-dropdown') {
                    menu.style.top = (rect.bottom + 2 + window.scrollY) + 'px';
                    menu.style.right = 'auto';
                    const menuLeft = rect.left + (rect.width / 2) - (menu.offsetWidth / 2);
                    const finalLeft = Math.max(10, Math.min(menuLeft, window.innerWidth - menu.offsetWidth - 10));
                    menu.style.left = finalLeft + 'px';
                }
                // معالجة خاصة لقائمة المالية - جعلها أقرب للزر بشكل ملحوظ
                else if (menu.id === 'finance-dropdown') {
                    menu.style.top = (rect.bottom + 2 + window.scrollY) + 'px'; // مسافة أصغر جداً من الأعلى
                    menu.style.right = 'auto'; // إلغاء الموضع الافتراضي من اليمين
                    // جعل القائمة تظهر تماماً تحت زر المالية مباشرة
                    menu.style.left = rect.left + 'px';
                } else {
                    // تحديد موضع القوائم المنسدلة الأخرى
                    menu.style.top = (rect.bottom + 5 + window.scrollY) + 'px';
                    
                    // توسيط القائمة المنسدلة بالنسبة للزر
                    const menuLeft = rect.left + (rect.width / 2) - (menu.offsetWidth / 2);
                    // التأكد من أن القائمة لا تخرج من حدود الشاشة
                    const finalLeft = Math.max(10, Math.min(menuLeft, window.innerWidth - menu.offsetWidth - 10));
                    menu.style.left = finalLeft + 'px';
                }
                
                // ضبط التوسيع الأفقي في شاشات الجوال
                if (window.innerWidth <= 768) {
                    menu.style.width = '90%';
                    menu.style.left = '5%';
                }
            }
        });
    });
    
    // التأكد من موقع القوائم المنسدلة عند فتحها
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        const button = dropdown.querySelector('.nav-button');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        if (button && menu) {
            button.addEventListener('click', () => {
                // إعادة ضبط موضع القائمة عند النقر مباشرة
                requestAnimationFrame(() => {
                    const rect = button.getBoundingClientRect();
                    
                    // معالجة خاصة مُحسّنة لقائمة المالية
                    if (menu.id === 'finance-dropdown') {
                        menu.style.top = (rect.bottom + 2 + window.scrollY) + 'px'; // مسافة صغيرة جداً
                        menu.style.right = 'auto';
                        menu.style.left = rect.left + 'px'; // محاذاة من اليمين مع الزر
                    } else {
                        // توسيط القوائم الأخرى
                        menu.style.top = (rect.bottom + 5 + window.scrollY) + 'px';
                        const menuLeft = rect.left + (rect.width / 2) - (menu.offsetWidth / 2);
                        const finalLeft = Math.max(10, Math.min(menuLeft, window.innerWidth - menu.offsetWidth - 10));
                        menu.style.left = finalLeft + 'px';
                    }
                });
            });
        }
    });
    
    // تشغيل الضبط الأولي
    window.dispatchEvent(new Event('resize'));
}

/**
 * تنشيط القوائم المنسدلة تلقائيًا عند تحميل الصفحة
 */
function activateDropdownsOnLoad() {
    setTimeout(() => {
        // إظهار وإخفاء قائمة المالية لجذب الانتباه
        const financeDropdown = document.getElementById('finance-dropdown');
        const financeBtn = document.getElementById('finance-dropdown-btn');
        
        if (financeDropdown && financeBtn) {
            financeDropdown.classList.add('active');
            financeBtn.classList.add('active');
            
            // إخفاء بعد 2 ثانية
            setTimeout(() => {
                financeDropdown.classList.remove('active');
                financeBtn.classList.remove('active');
            }, 2000);
        }
    }, 1000);
}

/**
 * إغلاق جميع القوائم المنسدلة باستثناء القائمة المحددة
 * @param {string} exceptDropdownId - معرف القائمة المنسدلة المستثناة من الإغلاق
 */
function closeOtherDropdowns(exceptDropdownId) {
    const allDropdowns = document.querySelectorAll('.dropdown-menu');
    const allDropdownBtns = document.querySelectorAll('.dropdown .nav-button');
    
    allDropdowns.forEach(dropdown => {
        if (dropdown.id !== exceptDropdownId) {
            dropdown.classList.remove('active');
        }
    });
    
    allDropdownBtns.forEach(btn => {
        if (btn.id !== exceptDropdownId + '-btn') {
            btn.classList.remove('active');
        }
    });
}

/**
 * إعداد قائمة الحاسبة المنسدلة لتعمل مع جميع أحجام الشاشات
 */
function setupCalculatorDropdown() {
    const calculatorBtn = document.getElementById('calculator-dropdown-btn');
    const calculatorDropdown = document.getElementById('calculator-dropdown');
    
    if (calculatorBtn && calculatorDropdown) {
        calculatorBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // تبديل حالة الظهور للقائمة المنسدلة
            calculatorDropdown.classList.toggle('active');
            calculatorBtn.classList.toggle('active');
            
            // وضع القائمة في الموضع الصحيح مع مراعاة جميع أحجام الشاشات
            positionDropdownMenu(calculatorBtn, calculatorDropdown);
            
            // إغلاق القوائم الأخرى عند فتح قائمة الحاسبة
            closeOtherDropdowns('calculator-dropdown');
        });
    }
}

/**
 * تحديد موضع القائمة المنسدلة بشكل مناسب لجميع أنواع الشاشات
 * @param {HTMLElement} button - زر القائمة
 * @param {HTMLElement} dropdown - القائمة المنسدلة
 */
function positionDropdownMenu(button, dropdown) {
    // الحصول على موضع الزر بالنسبة لنافذة العرض
    const rect = button.getBoundingClientRect();
    
    // تحديد الموضع العلوي للقائمة المنسدلة (أسفل الزر مباشرة)
    const topPosition = rect.bottom + window.scrollY;
    dropdown.style.top = topPosition + 'px';
    
    // حساب عرض النافذة
    const windowWidth = window.innerWidth;
    
    // موضع الشاشة الصغيرة (الهاتف)
    if (windowWidth <= 768) {
        // في الشاشات الصغيرة، نضع القائمة في وسط الشاشة مع هامش من الجانبين
        dropdown.style.width = '90%';
        dropdown.style.left = '5%';
        dropdown.style.right = 'auto';
    } 
    // موضع الشاشة المتوسطة والكبيرة
    else {
        // حذف تنسيقات الشاشة الصغيرة إذا كانت موجودة
        dropdown.style.width = '';
        
        // تحديد موضع القائمة أفقياً (توسيطها تحت الزر)
        const leftPosition = rect.left + (rect.width / 2) - (dropdown.offsetWidth / 2);
        
        // التأكد من أن القائمة لا تخرج من حدود الشاشة
        const finalLeftPosition = Math.max(10, Math.min(leftPosition, windowWidth - dropdown.offsetWidth - 10));
        
        dropdown.style.left = finalLeftPosition + 'px';
        dropdown.style.right = 'auto';
    }
    
    // التأكد من أن القائمة تظهر فوق المحتويات الأخرى
    dropdown.style.zIndex = '1000';
}

/**
 * تعديل موضع جميع القوائم المنسدلة
 */
function adjustDropdownPositions() {
    const dropdownBtns = document.querySelectorAll('.dropdown .nav-button');
    
    dropdownBtns.forEach(btn => {
        const dropdownId = btn.id.replace('-btn', '');
        const dropdown = document.getElementById(dropdownId);
        
        if (dropdown) {
            // إضافة مستمع أحداث للزر لتعديل موضع القائمة عند النقر
            btn.addEventListener('click', () => {
                if (dropdown.classList.contains('active')) {
                    positionDropdownMenu(btn, dropdown);
                }
            });
        }
    });
}
