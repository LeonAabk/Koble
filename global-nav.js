document.addEventListener('DOMContentLoaded', () => {
    const nav = document.getElementById('main-nav');
    if (!nav) return;

    // Find the login button
    const loginBtn = nav.querySelector('.btn-nav-auth');
    if (!loginBtn) return;

    // Remove the old nav-user-info if it exists in HTML
    const oldUserInfo = document.getElementById('nav-user-info');
    if (oldUserInfo) {
        oldUserInfo.remove();
    }

    // Ensure supabaseClient is available
    let client = window.supabaseClient;
    if (!client && window.supabase) {
        const SUPABASE_URL = 'https://ogpmuicqbcfyxznxjkto.supabase.co';
        const SUPABASE_ANON_KEY = 'sb_publishable_yBZlKvvzPzBHkQGntQErjQ_uhSC8bKl';
        client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        window.supabaseClient = client;
    }

    if (!client) return;

    // We'll create the user info container
    const userInfoContainer = document.createElement('div');
    userInfoContainer.id = 'nav-user-info';
    userInfoContainer.className = 'hidden';
    userInfoContainer.style.display = 'flex';
    userInfoContainer.style.alignItems = 'center';
    userInfoContainer.style.gap = '1rem';

    // Add Admin link (optional, populated if admin)
    const adminLink = document.createElement('a');
    adminLink.href = 'admin.html';
    adminLink.id = 'nav-admin-btn';
    adminLink.className = 'btn-text hidden';
    adminLink.style.textDecoration = 'none';
    adminLink.textContent = 'Admin';
    userInfoContainer.appendChild(adminLink);

    // Add Min side link
    const profileLink = document.createElement('a');
    // Fix: Use hash navigation if already on the main app page to avoid reload, otherwise route to index.html
    const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
    profileLink.href = isIndexPage ? '#profile' : 'index.html#profile';
    profileLink.id = 'nav-profile-btn';
    profileLink.className = 'btn-text';
    profileLink.style.textDecoration = 'none';
    profileLink.textContent = 'Min side';
    userInfoContainer.appendChild(profileLink);

    // Append user info container after the login button
    loginBtn.parentNode.insertBefore(userInfoContainer, loginBtn.nextSibling);

    const updateNav = (user) => {
        if (user) {
            loginBtn.classList.add('hidden');
            userInfoContainer.classList.remove('hidden');
            if (user.email === 'admin@koble.no') {
                adminLink.classList.remove('hidden');
            } else {
                adminLink.classList.add('hidden');
            }
        } else {
            loginBtn.classList.remove('hidden');
            userInfoContainer.classList.add('hidden');
            adminLink.classList.add('hidden');
        }
    };

    client.auth.onAuthStateChange((event, session) => {
        updateNav(session?.user || null);
    });

    client.auth.getSession().then(({ data: { session } }) => {
        updateNav(session?.user || null);
    });
});
