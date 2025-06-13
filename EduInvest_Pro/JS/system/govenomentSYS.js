document.addEventListener('DOMContentLoaded', function() {
    // إضافة تأثيرات التفاعل للأقسام المختلفة في صفحة الأنظمة الحكومية
    const systemSections = document.querySelectorAll('.system-section');
    
    // تطبيق تأثير عند التمرير إلى القسم
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    systemSections.forEach(section => {
        sectionObserver.observe(section);
        
        // إضافة تأثير عند النقر على عنوان القسم
        const sectionHeader = section.querySelector('h3');
        if (sectionHeader) {
            sectionHeader.addEventListener('click', () => {
                section.classList.toggle('section-expanded');
            });
        }
    });
    
    // تحسين التفاعل مع أقسام المميزات والسلبيات
    const prosConsSections = document.querySelectorAll('.pros-cons');
    prosConsSections.forEach(section => {
        const pros = section.querySelector('.pros');
        const cons = section.querySelector('.cons');
        
        if (pros) {
            pros.addEventListener('mouseenter', () => {
                pros.style.transform = 'scale(1.02)';
            });
            pros.addEventListener('mouseleave', () => {
                pros.style.transform = '';
            });
        }
        
        if (cons) {
            cons.addEventListener('mouseenter', () => {
                cons.style.transform = 'scale(1.02)';
            });
            cons.addEventListener('mouseleave', () => {
                cons.style.transform = '';
            });
        }
    });
    
    // إضافة رابط للعودة لأعلى الصفحة
    const mainElement = document.querySelector('main');
    if (mainElement) {
        const backToTopButton = document.createElement('button');
        backToTopButton.classList.add('back-to-top');
        backToTopButton.innerHTML = '↑';
        backToTopButton.setAttribute('title', 'العودة لأعلى الصفحة');
        
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        document.body.appendChild(backToTopButton);
        
        // إظهار الزر عند التمرير
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
    }
});
