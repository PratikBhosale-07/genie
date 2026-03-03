document.addEventListener('DOMContentLoaded', function() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    const htmlElement = document.documentElement;
    
    // Function to set theme
    function setTheme(theme) {
        if (theme === 'dark') {
            htmlElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            setActiveButton('dark');
        } else if (theme === 'light') {
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            setActiveButton('light');
        } else if (theme === 'system') {
            localStorage.setItem('theme', 'system');
            setActiveButton('system');
            applySystemTheme();
        }
    }
    
    // Function to apply system theme preference
    function applySystemTheme() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            htmlElement.setAttribute('data-theme', 'dark');
        } else {
            htmlElement.setAttribute('data-theme', 'light');
        }
    }
    
    // Function to set the active button style
    function setActiveButton(theme) {
        themeButtons.forEach(btn => {
            if (btn.getAttribute('data-theme') === theme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
    
    // Add click event listeners to theme buttons
    themeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            setTheme(theme);
        });
    });
    
    // Listen for system theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)')
            .addEventListener('change', () => {
                if (localStorage.getItem('theme') === 'system') {
                    applySystemTheme();
                }
            });
    }
    
    // Initialize theme based on saved preference or system default
    const savedTheme = localStorage.getItem('theme') || 'system';
    if (savedTheme === 'system') {
        setTheme('system');
    } else {
        setTheme(savedTheme);
    }
    
    // Add ripple effect to theme buttons
    themeButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            const x = e.clientX - e.target.getBoundingClientRect().left;
            const y = e.clientY - e.target.getBoundingClientRect().top;
            
            const ripple = document.createElement("span");
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add("ripple");
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});
