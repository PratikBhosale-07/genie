document.addEventListener('DOMContentLoaded', function() {
    // Add ripple effect to the Get Started button
    const landingBtn = document.querySelector(".landing-btn");
    if (landingBtn) {
        landingBtn.addEventListener("click", function (e) {
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
    }

    // Animate the shapes with enhanced random movements
    const shapes = document.querySelectorAll(".floating-shape");
    shapes.forEach((shape, index) => {
        // Set random animation duration and delay
        const duration = 10 + Math.random() * 10;
        const delay = Math.random() * 5;
        
        // Add more variation to each shape
        const amplitude = 20 + Math.random() * 30;
        const rotationAmount = Math.random() * 15;
        
        // Create custom keyframe animation for each shape
        const keyframes = `@keyframes float${index} {
            0% { transform: translate(0, 0) rotate(0deg) scale(1); }
            25% { transform: translate(${Math.random() * amplitude - amplitude/2}px, ${-amplitude/2}px) rotate(${rotationAmount}deg) scale(${0.95 + Math.random() * 0.1}); }
            50% { transform: translate(${Math.random() * amplitude - amplitude/2}px, ${-amplitude}px) rotate(${rotationAmount * 2}deg) scale(${0.9 + Math.random() * 0.2}); }
            75% { transform: translate(${Math.random() * amplitude - amplitude/2}px, ${-amplitude/2}px) rotate(${rotationAmount}deg) scale(${0.95 + Math.random() * 0.1}); }
            100% { transform: translate(0, 0) rotate(0deg) scale(1); }
        }`;
        
        // Add the unique animation to document
        const styleSheet = document.createElement('style');
        styleSheet.textContent = keyframes;
        document.head.appendChild(styleSheet);
        
        shape.style.animation = `float${index} ${duration}s ease-in-out ${delay}s infinite`;
        
        // Add initial transform to make each shape's position slightly different
        const translateX = Math.random() * 20 - 10;
        const translateY = Math.random() * 20 - 10;
        shape.style.transform = `translate(${translateX}px, ${translateY}px)`;
    });

    // Enhanced scroll reveal effect with intersection observer
    // Fix for older browsers that don't support IntersectionObserver
    if ('IntersectionObserver' in window) {
        // Create the observer for all elements
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, { threshold: 0.1 });
        
        // Initial animation for elements above the fold
        const elements = [
            document.querySelector('.landing-title'),
            document.querySelector('.landing-description'),
            document.querySelector('.landing-btn')
        ];
        
        elements.forEach((element, index) => {
            if (element) {
                // Start with the element invisible and translate it up
                element.style.opacity = '0';
                element.style.transform = 'translateY(30px)';
                element.style.transition = `opacity 0.8s ease, transform 0.8s ease`;
                element.style.transitionDelay = `${index * 0.2}s`;
                
                // After a slight delay, make it visible
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, 100);
            }
        });
    } else {
        // Fallback for browsers without IntersectionObserver support
        const elements = [
            document.querySelector('.landing-title'),
            document.querySelector('.landing-description'),
            document.querySelector('.landing-btn')
        ];
        
        elements.forEach((element) => {
            if (element) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Parallax effect for shapes - with performance optimization
    const handleMouseMove = (e) => {
        // Use requestAnimationFrame to limit updates
        if (!window.requestAnimationFrame) return; // Check for support
        
        window.requestAnimationFrame(() => {
            const shapes = document.querySelectorAll('.floating-shape');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const factor = (index + 1) * 20;
                const moveX = (x - 0.5) * factor;
                const moveY = (y - 0.5) * factor;
                
                // Apply parallax movement in addition to regular animation
                shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    };
    
    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }
    
    // Apply debounced event listener for better performance
    document.addEventListener('mousemove', debounce(handleMouseMove, 10));
});
