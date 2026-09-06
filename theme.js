(function() {
    // Apply theme immediately to prevent flashing
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    // Inject toggle button when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        const nav = document.getElementById('main-nav');
        if (!nav) return;

        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle-btn';
        toggleBtn.className = 'btn-borderless-icon'; // Project's icon button class
        toggleBtn.style.display = 'flex';
        toggleBtn.style.alignItems = 'center';
        toggleBtn.style.justifyContent = 'center';
        toggleBtn.style.padding = '0.5rem';
        toggleBtn.style.marginLeft = '0.5rem';
        toggleBtn.style.marginRight = '0.5rem';
        toggleBtn.style.cursor = 'pointer';
        toggleBtn.style.background = 'transparent';
        toggleBtn.style.border = 'none';
        toggleBtn.style.color = 'var(--text-color)';
        toggleBtn.style.transition = 'transform 0.2s, color 0.2s';
        toggleBtn.setAttribute('aria-label', 'Toggle Dark Mode');

        // Add hover effect
        toggleBtn.addEventListener('mouseenter', () => toggleBtn.style.transform = 'scale(1.1)');
        toggleBtn.addEventListener('mouseleave', () => toggleBtn.style.transform = 'scale(1)');

        // Use Lucide SVG directly for reliability
        const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-sun"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>`;
        const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-moon"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`;

        const updateIcon = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            toggleBtn.innerHTML = isDark ? sunIcon : moonIcon;
        };

        updateIcon();

        toggleBtn.addEventListener('click', () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const newTheme = isDark ? 'light' : 'dark';
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateIcon();
        });

        // Place it before the login/register button
        const loginBtn = nav.querySelector('.btn-nav-auth');
        if (loginBtn) {
            nav.insertBefore(toggleBtn, loginBtn);
        } else {
            nav.appendChild(toggleBtn);
        }
    });
})();
