// filepath: d:\Project_with_copilot\EduInvest_Pro\JS\theme-switcher.js
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const themeStylesheet = document.getElementById('theme-style');
    const themeIcon = document.getElementById('theme-icon');
    const themeText = themeToggle.querySelector('.icon-text');
    const body = document.body;
    
    // Check for saved theme preference or use default
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Apply the current theme
    setTheme(currentTheme);
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    });
    
    // Calculate the depth of directories to determine the correct relative path
    function calculatePathDepth(path) {
        // Check if the path has ../ (meaning we're in a subdirectory)
        if (!path.includes('../')) {
            return 0; // Root level
        }
        
        // For pages in "pages/finance/econemy" or "pages/finance/government", we need "../../.."
        if (path.includes('../../../')) {
            return 3;
        }
        
        // For pages in "pages/finance" or "pages/markets" or "pages/calculator", we need "../.."
        if (path.includes('../../')) {
            return 2;
        }
        
        // For pages directly in the "pages" directory
        return 1;
    }
    
    function setTheme(theme) {
        // Get the current stylesheet href path
        const currentPath = themeStylesheet.getAttribute('href');
        
        // Determine the depth of the current page
        const depth = calculatePathDepth(currentPath);
        const pathPrefix = '../'.repeat(depth);
        
        if (theme === 'dark') {
            themeStylesheet.href = `${pathPrefix}css/dark-theme.css`;
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeText.textContent = 'الوضع المضيء';
            
            // Also update the theme icon if it exists
            if (themeIcon) {
                themeIcon.src = `${pathPrefix}assets/icons/light-mode.svg`;
                themeIcon.alt = 'الوضع المضيء';
            }
        } else {
            themeStylesheet.href = `${pathPrefix}css/light-theme.css`;
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeText.textContent = 'الوضع المظلم';
            
            // Also update the theme icon if it exists
            if (themeIcon) {
                themeIcon.src = `${pathPrefix}assets/icons/dark-mode.svg`;
                themeIcon.alt = 'الوضع المظلم';
            }
        }
        
        // Save preference to localStorage
        localStorage.setItem('theme', theme);
        
        // Dispatch a custom event to notify other parts of the app about the theme change
        const themeChangedEvent = new Event('themeChanged');
        document.dispatchEvent(themeChangedEvent);
    }
});
