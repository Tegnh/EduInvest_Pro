/**
 * مدير التبويبات - يتحكم في آلية تبديل التبويبات في صفحات المحتوى
 */

document.addEventListener('DOMContentLoaded', function() {
    // تهيئة جميع مجموعات التبويبات في الصفحة
    initializeAllTabs();
});

/**
 * تهيئة جميع مجموعات التبويبات في الصفحة
 */
function initializeAllTabs() {
    // البحث عن كل مجموعات التبويبات
    const tabContainers = document.querySelectorAll('.tabs-container');
    
    tabContainers.forEach(container => {
        initializeTabGroup(container);
    });
    
    // التحقق من وجود تبويب محدد في عنوان URL
    checkUrlForActiveTab();
}

/**
 * تهيئة مجموعة تبويبات محددة
 * @param {HTMLElement} container - حاوية مجموعة التبويبات
 */
function initializeTabGroup(container) {
    const tabs = container.querySelectorAll('.tab');
    const tabContents = container.querySelectorAll('.tab-content');
    
    // إضافة مستمعي أحداث لكل تبويب
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            if (!targetId) {
                console.error('التبويب لا يحتوي على خاصية data-tab');
                return;
            }
            
            // إزالة الصنف 'active' من جميع التبويبات
            tabs.forEach(t => t.classList.remove('active'));
            
            // إضافة الصنف 'active' للتبويب المحدد
            tab.classList.add('active');
            
            // إيجاد جميع محتويات التبويبات ذات الصلة في نفس الحاوية
            const relatedContents = document.querySelectorAll(`#${targetId}, [data-tab-content="${targetId}"]`);
            
            // إخفاء جميع محتويات التبويبات
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // إظهار المحتوى المرتبط بالتبويب المحدد
            relatedContents.forEach(content => {
                content.classList.add('active');
                content.style.display = 'block';
                
                // تحريك شريط التمرير للأعلى بسلاسة في حالة كان المحتوى طويلاً
                requestAnimationFrame(() => {
                    container.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start' 
                    });
                });
            });
            
            // تحديث عنوان URL مع معرف التبويب النشط (اختياري)
            updateUrlWithActiveTab(targetId);
        });
    });
    
    // التأكد من أن التبويب الافتراضي نشط
    const activeTab = container.querySelector('.tab.active') || container.querySelector('.tab:first-child');
    if (activeTab) {
        setTimeout(() => {
            // تحفيز النقر على التبويب الافتراضي لتفعيله
            activeTab.click();
        }, 0);
    }
}

/**
 * التحقق من عنوان URL للعثور على تبويب نشط
 */
function checkUrlForActiveTab() {
    const url = new URL(window.location.href);
    const tabParam = url.searchParams.get('tab');
    
    if (tabParam) {
        const tab = document.querySelector(`.tab[data-tab="${tabParam}"]`);
        if (tab) {
            tab.click();
        }
    }
}

/**
 * تحديث عنوان URL بالتبويب النشط
 * @param {string} tabId - معرف التبويب النشط
 */
function updateUrlWithActiveTab(tabId) {
    if (history.pushState) {
        const url = new URL(window.location.href);
        url.searchParams.set('tab', tabId);
        window.history.pushState({ path: url.href }, '', url.href);
    }
}
