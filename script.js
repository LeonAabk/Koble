// --- Supabase Setup ---
const SUPABASE_URL = 'https://ogpmuicqbcfyxznxjkto.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_yBZlKvvzPzBHkQGntQErjQ_uhSC8bKl';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Global Copy Phone Logic ---
document.body.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('.copy-phone-btn');
    if (!targetBtn) return;

    e.preventDefault();

    // Prevent rapid clicking state bug
    if (targetBtn.dataset.copied === 'true') return;

    const phone = targetBtn.getAttribute('data-phone');
    if (!phone) return;

    navigator.clipboard.writeText(phone).then(() => {
        const originalHtml = targetBtn.innerHTML;
        const currentWidth = targetBtn.offsetWidth;

        targetBtn.dataset.copied = 'true';
        targetBtn.style.width = `${currentWidth}px`;
        targetBtn.innerHTML = 'Kopiert! ✅';

        setTimeout(() => {
            targetBtn.innerHTML = originalHtml;
            targetBtn.style.width = '';
            delete targetBtn.dataset.copied;
        }, 2000);
    }).catch(err => {
        console.error("Kunne ikke kopiere tekst: ", err);
        if (typeof showToast === 'function') {
            showToast("Kunne ikke kopiere. Prøv å markere teksten manuelt.", "error");
        } else {
            alert("Kunne ikke kopiere. Prøv å markere teksten manuelt.");
        }
    });
});
// --- Global Copy Mail Logic ---
document.body.addEventListener('click', (e) => {
    const targetBtn = e.target.closest('.copy-mail-btn');
    if (!targetBtn) return;

    e.preventDefault();

    // Prevent rapid clicking state bug
    if (targetBtn.dataset.copied === 'true') return;

    const mail = targetBtn.getAttribute('data-mail');
    if (!mail) return;

    navigator.clipboard.writeText(mail).then(() => {
        const originalHtml = targetBtn.innerHTML;
        const currentWidth = targetBtn.offsetWidth;

        targetBtn.dataset.copied = 'true';
        targetBtn.style.width = `${currentWidth}px`;
        targetBtn.innerHTML = 'Kopiert! ✅';

        setTimeout(() => {
            targetBtn.innerHTML = originalHtml;
            targetBtn.style.width = '';
            delete targetBtn.dataset.copied;
        }, 2000);
    }).catch(err => {
        console.error("Kunne ikke kopiere tekst: ", err);
        if (typeof showToast === 'function') {
            showToast("Kunne ikke kopiere. Prøv å markere teksten manuelt.", "error");
        } else {
            alert("Kunne ikke kopiere. Prøv å markere teksten manuelt.");
        }
    });
});

// --- Auth State ---
let currentUser = null;

// Auth Elements
const authModal = document.getElementById('auth-modal');
const closeAuthBtn = document.getElementById('close-auth-modal-btn');
const authForm = document.getElementById('auth-form');
const authTitle = document.getElementById('auth-title');
const authSubtitle = document.getElementById('auth-subtitle');
const authSubmitBtn = document.getElementById('auth-submit-btn');
const toggleAuthBtn = document.getElementById('toggle-auth-mode-btn');
const authEmail = document.getElementById('auth-email');
const authPassword = document.getElementById('auth-password');
const authError = document.getElementById('auth-error');
const authPasswordGroup = document.getElementById('auth-password-group');
const authOptionsGroup = document.getElementById('auth-options-group');
const forgotPasswordLink = document.getElementById('forgot-password-link');

const navLoginBtn = document.getElementById('nav-login-btn');
const navUserInfo = document.getElementById('nav-user-info');
const navUserEmail = document.getElementById('nav-user-email');
const navProfileBtn = document.getElementById('nav-profile-btn');

let authMode = 'login'; // 'login', 'register', or 'forgotPassword'

// --- Global Constants & Elements ---
// Views
const elLandingSection = document.getElementById('landing-view');
const elEmployerSection = document.getElementById('employer-view');
const elYouthSection = document.getElementById('youth-view');
const elProfileSection = document.getElementById('profile-view');
const elAdminSection = document.getElementById('admin-view');
const elCalculatorSection = document.getElementById('calculator-view');
const elAdminLoginSection = document.getElementById('admin-login-section');
const elAdminDashboardSection = document.getElementById('admin-dashboard-section');
const elProfileEmailDisplay = document.getElementById('profile-email-display');
const elProfileLogoutBtn = document.getElementById('profile-logout-btn');
const elProfileDisplayName = document.getElementById('profile-display-name');
const elProfilePhone = document.getElementById('profile-phone');
const elProfileSaveSettingsBtn = document.getElementById('profile-save-settings-btn');
const elMyWorkersList = document.getElementById('my-worker-profiles-list');
const elNoMyWorkersMsg = document.getElementById('no-my-workers-msg');
const elMainNav = document.getElementById('main-nav');

// Calculator Elements
const calcEmployer = document.getElementById('calc-employer');
const calcWorker = document.getElementById('calc-worker');
const calcTask = document.getElementById('calc-task');
const calcPersons = document.getElementById('calc-persons');
const calcHours = document.getElementById('calc-hours');
const calcRate = document.getElementById('calc-rate');
const calcTotal = document.getElementById('calc-total');

// PDF Elements
const pdfDate = document.getElementById('pdf-date');
const pdfEmployer = document.getElementById('pdf-employer');
const pdfWorker = document.getElementById('pdf-worker');
const pdfTask = document.getElementById('pdf-task');
const pdfPersons = document.getElementById('pdf-persons');
const pdfHours = document.getElementById('pdf-hours');
const pdfRate = document.getElementById('pdf-rate');
const pdfTotal = document.getElementById('pdf-total');

// PDF & Export Elements
const downloadPdfBtn = document.getElementById('download-pdf-btn');
const pdfExportArea = document.getElementById('pdf-export-area');

// Navigation Buttons
const elNavHomeBtn = document.getElementById('nav-home-btn');
const navCalculatorBtn = document.getElementById('nav-calculator-btn');
const elLogoTitle = document.getElementById('logo-title');
const elYouthRoleBtnHero = document.getElementById('youth-role-btn-hero');
const elEmployerRoleBtnHero = document.getElementById('employer-role-btn-hero');
const elWorkerRoleBtnHero = document.getElementById('worker-role-btn-hero');

// Employer Tabs & Sections
const elTabPostJob = document.getElementById('tab-post-job');
const elTabMyJobs = document.getElementById('tab-my-jobs');
const elPostSection = document.getElementById('employer-post-section');
const elManageSection = document.getElementById('employer-manage-section');
const elMyJobsList = document.getElementById('my-jobs-list');
const elNoMyJobsMsg = document.getElementById('no-my-jobs-msg');

// Youth View Elements
const elJobBoard = document.getElementById('job-board');
const elFilterCategory = document.getElementById('filter-category');
const elFilterLocation = document.getElementById('filter-location');
const elFilterSort = document.getElementById('filter-sort');
const elSearchInput = document.getElementById('search-input');
const elNoJobsMsg = document.getElementById('no-jobs-msg');

// Main Youth View Tabs
const elMainTabJobs = document.getElementById('main-tab-jobs');
const elMainTabDugnadsbytte = document.getElementById('main-tab-dugnadsbytte');
const elMainTabWorkers = document.getElementById('main-tab-workers');
const elJobsSection = document.getElementById('jobs-section');
const elDugnadsbytteSection = document.getElementById('dugnadsbytte-section');
const elWorkersSection = document.getElementById('workers-section');
const elWorkerBoard = document.getElementById('worker-board');
const elNoWorkersMsg = document.getElementById('no-workers-msg');
const elDugnadsbytteBoard = document.getElementById('dugnadsbytte-board');
const elNoDugnadsbytteMsg = document.getElementById('no-dugnadsbytte-msg');

// Feed Tabs
const elYouthTabActive = document.getElementById('youth-tab-active');
const elYouthTabFilled = document.getElementById('youth-tab-filled');
const elEmployerTabActive = document.getElementById('employer-tab-active');
const elEmployerTabFilled = document.getElementById('employer-tab-filled');

// Feed Tab State
let currentYouthFeedTab = 'active';
let currentEmployerManageTab = 'active';

// Toast Notification
const elToastNotification = document.getElementById('toast-notification');
const elToastMessage = document.getElementById('toast-message');
let toastTimeout;


// --- Auth Logic ---
function openAuthModal() {
    authModal.classList.remove('hidden');
    resetAuthForm();
}

function closeAuthModal() {
    authModal.classList.add('hidden');
}

function resetAuthForm() {
    authForm.reset();
    authError.classList.add('hidden');
    authError.textContent = '';
    authMode = 'login';
    updateAuthUI();
}

function updateAuthUI() {
    if (authMode === 'login') {
        authTitle.textContent = 'Logg inn';
        authSubtitle.textContent = 'Logg inn for å administrere dine oppdrag.';
        authSubmitBtn.textContent = 'Logg inn';
        toggleAuthBtn.textContent = 'Registrer deg';
        toggleAuthBtn.parentElement.childNodes[0].textContent = 'Har du ikke en konto? ';

        authPasswordGroup.classList.remove('hidden');
        authOptionsGroup.classList.remove('hidden');
        authPassword.required = true;
    } else if (authMode === 'register') {
        authTitle.textContent = 'Registrer deg';
        authSubtitle.textContent = 'Opprett en konto for å legge ut oppdrag.';
        authSubmitBtn.textContent = 'Registrer konto';
        toggleAuthBtn.textContent = 'Logg inn';
        toggleAuthBtn.parentElement.childNodes[0].textContent = 'Har du allerede en konto? ';

        authPasswordGroup.classList.remove('hidden');
        authOptionsGroup.classList.remove('hidden');
        authPassword.required = true;
    } else if (authMode === 'forgotPassword') {
        authTitle.textContent = 'Tilbakestill passord';
        authSubtitle.textContent = 'Skriv inn e-postadressen din, så sender vi deg en lenke for å tilbakestille passordet.';
        authSubmitBtn.textContent = 'Send lenke';
        toggleAuthBtn.textContent = 'Tilbake til logg inn';
        toggleAuthBtn.parentElement.childNodes[0].textContent = 'Husker du passordet ditt? ';

        authPasswordGroup.classList.add('hidden');
        authOptionsGroup.classList.add('hidden');
        authPassword.required = false;
    }
}

function toggleAuthMode() {
    if (authMode === 'forgotPassword') {
        authMode = 'login';
    } else {
        authMode = authMode === 'login' ? 'register' : 'login';
    }
    updateAuthUI();
    authError.classList.add('hidden');
}

async function handleAuthSubmit(e) {
    e.preventDefault();
    const email = authEmail.value;
    const password = authPassword.value;

    authError.classList.add('hidden');
    authSubmitBtn.disabled = true;
    authSubmitBtn.textContent = 'Laster...';

    try {
        if (authMode === 'login') {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            closeAuthModal();
            showHomeView();
        } else if (authMode === 'register') {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
            if (data.user && data.user.identities && data.user.identities.length === 0) {
                 showToast('Kontoen finnes allerede. Prøv å logge inn.', 'error');
                 authMode = 'login';
                 updateAuthUI();
                 return;
            }
            showToast('Konto opprettet! Du er nå logget inn.', 'success');
            closeAuthModal();
            showHomeView();
        } else if (authMode === 'forgotPassword') {
            const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
                redirectTo: window.location.origin + '/oppdater-passord.html'
            });
            if (error) throw error;

            showToast('Sjekk innboksen din! Vi har sendt deg en lenke for å tilbakestille passordet.', 'success');
            authMode = 'login';
            updateAuthUI();
        }
    } catch (error) {
        console.error('Auth error:', error);
        if (error.message.includes('Invalid login')) {
            authError.textContent = 'Feil e-post eller passord.';
        } else if (error.message.includes('rate limit')) {
            authError.textContent = 'For mange forsøk. Vennligst vent litt og prøv igjen.';
        } else {
            authError.textContent = 'En feil oppstod. Prøv igjen.';
        }
        authError.classList.remove('hidden');
    } finally {
        authSubmitBtn.disabled = false;
        updateAuthUI();
    }
}

async function handleLogout() {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
        showToast('Feil ved utlogging', 'error');
    }
}

function updateNavForUser(user) {
    currentUser = user;
    if (user) {
        navLoginBtn.classList.add('hidden');
        navUserInfo.classList.remove('hidden');
        navUserEmail.textContent = user.email;

        // Add Admin link if user is admin
        if (user.email === 'admin@koble.no') {
            if (!document.getElementById('nav-admin-btn')) {
                const adminLink = document.createElement('a');
                adminLink.href = 'admin.html';
                adminLink.id = 'nav-admin-btn';
                adminLink.className = 'btn-text';
                adminLink.style.textDecoration = 'none';
                adminLink.textContent = 'Admin';
                // Insert before 'Min Profil' button
                navUserInfo.insertBefore(adminLink, document.getElementById('nav-profile-btn'));
            }
        } else {
            const adminLink = document.getElementById('nav-admin-btn');
            if (adminLink) {
                adminLink.remove();
            }
        }
    } else {
        const adminLink = document.getElementById('nav-admin-btn');
        if (adminLink) {
            adminLink.remove();
        }
        navLoginBtn.classList.remove('hidden');
        navUserInfo.classList.add('hidden');
        navUserEmail.textContent = '';

        // If they are on employer view but logged out, send to home
        if (!elEmployerSection.classList.contains('hidden') || !elProfileSection.classList.contains('hidden')) {
            showHomeView();
        }
    }

    if (window.location.hash === '#admin') {
        handleRouting();
    }
}

// Listen for Auth changes
supabaseClient.auth.onAuthStateChange((event, session) => {
    updateNavForUser(session?.user || null);
});

// --- Calculator Logic ---
let cachedPdfDateString = null;

function updateCalculatorTotal() {
    const employer = calcEmployer.value.trim() || '[Oppdragsgiver]';
    const worker = calcWorker.value.trim() || '[Utførende part]';
    const task = calcTask.value.trim() || '[Beskrivelse]';
    const persons = parseInt(calcPersons.value) || 0;
    const hours = parseInt(calcHours.value) || 0;
    const rate = parseInt(calcRate.value) || 0;

    const total = persons * hours * rate;

    // Update live calculator total
    calcTotal.textContent = total;

    // Update PDF structured text
    // ⚡ Bolt: Cache expensive Date formatting outside the keystroke loop
    if (!cachedPdfDateString) {
        const today = new Date();
        cachedPdfDateString = today.toLocaleDateString('no-NO', { year: 'numeric', month: 'long', day: 'numeric' });
    }
    if (pdfDate) pdfDate.textContent = `Dato: ${cachedPdfDateString}`;

    if (pdfEmployer) pdfEmployer.textContent = employer;
    if (pdfWorker) pdfWorker.textContent = worker;
    if (pdfTask) pdfTask.textContent = task;

    if (pdfPersons) pdfPersons.textContent = persons;
    if (pdfHours) pdfHours.textContent = hours;
    if (pdfRate) pdfRate.textContent = `${rate} NOK`;
    if (pdfTotal) pdfTotal.textContent = `${total} NOK`;
}

calcEmployer.addEventListener('input', updateCalculatorTotal);
calcWorker.addEventListener('input', updateCalculatorTotal);
calcTask.addEventListener('input', updateCalculatorTotal);
calcPersons.addEventListener('input', updateCalculatorTotal);
calcHours.addEventListener('input', updateCalculatorTotal);
calcRate.addEventListener('input', updateCalculatorTotal);

// PDF Export Logic
if (downloadPdfBtn && pdfExportArea) {
    downloadPdfBtn.addEventListener('click', () => {
        // Inject dynamic data before PDF snapshot
        updateCalculatorTotal();

        // Use native browser print
        window.print();
    });
}

// Event Listeners for Auth
navLoginBtn.addEventListener('click', openAuthModal);
closeAuthBtn.addEventListener('click', closeAuthModal);
toggleAuthBtn.addEventListener('click', toggleAuthMode);

if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        authMode = 'forgotPassword';
        updateAuthUI();
        authError.classList.add('hidden');
    });
}

authForm.addEventListener('submit', handleAuthSubmit);

navProfileBtn.addEventListener('click', () => {
    showView(elProfileSection);
    elProfileEmailDisplay.textContent = currentUser.email;
    elProfileDisplayName.value = localStorage.getItem('koble_display_name') || '';
    elProfilePhone.value = localStorage.getItem('koble_phone') || '';
    fetchAndRenderMyWorkerProfiles();
});

elProfileLogoutBtn.addEventListener('click', handleLogout);

if (elProfileSaveSettingsBtn) {
    elProfileSaveSettingsBtn.addEventListener('click', () => {
        const displayName = elProfileDisplayName.value.trim();
        const phone = elProfilePhone.value.trim();
        localStorage.setItem('koble_display_name', displayName);
        localStorage.setItem('koble_phone', phone);
        showToast('Innstillinger lagret', 'success');
    });
}

authModal.addEventListener('click', (e) => {
    if (e.target === authModal) {
        closeAuthModal();
    }
});

// --- Navigation & View Logic ---
function hideAllViews() {
    elLandingSection.classList.add('hidden');
    elEmployerSection.classList.add('hidden');
    elYouthSection.classList.add('hidden');
    elProfileSection.classList.add('hidden');
    elAdminSection.classList.add('hidden');
    elCalculatorSection.classList.add('hidden');
}

function showView(viewElement) {
    hideAllViews();
    viewElement.classList.remove('hidden');
}

function handleRouting() {
    if (window.location.hash === '#admin') {
        showView(elAdminSection);
        if (currentUser && currentUser.email === 'admin@koble.no') {
            elAdminLoginSection.classList.add('hidden');
            elAdminDashboardSection.classList.remove('hidden');
            renderAdminJobs();
            renderAdminWorkers();
        } else {
            elAdminDashboardSection.classList.add('hidden');
            elAdminLoginSection.classList.remove('hidden');
        }
    } else {
        // default to landing view
        if (!elAdminSection.classList.contains('hidden')) {
             showHomeView();
        }
    }
}

window.addEventListener('hashchange', handleRouting);

function showHomeView() {
    showView(elLandingSection);
}

elNavHomeBtn.addEventListener('click', showHomeView);
elLogoTitle.addEventListener('click', showHomeView);

navCalculatorBtn.addEventListener('click', () => {
    window.location.hash = '';
    showView(elCalculatorSection);
    updateCalculatorTotal(); // initialize date and default text on load
});

elYouthRoleBtnHero.addEventListener('click', () => {
    showView(elYouthSection);
    fetchAndRenderJobs();
    switchYouthMainTab('jobs'); // Default to Jobs tab
    elYouthSection.scrollIntoView({ behavior: 'smooth' });
});

elEmployerRoleBtnHero.addEventListener('click', () => {
    if (currentUser) {
        showView(elEmployerSection);
        fetchAndRenderMyJobs();
    } else {
        openAuthModal();
    }
});

// --- Main Tab Toggle ---
elMainTabJobs.addEventListener('click', () => switchYouthMainTab('jobs'));
elMainTabDugnadsbytte.addEventListener('click', () => switchYouthMainTab('dugnadsbytte'));
elMainTabWorkers.addEventListener('click', () => switchYouthMainTab('workers'));

function switchYouthMainTab(tab) {
    elMainTabJobs.classList.remove('active-tab');
    elMainTabDugnadsbytte.classList.remove('active-tab');
    elMainTabWorkers.classList.remove('active-tab');

    elJobsSection.classList.add('hidden');
    elDugnadsbytteSection.classList.add('hidden');
    elWorkersSection.classList.add('hidden');

    if (tab === 'jobs') {
        elMainTabJobs.classList.add('active-tab');
        elJobsSection.classList.remove('hidden');
    } else if (tab === 'dugnadsbytte') {
        elMainTabDugnadsbytte.classList.add('active-tab');
        elDugnadsbytteSection.classList.remove('hidden');
    } else {
        elMainTabWorkers.classList.add('active-tab');
        elWorkersSection.classList.remove('hidden');
        fetchAndRenderWorkers();
    }
}

// --- My Worker Profiles ---
let currentLoadedMyWorkers = null;

async function fetchAndRenderMyWorkerProfiles() {
    if (!currentUser) return;

    renderSkeletons(elMyWorkersList, 2);

    if (elNoMyWorkersMsg) {
        elNoMyWorkersMsg.classList.add('hidden');
    }

    const { data: myWorkers, error } = await supabaseClient
        .from('worker_profiles')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching my worker profiles:', error);
        return;
    }

    currentLoadedMyWorkers = myWorkers;
    renderMyWorkerProfiles();
}

function renderMyWorkerProfiles() {
    if (!elMyWorkersList) return;

    elMyWorkersList.innerHTML = '';

    if (!currentLoadedMyWorkers || currentLoadedMyWorkers.length === 0) {
        if (elNoMyWorkersMsg) elNoMyWorkersMsg.classList.remove('hidden');
        return;
    } else {
        if (elNoMyWorkersMsg) elNoMyWorkersMsg.classList.add('hidden');
    }

    const fragment = document.createDocumentFragment();

    currentLoadedMyWorkers.forEach(worker => {
        const article = document.createElement('article');
        article.classList.add('worker-card');

        let approvalBadge = '';
        if (!worker.is_approved) {
            approvalBadge = `<span class="badge badge-pending">Venter på godkjenning</span>`;
        }

        const title = worker.title ? escapeHTML(worker.title) : 'Uten tittel';
        const groupType = worker.group_type ? escapeHTML(worker.group_type) : 'Enkeltperson';
        const location = worker.location ? escapeHTML(worker.location) : 'Hamar';
        const desc = worker.description ? escapeHTML(worker.description) : 'Ingen beskrivelse';

        let mailBtn = worker.mail
            ? `<button class="btn btn-primary apply-btn" data-email="${escapeHTML(worker.mail)}" data-title="${title}" data-employer="Min Profil"><i data-lucide="mail"></i> Kontakt</button>`
            : '';

        let phoneBtn = worker.phone_number
            ? `<button type="button" data-phone="${escapeHTML(worker.phone_number)}" class="btn btn-secondary copy-phone-btn"><i data-lucide="phone"></i> Telefon</button>`
            : '';

        article.innerHTML = `
            <div class="card-header">
                <div>
                    <h3 class="card-title">${title}</h3>
                    <div class="card-badges">
                        <span class="badge"><i data-lucide="users"></i> ${groupType}</span>
                        <span class="badge"><i data-lucide="map-pin"></i> ${location}</span>
                        ${approvalBadge}
                    </div>
                </div>
            </div>
            <p class="description">${desc}</p>
            <div class="card-footer" style="flex-wrap: wrap; justify-content: space-between;">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    ${mailBtn}
                    ${phoneBtn}
                </div>
                <div class="card-actions" style="display: flex; gap: 0.5rem;">
                    <button class="btn-borderless-icon edit-worker-btn" data-id="${worker.id}" title="Rediger profil" style="color: var(--primary-color);">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="btn-borderless-icon delete-worker-btn" data-id="${worker.id}" title="Slett profil" style="color: var(--danger-color);">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;

        fragment.appendChild(article);
    });

    elMyWorkersList.appendChild(fragment);

    if (window.lucide) {
        lucide.createIcons();
    }
}

if (elMyWorkersList) {
    elMyWorkersList.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('.delete-worker-btn, .edit-worker-btn');
        if (!targetBtn) return;

        if (targetBtn.classList.contains('delete-worker-btn')) {
            const workerId = targetBtn.getAttribute('data-id');
            if (workerId) deleteWorkerProfile(workerId);
        } else if (targetBtn.classList.contains('edit-worker-btn')) {
            const workerId = targetBtn.getAttribute('data-id');
            if (workerId) openEditWorkerModal(workerId);
        }
    });
}

// --- Worker Profiles ---
async function fetchAndRenderWorkers() {
    renderSkeletons(elWorkerBoard, 3);
    elNoWorkersMsg.classList.add('hidden');

    const isAdmin = currentUser && currentUser.email === 'admin@koble.no';

    let query = supabaseClient
        .from('worker_profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (!isAdmin) {
        if (currentUser) {
            query = query.or(`is_approved.eq.true,user_id.eq.${currentUser.id}`);
        } else {
            query = query.eq('is_approved', true);
        }
    }

    const { data, error } = await query;

    elWorkerBoard.innerHTML = '';

    if (error) {
        console.error("Error fetching workers:", error);
        showToast("Kunne ikke laste arbeidskraft. Prøv igjen senere.", "error");
        return;
    }

    currentLoadedWorkers = data || [];

    if (currentLoadedWorkers.length === 0) {
        elNoWorkersMsg.classList.remove('hidden');
        return;
    }

    const fragment = document.createDocumentFragment();

    // ⚡ Bolt: Cache Intl.DateTimeFormat outside the loop. Reusing a single formatter
    // is significantly faster than implicitly creating one on every .toLocaleDateString() call.
    const workerDateFormatter = new Intl.DateTimeFormat('no-NO', {
        year: 'numeric', month: 'short', day: 'numeric'
    });

    currentLoadedWorkers.forEach(worker => {
        const article = document.createElement('article');
        article.className = 'job-card worker-card';

        let iconName = 'user';
        if (worker.group_type === 'Russegruppe' || worker.group_type === 'Idrettslag') {
            iconName = 'users';
        }

        const workerDate = new Date(worker.created_at);
        const formattedDate = !isNaN(workerDate.getTime()) ? workerDateFormatter.format(workerDate) : 'Ukjent dato';

        // ⚡ Bolt: Escape HTML for user inputs
        const safeTitle = escapeHTML(String(worker.title || ''));
        const safeDesc = escapeHTML(String(worker.description || ''));
        const safeLocation = escapeHTML(String(worker.location || ''));
        const safeGroup = escapeHTML(String(worker.group_type || ''));
        const safePhone = escapeHTML(String(worker.phone_number || ''));
        const safeMail = escapeHTML(String(worker.mail || ''));

        let ownerActions = '';
        if (currentUser && worker.user_id === currentUser.id) {
            ownerActions = `
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; gap: 0.5rem;">
                    <button class="btn btn-secondary btn-sm edit-worker-btn" data-id="${worker.id}">Rediger profil</button>
                    <button class="btn btn-danger btn-sm delete-worker-btn" data-id="${worker.id}">Slett profil</button>
                </div>
            `;
        }

        article.innerHTML = `
            <h3>${safeTitle}</h3>
            <div class="card-badges">
                ${!worker.is_approved ? '<span class="badge badge-status-pending">⏳ Venter på godkjenning</span>' : ''}
                <span class="badge worker-badge"><i data-lucide="${iconName}" style="width: 12px; height: 12px; vertical-align: baseline; margin-right: 4px;"></i>${safeGroup}</span>
            </div>
            <p class="location"><i data-lucide="map-pin" style="width: 14px; height: 14px; vertical-align: text-bottom; margin-right: 4px; color: var(--text-light);"></i><strong>Sted:</strong> ${safeLocation}</p>
            <p class="description" style="color: #4a5568;">${safeDesc}</p>
            <p style="font-size: 0.85rem; color: #a0aec0; margin-bottom: 1rem;">Registrert: ${formattedDate}</p>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${safePhone ? `<button type="button" data-phone="${safePhone}" class="btn btn-sm copy-phone-btn" style="background-color: #e9d8fd; color: #44337a; border: none; cursor: pointer; display: inline-flex; align-items: center;"><i data-lucide="phone" style="width: 14px; height: 14px; vertical-align: text-bottom; margin-right: 4px;"></i>${safePhone}</button>` : ''}
                ${safeMail ? `<button type="button" data-mail="${safeMail}" class="btn btn-sm copy-mail-btn" style="background-color: #ebf8ff; color: #2b6cb0; border: none; cursor: pointer; display: inline-flex; align-items: center;"><i data-lucide="mail" style="width: 14px; height: 14px; vertical-align: text-bottom; margin-right: 4px;"></i>${safeMail}</button>` : ''}
            </div>
            ${ownerActions}
        `;
        fragment.appendChild(article);
    });

    elWorkerBoard.appendChild(fragment);

    lucide.createIcons();
}

// ⚡ Bolt: Use Event Delegation on the parent container to prevent attaching O(n) event listeners
// every time the worker board re-renders, reducing memory allocations and garbage collection overhead.
if (elWorkerBoard) {
    elWorkerBoard.addEventListener('click', (e) => {
        if (!currentUser) return;

        // Traverse up to find the actual button in case the click was on a child element (e.g. an icon)
        const targetBtn = e.target.closest('.delete-worker-btn, .edit-worker-btn');
        if (!targetBtn) return;

        if (targetBtn.classList.contains('delete-worker-btn')) {
            const workerId = targetBtn.getAttribute('data-id');
            if (workerId) deleteWorkerProfile(workerId);
        } else if (targetBtn.classList.contains('edit-worker-btn')) {
            const workerId = targetBtn.getAttribute('data-id');
            if (workerId) openEditWorkerModal(workerId);
        }
    });
}

// --- Employer Tabs Logic ---
function switchEmployerTab(activeTabBtn, activeSection) {
    elTabPostJob.classList.remove('active-tab');
    elTabMyJobs.classList.remove('active-tab');

    elPostSection.classList.add('hidden');
    elManageSection.classList.add('hidden');

    activeTabBtn.classList.add('active-tab');
    activeSection.classList.remove('hidden');
}

elTabPostJob.addEventListener('click', () => {
    switchEmployerTab(elTabPostJob, elPostSection);

    // Pre-fill logic if empty
    const elJobEmployerName = document.getElementById('job-employer-name');
    const elEmployerPhone = document.getElementById('employer-phone');

    if (elJobEmployerName && !elJobEmployerName.value && localStorage.getItem('koble_display_name')) {
        elJobEmployerName.value = localStorage.getItem('koble_display_name');
    }

    if (elEmployerPhone && !elEmployerPhone.value && localStorage.getItem('koble_phone')) {
        elEmployerPhone.value = localStorage.getItem('koble_phone');
    }
});
elTabMyJobs.addEventListener('click', () => {
    switchEmployerTab(elTabMyJobs, elManageSection);
    fetchAndRenderMyJobs();
});

// --- Feed Tabs Logic ---
if (elYouthTabActive && elYouthTabFilled) {
    elYouthTabActive.addEventListener('click', () => {
        currentYouthFeedTab = 'active';
        elYouthTabActive.classList.add('active-tab');
        elYouthTabFilled.classList.remove('active-tab');
        applyFiltersAndRenderJobs();
    });

    elYouthTabFilled.addEventListener('click', () => {
        currentYouthFeedTab = 'filled';
        elYouthTabFilled.classList.add('active-tab');
        elYouthTabActive.classList.remove('active-tab');
        applyFiltersAndRenderJobs();
    });
}

if (elEmployerTabActive && elEmployerTabFilled) {
    elEmployerTabActive.addEventListener('click', () => {
        currentEmployerManageTab = 'active';
        elEmployerTabActive.classList.add('active-tab');
        elEmployerTabFilled.classList.remove('active-tab');
        applyFiltersAndRenderMyJobs();
    });

    elEmployerTabFilled.addEventListener('click', () => {
        currentEmployerManageTab = 'filled';
        elEmployerTabFilled.classList.add('active-tab');
        elEmployerTabActive.classList.remove('active-tab');
        applyFiltersAndRenderMyJobs();
    });
}


// --- Toast Notification Logic ---
function showToast(message, type = 'success') {
    elToastMessage.textContent = message;

    elToastNotification.classList.remove('toast-success', 'toast-error');
    elToastNotification.classList.add(type === 'success' ? 'toast-success' : 'toast-error');

    elToastNotification.classList.remove('hidden');
    elToastNotification.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        elToastNotification.classList.remove('show');
        setTimeout(() => {
            elToastNotification.classList.add('hidden');
        }, 300);
    }, 3000);
}


// --- Database Operations ---
async function getJobs(onlyApproved = true) {
    let query = supabaseClient
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

    // 🛡️ Sentinel: Enforce authorization to prevent non-admins from fetching unapproved jobs
    if (!onlyApproved && (!currentUser || currentUser.email !== 'admin@koble.no')) {
        onlyApproved = true;
    }

    if (onlyApproved) {
        query = query.eq('is_approved', true);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching jobs:', error);
        showToast('Kunne ikke hente oppdrag.', 'error');
        return [];
    }
    return data || [];
}

const elJobPostForm = document.getElementById('job-post-form');
const btnSubmitJob = document.getElementById('btn-submit-job');
const btnCancelEdit = document.getElementById('btn-cancel-edit');
const elJobTitleInput = document.getElementById('job-title');
const elJobCategoryInput = document.getElementById('job-category');
const elDugnadsbytteCheckboxGroup = document.getElementById('dugnadsbytte-checkbox-group');
const elDugnadsbytteConfirmation = document.getElementById('dugnadsbytte-confirmation');

if (elJobCategoryInput) {
    elJobCategoryInput.addEventListener('change', () => {
        if (elJobCategoryInput.value === 'Dugnadsbytte') {
            elDugnadsbytteCheckboxGroup.classList.remove('hidden');
        } else {
            elDugnadsbytteCheckboxGroup.classList.add('hidden');
            elDugnadsbytteConfirmation.checked = false;
        }
    });
}
const elJobDescInput = document.getElementById('job-description');
const elJobTitleError = document.getElementById('job-title-error');
const elJobDescError = document.getElementById('job-description-error');
let editingJobId = null;

elJobTitleInput.addEventListener('input', (e) => {
    if (e.target.value.length > 0 && e.target.value.length < 5) {
        elJobTitleInput.classList.add('input-error');
        elJobTitleError.classList.add('show');
    } else {
        elJobTitleInput.classList.remove('input-error');
        elJobTitleError.classList.remove('show');
    }
});

elJobDescInput.addEventListener('input', (e) => {
    if (e.target.value.length > 0 && e.target.value.length < 10) {
        elJobDescInput.classList.add('input-error');
        elJobDescError.classList.add('show');
    } else {
        elJobDescInput.classList.remove('input-error');
        elJobDescError.classList.remove('show');
    }
});

elJobPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUser) {
        showToast('Du må være logget inn for å publisere oppdrag.', 'error');
        return;
    }

    const title = document.getElementById('job-title').value;
    const employerName = document.getElementById('job-employer-name').value;
    const phoneNumber = document.getElementById('employer-phone').value;
    const rawDescription = document.getElementById('job-description').value;
    const time = document.getElementById('job-time').value;
    const isGroupFriendly = document.getElementById('job-group-friendly').checked;
    const isUrgent = document.getElementById('job-is-urgent').checked;

    // Combine the time, the description, and the group-friendly tag into one string
    // This allows us to handle the logic without a DB migration
    let description = `Når: ${time}\n\n${rawDescription}`;
    if (employerName) {
        description = `[EMPLOYER_NAME]${employerName}\n\n` + description;
    }
    if (isGroupFriendly) {
        description = "[GROUP_FRIENDLY]" + description;
    }

    if (title.length < 5 || title.length > 100) {
        showToast("Tittelen må være mellom 5 og 100 tegn lang.", "error");
        return;
    }
    if (rawDescription.length < 10 || rawDescription.length > 2000) {
        showToast("Beskrivelsen må være mellom 10 og 2000 tegn.", "error");
        return;
    }
    if (employerName.length > 100) {
        showToast("Arbeidsgivernavnet kan ikke være over 100 tegn.", "error");
        return;
    }
    if (phoneNumber && phoneNumber.length > 20) {
        showToast("Telefonnummeret kan ikke være over 20 tegn.", "error");
        return;
    }
    if (time.length > 100) {
        showToast("Tidspunkt kan ikke være over 100 tegn.", "error");
        return;
    }
    const pay = document.getElementById('job-pay').value;
    if (pay.length > 100) {
        showToast("Godtgjørelse kan ikke være over 100 tegn.", "error");
        return;
    }

    const category = document.getElementById('job-category').value;
    const location = document.getElementById('job-location').value;

    if (category === 'Dugnadsbytte' && !elDugnadsbytteConfirmation.checked) {
        showToast('Du må bekrefte at dugnaden kan overtas.', 'error');
        return;
    }

    const submitBtn = elJobPostForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Publiserer...';

    const email = currentUser.email;

    const jobData = {
        title,
        category,
        location,
        pay,
        email,
        description,
        user_id: currentUser.id,
        phone_number: phoneNumber || null,
        is_urgent: isUrgent
    };

    try {
        if (editingJobId) {
            jobData.is_approved = false; // Always return to pending on update
            const { data, error } = await supabaseClient
                .from('jobs')
                .update(jobData)
                .eq('id', editingJobId)
                .eq('user_id', currentUser.id)
                .select();
            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Oppdatering ble avvist av databasen (sannsynligvis manglende rettigheter).");
            }
            showToast('Oppdraget ble oppdatert!', 'success');
        } else {
            const { error } = await supabaseClient
                .from('jobs')
                .insert([jobData]);
            if (error) throw error;
            showToast('Takk! Oppdraget ditt er sendt inn og venter på godkjenning fra en administrator før det blir synlig for andre.', 'success');
        }

        resetJobForm();
        switchEmployerTab(elTabMyJobs, elManageSection);
        fetchAndRenderMyJobs();
    } catch (error) {
        console.error('Error saving job:', error);
        showToast('Feil ved lagring av oppdrag.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = editingJobId ? 'Oppdater jobb' : 'Publiser jobb';
    }
});

function resetJobForm() {
    elJobPostForm.reset();
    document.getElementById('employer-phone').value = '';
    editingJobId = null;
    btnSubmitJob.textContent = 'Publiser jobb';
    btnCancelEdit.classList.add('hidden');

    // Clear validation states
    elJobTitleInput.classList.remove('input-error');
    elJobTitleError.classList.remove('show');
    elJobDescInput.classList.remove('input-error');
    elJobDescError.classList.remove('show');
    const urgentCheckbox = document.getElementById('job-is-urgent');
    if (urgentCheckbox) {
        urgentCheckbox.checked = false;
    }
}

if (btnCancelEdit) {
    btnCancelEdit.addEventListener('click', resetJobForm);
}


function renderSkeletons(container, count = 3) {
    container.innerHTML = '';
    for (let i = 0; i < count; i++) {
        const skeletonCard = document.createElement('article');
        skeletonCard.classList.add('job-card');
        skeletonCard.innerHTML = `
            <h3 class="skeleton skeleton-text" style="width: 50%; height: 1.5rem; margin-bottom: 1rem;"></h3>
            <div class="skeleton skeleton-text" style="width: 20%; height: 1.2rem; display: inline-block; margin-bottom: 1rem;"></div>
            <p class="skeleton skeleton-text"></p>
            <p class="skeleton skeleton-text"></p>
            <p class="skeleton skeleton-text"></p>
        `;
        container.appendChild(skeletonCard);
    }
}

let currentLoadedMyJobs = null;

async function fetchAndRenderMyJobs() {
    if (!currentUser) return;

    renderSkeletons(elMyJobsList, 3);
    elNoMyJobsMsg.classList.add('hidden');

    const { data: myJobs, error } = await supabaseClient
        .from('jobs')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching my jobs:', error);
        return;
    }

    currentLoadedMyJobs = myJobs;
    applyFiltersAndRenderMyJobs();
}

function applyFiltersAndRenderMyJobs() {
    if (!currentLoadedMyJobs) return;

    elMyJobsList.innerHTML = '';

    if (currentLoadedMyJobs.length === 0) {
        elNoMyJobsMsg.classList.remove('hidden');
        return;
    } else {
        elNoMyJobsMsg.classList.add('hidden');
    }

    let jobsToRender = currentLoadedMyJobs;
    if (currentEmployerManageTab === 'active') {
        jobsToRender = jobsToRender.filter(job => job.status !== 'tildelt');
    } else if (currentEmployerManageTab === 'filled') {
        jobsToRender = jobsToRender.filter(job => job.status === 'tildelt');
    }

    if (!jobsToRender || jobsToRender.length === 0) {
        elNoMyJobsMsg.classList.remove('hidden');
        return;
    } else {
        elNoMyJobsMsg.classList.add('hidden');
    }

    // Sort logic
    jobsToRender.sort((a, b) => {
        // Urgent jobs always sort to the top
        if (a.is_urgent && !b.is_urgent) return -1;
        if (!a.is_urgent && b.is_urgent) return 1;
        return a.created_at > b.created_at ? -1 : (a.created_at < b.created_at ? 1 : 0);
    });

    const fragment = document.createDocumentFragment();

    // ⚡ Bolt: Cache current time outside the render loop to avoid repeated Date instantiations
    const now = Date.now();

    // ⚡ Bolt: Cache Intl.DateTimeFormat outside the loop. Reusing a single formatter
    // is significantly faster than implicitly creating one on every .toLocaleDateString() call.
    const dateFormatter = new Intl.DateTimeFormat('no-NO');

    jobsToRender.forEach(job => {
        const article = document.createElement('article');
        article.classList.add('job-card');

        let badgeClass = 'badge-annet';
        let catIcon = 'briefcase';
        if (job.category === 'Gårdsarbeid') { badgeClass = 'badge-gardsarbeid'; catIcon = 'tractor'; }
        else if (job.category === 'Vedlikehold') { badgeClass = 'badge-vedlikehold'; catIcon = 'hammer'; }
        else if (job.category === 'Hushjelp') { badgeClass = 'badge-hushjelp'; catIcon = 'home'; }
        else if (job.category === 'Russedugnad / Gruppearbeid') { badgeClass = 'badge-russedugnad'; catIcon = 'users'; }
        else if (job.category === 'Dugnadsbytte') { badgeClass = 'badge-dugnadsbytte'; catIcon = 'users'; }

        const parsed = parseJobDescription(job.description);

        const d = new Date(job.created_at);
        const formattedDate = !isNaN(d.getTime()) ? dateFormatter.format(d) : 'Ukjent dato';
        const isNew = (now - d.getTime()) < (24 * 60 * 60 * 1000);

        let approvalBadge = '';
        if (job.is_approved) {
            approvalBadge = '<span class="badge badge-status-active">✅ Aktiv</span>';
        } else if (parsed.statusRejected) {
            approvalBadge = '<span class="badge" style="background-color: var(--text-muted); color: white;">Avvist av administrator</span>';
        } else {
            approvalBadge = '<span class="badge badge-status-pending">⏳ Venter på godkjenning</span>';
        }

        let feedbackBox = '';
        if (parsed.statusRejected && parsed.rejectionReason) {
            feedbackBox = `
                <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 1rem; margin-top: 0.5rem; margin-bottom: 0.5rem; border-radius: 4px;">
                    <p style="margin: 0; color: #991b1b; font-weight: 500;">Årsak til avslag: ${escapeHTML(parsed.rejectionReason)}</p>
                </div>
            `;
        }

        let editButtonLabel = parsed.statusRejected ? "Endre og send inn på nytt" : "Rediger";

        let assignButton = '';
        if (job.status === 'tildelt') {
            assignButton = '<button class="btn btn-secondary" disabled>Allerede tildelt</button>';
        } else {
            assignButton = `<button class="btn btn-secondary assign-btn" data-id="${job.id}">Marker som tildelt</button>`;
        }

        article.innerHTML = `
            <h3>${escapeHTML(job.title)}${isNew ? '<span class="badge badge-new">Ny</span>' : ''}</h3>
            <div class="card-badges">
                ${job.is_urgent ? `<span class="badge badge-urgent">🔥 Haster!</span>` : ''}
                ${approvalBadge}
                <span class="badge ${badgeClass}"><i data-lucide="${catIcon}" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i>${escapeHTML(job.category)}</span>
                ${parsed.isGroupFriendly ? `<span class="badge badge-group-friendly">Passer for grupper</span>` : ''}
            </div>
            ${feedbackBox}
            ${parsed.employerName ? `<p class="employer"><strong>Arbeidsgiver:</strong> ${escapeHTML(parsed.employerName)}</p>` : ''}
            ${job.phone_number ? `<div style="margin-bottom: 0.5rem;"><button type="button" class="btn btn-sm copy-phone-btn" data-phone="${escapeHTML(job.phone_number)}" style="background-color: #e9d8fd; color: #44337a; border: none; cursor: pointer; display: inline-flex; align-items: center;"><i data-lucide="phone" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i>${escapeHTML(job.phone_number)}</button></div>` : ''}
            <p class="location"><i data-lucide="map-pin" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i><strong>Sted:</strong> ${escapeHTML(job.location)}</p>
            <p class="date"><i data-lucide="calendar" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i><em>Lagt ut: ${formattedDate}</em></p>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                ${assignButton}
                <button class="btn btn-secondary edit-btn" data-id="${job.id}">${editButtonLabel}</button>
                <button class="btn btn-danger delete-btn" data-id="${job.id}">Slett oppdrag</button>
            </div>
        `;

        fragment.appendChild(article);
    });

    elMyJobsList.appendChild(fragment);

    if (window.lucide) {
        lucide.createIcons();
    }
}

// ⚡ Bolt: Use Event Delegation on the parent container to prevent attaching O(n) event listeners
// every time the "My Jobs" list re-renders, reducing memory allocations and garbage collection overhead.
if (elMyJobsList) {
    elMyJobsList.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('.delete-btn, .edit-btn, .assign-btn');
        if (!targetBtn) return;

        if (targetBtn.classList.contains('delete-btn')) {
            const jobId = targetBtn.getAttribute('data-id');
            if (jobId) deleteJob(jobId);
        } else if (targetBtn.classList.contains('edit-btn')) {
            const jobId = targetBtn.getAttribute('data-id');
            if (jobId && currentLoadedMyJobs) {
                const jobToEdit = currentLoadedMyJobs.find(j => j.id === jobId);
                if (jobToEdit) editJob(jobToEdit);
            }
        } else if (targetBtn.classList.contains('assign-btn')) {
            const jobId = targetBtn.getAttribute('data-id');
            if (jobId) markJobAsFilled(jobId);
        }
    });
}

function editJob(job) {
    editingJobId = job.id;

    document.getElementById('job-title').value = job.title;
    document.getElementById('job-category').value = job.category;
    document.getElementById('job-location').value = job.location;
    document.getElementById('job-pay').value = job.pay || '';
    document.getElementById('employer-phone').value = job.phone_number || '';

    const parsed = parseJobDescription(job.description);

    document.getElementById('job-group-friendly').checked = parsed.isGroupFriendly;
    document.getElementById('job-employer-name').value = parsed.employerName;
    document.getElementById('job-time').value = parsed.time;
    document.getElementById('job-description').value = parsed.rawDescription;

    const urgentCheckbox = document.getElementById('job-is-urgent');
    if (urgentCheckbox) {
        urgentCheckbox.checked = !!job.is_urgent;
    }

    // Trigger validation logic off initial load so it doesn't show errors immediately when editing
    elJobTitleInput.classList.remove('input-error');
    elJobTitleError.classList.remove('show');
    elJobDescInput.classList.remove('input-error');
    elJobDescError.classList.remove('show');

    btnSubmitJob.textContent = 'Oppdater jobb';
    btnCancelEdit.classList.remove('hidden');

    // Switch to the form tab
    switchEmployerTab(elTabPostJob, elPostSection);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteJob(jobId) {
    if (!currentUser) {
        showToast('Du må være logget inn for å slette oppdrag.', 'error');
        return;
    }

    if (confirm('Er du sikker på at du vil slette dette oppdraget?')) {
        try {
            const { data, error } = await supabaseClient
                .from('jobs')
                .delete()
                .eq('id', jobId)
                .eq('user_id', currentUser.id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Sletting ble avvist av databasen (sannsynligvis manglende rettigheter).");
            }

            showToast('Oppdraget ble slettet', 'success');
            fetchAndRenderMyJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
            showToast('Kunne ikke slette oppdraget.', 'error');
        }
    }
}

async function markJobAsFilled(jobId) {
    if (!currentUser) {
        showToast('Du må være logget inn for å oppdatere oppdrag.', 'error');
        return;
    }

    if (confirm('Er du sikker på at du vil markere dette oppdraget som tildelt? Det vil ikke lenger være mulig å søke på det.')) {
        try {
            // Memory: When editing or resubmitting an existing job post from the frontend, always explicitly set is_approved: false
            const { data, error } = await supabaseClient
                .from('jobs')
                .update({ status: 'tildelt', is_approved: false })
                .eq('id', jobId)
                .eq('user_id', currentUser.id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Oppdatering ble avvist av databasen (sannsynligvis manglende rettigheter).");
            }

            showToast('Oppdraget ble markert som tildelt og sendt til godkjenning', 'success');
            fetchAndRenderMyJobs();
        } catch (error) {
            console.error('Error marking job as filled:', error);
            showToast('Kunne ikke markere oppdraget som tildelt.', 'error');
        }
    }
}

// --- Application Modal Logic ---
const elApplicationModal = document.getElementById('application-modal');
const elCloseModalBtn = document.getElementById('close-modal-btn');
const elModalEmailDisplay = document.getElementById('modal-email-display');
const elModalEmployerDisplay = document.getElementById('modal-employer-display');
const elCopyEmailBtn = document.getElementById('copy-email-btn');
const elApplicantGroupName = document.getElementById('applicant-group-name');
const elCopyTemplateBtn = document.getElementById('copy-template-btn');

let currentEmailToCopy = '';
let currentJobTitleForTemplate = '';

function openApplicationModal(email, jobTitle, employerName) {
    currentEmailToCopy = email;
    currentJobTitleForTemplate = jobTitle;
    elModalEmailDisplay.textContent = email;
    if (elModalEmployerDisplay) {
        elModalEmployerDisplay.textContent = employerName || 'Ukjent';
    }
    elApplicantGroupName.value = ''; // Reset the input
    elApplicationModal.classList.remove('hidden');
}

function closeApplicationModal() {
    elApplicationModal.classList.add('hidden');
    currentEmailToCopy = '';
    currentJobTitleForTemplate = '';
}

elCloseModalBtn.addEventListener('click', closeApplicationModal);

elApplicationModal.addEventListener('click', (e) => {
    if (e.target === elApplicationModal) {
        closeApplicationModal();
    }
});

elCopyEmailBtn.addEventListener('click', () => {
    if (!currentEmailToCopy) return;

    navigator.clipboard.writeText(currentEmailToCopy).then(() => {
        showToast("E-postadresse kopiert!", "success");
    }).catch(err => {
        console.error("Kunne ikke kopiere tekst: ", err);
        showToast("Kunne ikke kopiere. Prøv å markere teksten manuelt.", "error");
    });
});

elCopyTemplateBtn.addEventListener('click', () => {
    if (!currentJobTitleForTemplate) return;

    const groupName = elApplicantGroupName.value.trim();
    let template = "";

    if (groupName) {
        template = `Hei!\n\nVi er ${groupName}, og vi vil gjerne søke på oppdraget "${currentJobTitleForTemplate}".\n\nVi er en arbeidsvillig gjeng som gjerne tar i et tak. Vi har mulighet til å stille med [ANTALL] personer og kan jobbe [LEGG INN NÅR DERE KAN].\n\nHåper å høre fra deg!\n\nMed vennlig hilsen,\n${groupName}`;
    } else {
        template = `Hei!\n\nJeg vil gjerne søke på oppdraget "${currentJobTitleForTemplate}".\n\nJeg er en arbeidsvillig og ansvarsfull person som gjerne vil hjelpe til med dette. Jeg har mulighet til å jobbe [LEGG INN NÅR DU KAN].\n\nHåper å høre fra deg!\n\nMed vennlig hilsen,\n[DITT NAVN]`;
    }

    navigator.clipboard.writeText(template).then(() => {
        showToast("E-postmal kopiert!", "success");
    }).catch(err => {
        console.error("Kunne ikke kopiere tekst: ", err);
        showToast("Kunne ikke kopiere. Prøv å markere teksten manuelt.", "error");
    });
});


// --- Youth Features (Browsing, Searching & Filtering Jobs) ---
let currentLoadedJobs = null;
let currentLoadedWorkers = null;

async function fetchAndRenderJobs() {
    renderSkeletons(elJobBoard, 4);
    elNoJobsMsg.classList.add('hidden');

    const isAdmin = currentUser && currentUser.email === 'admin@koble.no';
    currentLoadedJobs = await getJobs(!isAdmin); // Fetch all if admin, else only approved
    const now = Date.now();

    // ⚡ Bolt: Pre-compute lowercased search strings to avoid repetitive string allocation and garbage collection overhead during frequent filtering
    // ⚡ Bolt: Also pre-compute parsing and Date calculations to prevent expensive work in render loops
    // ⚡ Bolt: Cache Intl.DateTimeFormat outside the loop. Reusing a single formatter
    // is significantly faster than implicitly creating one on every .toLocaleDateString() call.
    const dateFormatter = new Intl.DateTimeFormat('no-NO');

    currentLoadedJobs.forEach(job => {
        job._searchTitle = String(job.title || '').toLowerCase();
        job._searchDescription = String(job.description || '').toLowerCase();

        job._parsed = parseJobDescription(job.description);

        const d = new Date(job.created_at);
        job._formattedDate = !isNaN(d.getTime()) ? dateFormatter.format(d) : 'Ukjent dato';
        job._isNew = (now - d.getTime()) < (24 * 60 * 60 * 1000);
    });

    applyFiltersAndRenderJobs();
}

function applyFiltersAndRenderJobs() {
    if (!currentLoadedJobs) return;

    const isAdmin = currentUser && currentUser.email === 'admin@koble.no';
    const selectedFilter = elFilterCategory.value;
    const selectedLocation = elFilterLocation.value;
    const searchQuery = elSearchInput.value.toLowerCase().trim();

    elJobBoard.innerHTML = '';

    const filteredJobs = currentLoadedJobs.filter(job => {
        if (currentYouthFeedTab === 'active' && job.status === 'tildelt') return false;
        if (currentYouthFeedTab === 'filled' && job.status !== 'tildelt') return false;

        if (selectedFilter !== 'Alle' && job.category !== selectedFilter) return false;
        if (selectedLocation !== 'Alle' && job.location !== selectedLocation) return false;
        if (!searchQuery) return true;

        return job._searchTitle.includes(searchQuery) ||
               job._searchDescription.includes(searchQuery);
    });

    // Sort logic
    const sortOrder = elFilterSort.value;
    filteredJobs.sort((a, b) => {
        // Urgent jobs always sort to the top, regardless of date sorting
        if (a.is_urgent && !b.is_urgent) return -1;
        if (!a.is_urgent && b.is_urgent) return 1;

        // ISO-8601 strings sort correctly lexicographically, avoiding expensive Date parsing overhead
        if (sortOrder === 'oldest') {
            return a.created_at < b.created_at ? -1 : (a.created_at > b.created_at ? 1 : 0);
        } else {
            return a.created_at > b.created_at ? -1 : (a.created_at < b.created_at ? 1 : 0);
        }
    });

    if (filteredJobs.length === 0) {
        elNoJobsMsg.classList.remove('hidden');
        return;
    } else {
        elNoJobsMsg.classList.add('hidden');
    }

    const fragment = document.createDocumentFragment();

    // Fallback formatter initialized outside the loop in case _formattedDate is missing
    const fallbackFormatter = new Intl.DateTimeFormat('no-NO');

    const jobsFragment = document.createDocumentFragment();
    const dugnadsbytteFragment = document.createDocumentFragment();
    let hasJobs = false;
    let hasDugnadsbytte = false;

    if (elDugnadsbytteBoard) elDugnadsbytteBoard.innerHTML = '';

    filteredJobs.forEach(job => {
        const article = document.createElement('article');
        article.classList.add('job-card');

        let badgeClass = 'badge-annet';
        let catIcon = 'briefcase';
        if (job.category === 'Gårdsarbeid') { badgeClass = 'badge-gardsarbeid'; catIcon = 'tractor'; }
        else if (job.category === 'Vedlikehold') { badgeClass = 'badge-vedlikehold'; catIcon = 'hammer'; }
        else if (job.category === 'Hushjelp') { badgeClass = 'badge-hushjelp'; catIcon = 'home'; }
        else if (job.category === 'Russedugnad / Gruppearbeid') { badgeClass = 'badge-russedugnad'; catIcon = 'users'; }
        else if (job.category === 'Dugnadsbytte') { badgeClass = 'badge-dugnadsbytte'; catIcon = 'users'; }

        const parsed = job._parsed || parseJobDescription(job.description);
        let displayDescription = parsed.rawDescription;
        if (parsed.time) {
             displayDescription = `Når: ${parsed.time}\n\n${displayDescription}`;
        }
        let isGroupFriendly = parsed.isGroupFriendly;
        let employerName = parsed.employerName;

        // Fallback for missing pre-computed formatting (if direct update bypasses fetchAndRenderJobs)
        let formattedDate = job._formattedDate;
        if (!formattedDate) {
            const fallbackDate = new Date(job.created_at);
            formattedDate = !isNaN(fallbackDate.getTime()) ? fallbackFormatter.format(fallbackDate) : 'Ukjent dato';
        }

        // Check if job is less than 24 hours old
        const isNew = job._isNew !== undefined ? job._isNew : (new Date() - new Date(job.created_at)) < (24 * 60 * 60 * 1000);

        let adminActions = '';
        if (isAdmin) {
            let isRejected = false;
            if (job.description && String(job.description).includes("[STATUS:REJECTED]")) {
                isRejected = true;
            }
            adminActions = `
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <span style="font-weight: 600; font-size: 0.9rem; margin-right: auto; align-self: center;">Admin:</span>
                    ${!job.is_approved ? `<button class="btn btn-secondary btn-sm admin-approve-btn" data-id="${job.id}">Godkjenn</button>` : ''}
                    ${!isRejected ? `<button class="btn btn-danger btn-sm admin-reject-btn" data-id="${job.id}">Avvis</button>` : ''}
                    <button class="btn btn-danger btn-sm admin-delete-btn" data-id="${job.id}">Slett</button>
                </div>
            `;
        }

        let isFilled = job.status === 'tildelt';
        if (isFilled) {
            article.classList.add('job-card-filled');
        }

        article.innerHTML = `
            ${isFilled ? '<span class="badge badge-filled">Oppdraget er tildelt 🔒</span>' : ''}
            <h3>${escapeHTML(job.title)}${isNew && !isFilled ? '<span class="badge badge-new">Ny</span>' : ''}</h3>
            <div class="card-badges">
                ${job.is_urgent && !isFilled ? `<span class="badge badge-urgent">🔥 Haster!</span>` : ''}
                ${isAdmin && !job.is_approved ? '<span class="badge badge-status-pending">⏳ Venter på godkjenning</span>' : ''}
                <span class="badge ${badgeClass}"><i data-lucide="${catIcon}" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i>${escapeHTML(job.category)}</span>
                ${isGroupFriendly ? `<span class="badge badge-group-friendly">Passer for grupper</span>` : ''}
            </div>
            ${employerName ? `<p class="employer"><strong>Arbeidsgiver:</strong> ${escapeHTML(employerName)}</p>` : ''}
            ${job.phone_number && !isFilled ? `<div style="margin-bottom: 0.5rem;"><button type="button" class="btn btn-sm copy-phone-btn" data-phone="${escapeHTML(job.phone_number)}" style="background-color: #e9d8fd; color: #44337a; border: none; cursor: pointer; display: inline-flex; align-items: center;"><i data-lucide="phone" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i>${escapeHTML(job.phone_number)}</button></div>` : ''}
            <p class="location"><i data-lucide="map-pin" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i><strong>Sted:</strong> ${escapeHTML(job.location)}</p>
            ${job.pay ? `<p class="pay"><strong>Godtgjørelse:</strong> ${escapeHTML(job.pay)}</p>` : ''}
            <p class="date"><i data-lucide="calendar" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i><em>Lagt ut: ${formattedDate}</em></p>
            <p class="description">${escapeHTML(displayDescription)}</p>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                ${!isFilled ? `<button class="btn btn-primary apply-btn" data-email="${escapeHTML(job.email)}" data-title="${escapeHTML(job.title)}" data-employer="${escapeHTML(employerName)}"><i data-lucide="send" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i>Søk nå</button>` : ''}
                <button class="btn btn-outline share-btn" data-title="${escapeHTML(job.title)}" data-employer="${escapeHTML(employerName)}" data-location="${escapeHTML(job.location)}"><i data-lucide="share-2" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i>Del</button>
            </div>
            ${adminActions}
        `;

        if (job.category === 'Dugnadsbytte') {
            dugnadsbytteFragment.appendChild(article);
            hasDugnadsbytte = true;
        } else {
            jobsFragment.appendChild(article);
            hasJobs = true;
        }
    });

    if (!hasJobs) {
        elNoJobsMsg.classList.remove('hidden');
    } else {
        elNoJobsMsg.classList.add('hidden');
    }

    if (elNoDugnadsbytteMsg) {
        if (!hasDugnadsbytte) {
            elNoDugnadsbytteMsg.classList.remove('hidden');
        } else {
            elNoDugnadsbytteMsg.classList.add('hidden');
        }
    }

    elJobBoard.appendChild(jobsFragment);
    if (elDugnadsbytteBoard) elDugnadsbytteBoard.appendChild(dugnadsbytteFragment);

    if (window.lucide) {
        lucide.createIcons();
    }
}

// ⚡ Bolt: Use Event Delegation on the parent container to prevent attaching O(n) event listeners
// every time the job board re-renders (which happens often due to debounced search),
// reducing memory allocations and garbage collection overhead.
if (elJobBoard) {
    elJobBoard.addEventListener('click', async (e) => {
        const targetBtn = e.target.closest('.apply-btn, .share-btn, .admin-delete-btn, .admin-approve-btn, .admin-reject-btn');
        if (!targetBtn) return;

        if (targetBtn.classList.contains('apply-btn')) {
            const email = targetBtn.getAttribute('data-email');
            const title = targetBtn.getAttribute('data-title');
            const employer = targetBtn.getAttribute('data-employer');
            openApplicationModal(email, title, employer);
        } else if (targetBtn.classList.contains('share-btn')) {
            const title = targetBtn.getAttribute('data-title') || '';
            const employer = targetBtn.getAttribute('data-employer') || '';
            const location = targetBtn.getAttribute('data-location') || '';

            let shareText = title;
            if (employer) {
                shareText += ` for ${employer}`;
            }
            if (location) {
                shareText += ` i ${location}`;
            }

            const shareData = {
                title: "Sjekk ut dette oppdraget på Koble!",
                text: shareText,
                url: window.location.origin
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.error("Error sharing:", err);
                }
            } else {
                // Fallback
                const fallbackText = `${shareData.text} ${shareData.url}`;
                try {
                    await navigator.clipboard.writeText(fallbackText);
                    alert('Lenken er kopiert!');
                } catch (err) {
                    console.error("Kunne ikke kopiere tekst: ", err);
                    alert('Kunne ikke kopiere lenken. Prøv å dele manuelt.');
                }
            }
        } else if (currentUser && currentUser.email === 'admin@koble.no') {
            // Admin Actions
            if (targetBtn.classList.contains('admin-delete-btn')) {
                const jobId = targetBtn.getAttribute('data-id');
                if (jobId) deleteAdminJob(jobId);
            } else if (targetBtn.classList.contains('admin-approve-btn')) {
                const jobId = targetBtn.getAttribute('data-id');
                if (jobId) approveAdminJob(jobId);
            } else if (targetBtn.classList.contains('admin-reject-btn')) {
                const jobId = targetBtn.getAttribute('data-id');
                if (jobId && currentLoadedJobs) {
                    const job = currentLoadedJobs.find(j => j.id === jobId);
                    if (job) rejectAdminJob(jobId, job.description);
                }
            }
        }
    });
}

// ⚡ Bolt: Extract mapping to a constant to prevent object re-instantiation on every character match in the .replace() callback, reducing GC overhead.
const HTML_ESCAPE_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
};

function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, tag => HTML_ESCAPE_MAP[tag]);
}

// --- Utility Functions ---

function parseJobDescription(rawString) {
    let result = {
        isGroupFriendly: false,
        employerName: '',
        statusRejected: false,
        rejectionReason: '',
        time: '',
        rawDescription: String(rawString || '')
    };

    if (!result.rawDescription) return result;

    if (result.rawDescription.includes("[STATUS:REJECTED]")) {
        result.statusRejected = true;
        result.rawDescription = result.rawDescription.replace("[STATUS:REJECTED]\n\n", "").replace("[STATUS:REJECTED]", "");
    }

    const reasonMatch = result.rawDescription.match(/\[REASON:(.*?)\](?:\n\n)?/);
    if (reasonMatch) {
        result.rejectionReason = reasonMatch[1];
        result.rawDescription = result.rawDescription.replace(reasonMatch[0], "");
    }

    if (result.rawDescription.includes("[GROUP_FRIENDLY]")) {
        result.isGroupFriendly = true;
        result.rawDescription = result.rawDescription.replace("[GROUP_FRIENDLY]", "");
    }

    if (result.rawDescription.startsWith("[EMPLOYER_NAME]")) {
        const parts = result.rawDescription.split("\n\n");
        if (parts.length > 0) {
            result.employerName = parts[0].replace("[EMPLOYER_NAME]", "");
            result.rawDescription = parts.slice(1).join("\n\n");
        }
    }

    if (result.rawDescription.startsWith("Når: ")) {
        const parts = result.rawDescription.split("\n\n");
        if (parts.length > 1) {
            result.time = parts[0].replace("Når: ", "");
            result.rawDescription = parts.slice(1).join("\n\n");
        } else {
            result.time = result.rawDescription.replace("Når: ", "");
            result.rawDescription = '';
        }
    }

    return result;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

elFilterCategory.addEventListener('change', applyFiltersAndRenderJobs);
elFilterLocation.addEventListener('change', applyFiltersAndRenderJobs);
elFilterSort.addEventListener('change', applyFiltersAndRenderJobs);
// ⚡ Bolt: Apply debounce to search input to prevent unnecessary API calls and database hits on every keystroke
elSearchInput.addEventListener('input', debounce(applyFiltersAndRenderJobs, 300));

const btnResetFilters = document.getElementById('btn-reset-filters');
if (btnResetFilters) {
    btnResetFilters.addEventListener('click', () => {
        elSearchInput.value = '';
        elFilterCategory.value = 'Alle';
        elFilterLocation.value = 'Alle';
        elFilterSort.value = 'newest';
        applyFiltersAndRenderJobs();
    });
}

const btnCreateFirstJob = document.getElementById('btn-create-first-job');
if (btnCreateFirstJob) {
    btnCreateFirstJob.addEventListener('click', () => {
        document.getElementById('tab-post-job').click();
    });
}

// Check initial session
supabaseClient.auth.getSession().then(({ data: { session } }) => {
    updateNavForUser(session?.user || null);
});

// Initialize
handleRouting();

// --- Admin Authentication Logic ---
const adminAuthForm = document.getElementById('admin-auth-form');
const adminAuthEmail = document.getElementById('admin-auth-email');
const adminAuthPassword = document.getElementById('admin-auth-password');
const adminAuthSubmitBtn = document.getElementById('admin-auth-submit-btn');
const adminAuthError = document.getElementById('admin-auth-error');

if (adminAuthForm) {
    adminAuthForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        adminAuthError.classList.add('hidden');
        adminAuthSubmitBtn.disabled = true;
        adminAuthSubmitBtn.textContent = 'Logger inn...';

        try {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email: adminAuthEmail.value,
                password: adminAuthPassword.value
            });

            if (error) throw error;

            // Login successful
            adminAuthForm.reset();
            handleRouting(); // Will route to dashboard since currentUser will be populated by onAuthStateChange or session check
        } catch (error) {
            console.error('Admin login error:', error);
            adminAuthError.textContent = 'Feil e-post eller passord.';
            adminAuthError.classList.remove('hidden');
        } finally {
            adminAuthSubmitBtn.disabled = false;
            adminAuthSubmitBtn.textContent = 'Logg inn';
        }
    });
}

// --- Admin Moderation Dashboard ---
async function renderAdminJobs() {
    // 🛡️ Sentinel: Enforce client-side authorization to prevent admin UI rendering for unauthorized users
    if (!currentUser || currentUser.email !== 'admin@koble.no') return;

    const adminTableBody = document.getElementById('admin-jobs-table-body');
    if (!adminTableBody) return;

    adminTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Laster oppdrag...</td></tr>';

    const jobs = await getJobs(false); // Fetch ALL jobs for admin, regardless of approval status

    adminTableBody.innerHTML = '';

    if (jobs.length === 0) {
        adminTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Ingen oppdrag funnet.</td></tr>';
        return;
    }

    const fragment = document.createDocumentFragment();

    // ⚡ Bolt: Cache Intl.DateTimeFormat outside the loop. Reusing a single formatter
    // is significantly faster than implicitly creating one on every .toLocaleDateString() call.
    const dateFormatter = new Intl.DateTimeFormat('no-NO');

    jobs.forEach(job => {
        const tr = document.createElement('tr');
        const d = new Date(job.created_at);
        const formattedDate = !isNaN(d.getTime()) ? dateFormatter.format(d) : 'Ukjent dato';
        const statusText = job.is_approved ? 'Godkjent' : 'Venter';
        const statusColor = job.is_approved ? 'var(--success-color)' : '#d97706'; // warning orange

        let isRejected = false;
        if (job.description && String(job.description).includes("[STATUS:REJECTED]")) {
            isRejected = true;
        }

        let finalStatusText = statusText;
        let finalStatusColor = statusColor;

        if (isRejected) {
            finalStatusText = 'Avvist';
            finalStatusColor = 'var(--text-muted)';
        }

        tr.innerHTML = `
            <td>${job.is_urgent ? '🔥 ' : ''}${escapeHTML(job.title)}</td>
            <td>${escapeHTML(job.email)}</td>
            <td>${escapeHTML(job.location)}</td>
            <td>${formattedDate}</td>
            <td style="color: ${finalStatusColor}; font-weight: bold;">${finalStatusText}</td>
            <td style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${!job.is_approved ? `<button class="btn btn-secondary btn-sm admin-approve-btn" data-id="${job.id}">Godkjenn</button>` : ''}
                ${!isRejected ? `<button class="btn btn-danger btn-sm admin-reject-btn" data-id="${job.id}" data-desc="${escapeHTML(job.description)}">Avvis</button>` : ''}
                <button class="btn btn-danger btn-sm admin-delete-btn" data-id="${job.id}">Slett</button>
            </td>
        `;
        fragment.appendChild(tr);
    });

    adminTableBody.appendChild(fragment);

    const deleteButtons = adminTableBody.querySelectorAll('.admin-delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobId = e.target.getAttribute('data-id');
            deleteAdminJob(jobId);
        });
    });

    const approveButtons = adminTableBody.querySelectorAll('.admin-approve-btn');
    approveButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobId = e.target.getAttribute('data-id');
            approveAdminJob(jobId);
        });
    });

    const rejectButtons = adminTableBody.querySelectorAll('.admin-reject-btn');
    rejectButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobId = e.target.getAttribute('data-id');
            // use unescapeHTML to get original description back if it has quotes, though simpler to just get from job object.
            const job = jobs.find(j => j.id === jobId);
            if (job) rejectAdminJob(jobId, job.description);
        });
    });

    if (window.lucide) {
        lucide.createIcons();
    }
}

async function deleteAdminJob(jobId) {
    if (!currentUser || currentUser.email !== 'admin@koble.no') {
        showToast('Ingen tilgang', 'error');
        return;
    }

    if (confirm('ADVARSEL: Er du sikker på at du vil permanent slette dette oppdraget som administrator?')) {
        try {
            // Deliberately omitting the user_id check to allow admin deletion
            const { data, error } = await supabaseClient
                .from('jobs')
                .delete()
                .eq('id', jobId)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Sletting ble avvist av databasen (sannsynligvis manglende RLS-policy for admin).");
            }

            showToast('Oppdraget ble slettet', 'success');
            renderAdminJobs(); // Refresh table

            // If they are deleting from the public feed, refresh that too
            if (!elYouthSection.classList.contains('hidden')) {
                fetchAndRenderJobs();
            }
        } catch (error) {
            console.error('Error deleting job as admin:', error);
            showToast('Kunne ikke slette oppdraget.', 'error');
        }
    }
}

async function approveAdminJob(jobId) {
    if (!currentUser || currentUser.email !== 'admin@koble.no') {
        showToast('Ingen tilgang', 'error');
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('jobs')
            .update({ is_approved: true })
            .eq('id', jobId)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            throw new Error("Godkjenning ble avvist av databasen (sannsynligvis manglende RLS-policy for admin).");
        }

        showToast('Oppdraget ble godkjent og er nå offentlig.', 'success');
        renderAdminJobs(); // Refresh table
    } catch (error) {
        console.error('Error approving job as admin:', error);
        showToast('Kunne ikke godkjenne oppdraget.', 'error');
    }
}


async function rejectAdminJob(jobId, currentDescription) {
    if (!currentUser || currentUser.email !== 'admin@koble.no') {
        showToast('Ingen tilgang', 'error');
        return;
    }

    const reason = prompt("Vennligst oppgi en årsak for avvisning:");
    if (reason === null) return; // User cancelled
    if (reason.trim() === "") {
        showToast("Årsak må fylles ut.", "error");
        return;
    }
    if (reason.length > 500) {
        showToast("Årsaken kan ikke være over 500 tegn.", "error");
        return;
    }

    const newDescription = `[STATUS:REJECTED]\n\n[REASON:${reason.trim()}]\n\n${currentDescription}`;

    try {
        const { data, error } = await supabaseClient
            .from('jobs')
            .update({ is_approved: false, description: newDescription })
            .eq('id', jobId)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            throw new Error("Avvisning ble avvist av databasen (sannsynligvis manglende RLS-policy for admin).");
        }

        showToast('Oppdraget ble avvist og sendt tilbake til bruker.', 'success');

        if (!elAdminDashboardSection.classList.contains('hidden')) {
            renderAdminJobs(); // Refresh table
        } else if (!elYouthSection.classList.contains('hidden')) {
            fetchAndRenderJobs();
        }
    } catch (error) {
        console.error('Error rejecting job as admin:', error);
        showToast('Kunne ikke avvise oppdraget.', 'error');
    }
}

// --- Worker Profile Management ---
async function deleteWorkerProfile(workerId) {
    if (!currentUser) {
        showToast('Du må være logget inn for å slette profilen din.', 'error');
        return;
    }

    if (confirm('Er du sikker på at du vil slette denne profilen?')) {
        try {
            const { data, error } = await supabaseClient
                .from('worker_profiles')
                .delete()
                .eq('id', workerId)
                .eq('user_id', currentUser.id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Sletting ble avvist av databasen (sannsynligvis manglende rettigheter).");
            }

            showToast('Profilen ble slettet', 'success');
            fetchAndRenderWorkers(); // Refresh feed
            fetchAndRenderMyWorkerProfiles(); // Refresh Min Profil
        } catch (error) {
            console.error('Error deleting worker profile:', error);
            showToast('Kunne ikke slette profilen: ' + error.message, 'error');
        }
    }
}

const elEditWorkerModal = document.getElementById('edit-worker-modal');
const elCloseEditWorkerModalBtn = document.getElementById('close-edit-worker-modal-btn');
const elEditWorkerForm = document.getElementById('edit-worker-form');

if (elCloseEditWorkerModalBtn) {
    elCloseEditWorkerModalBtn.addEventListener('click', () => {
        elEditWorkerModal.classList.add('hidden');
    });
}

function openEditWorkerModal(workerId) {
    const worker = (currentLoadedWorkers && currentLoadedWorkers.find(w => w.id === workerId || w.id === Number(workerId)))
                   || (currentLoadedMyWorkers && currentLoadedMyWorkers.find(w => w.id === workerId || w.id === Number(workerId)));
    if (!worker) return;

    document.getElementById('edit-worker-id').value = worker.id;
    document.getElementById('edit-worker-title').value = worker.title || '';
    document.getElementById('edit-worker-group-type').value = worker.group_type || 'Enkeltperson';
    document.getElementById('edit-worker-location').value = worker.location || 'Hamar';
    document.getElementById('edit-worker-description').value = worker.description || '';
    document.getElementById('edit-worker-email').value = worker.mail || '';
    document.getElementById('edit-worker-phone').value = worker.phone_number || '';

    elEditWorkerModal.classList.remove('hidden');
}

if (elEditWorkerForm) {
    elEditWorkerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const workerId = document.getElementById('edit-worker-id').value;
        const btnSubmit = document.getElementById('btn-submit-edit-worker');

        if (!currentUser) {
            showToast('Du må være logget inn for å redigere.', 'error');
            return;
        }

        btnSubmit.disabled = true;
        btnSubmit.textContent = 'Lagrer...';

        const title = document.getElementById('edit-worker-title').value.trim();
        const description = document.getElementById('edit-worker-description').value.trim();
        const mail = document.getElementById('edit-worker-email').value.trim();
        const phone_number = document.getElementById('edit-worker-phone').value.trim();

        if (title.length > 100) {
            showToast("Overskrift kan ikke være over 100 tegn.", "error");
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Lagre Endringer (Send til ny godkjenning)';
            return;
        }
        if (description.length > 2000) {
            showToast("Beskrivelsen kan ikke være over 2000 tegn.", "error");
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Lagre Endringer (Send til ny godkjenning)';
            return;
        }
        if (mail.length > 100) {
            showToast("E-post kan ikke være over 100 tegn.", "error");
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Lagre Endringer (Send til ny godkjenning)';
            return;
        }
        if (phone_number.length > 20) {
            showToast("Telefonnummer kan ikke være over 20 tegn.", "error");
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Lagre Endringer (Send til ny godkjenning)';
            return;
        }

        const payload = {
            title: title,
            group_type: document.getElementById('edit-worker-group-type').value,
            location: document.getElementById('edit-worker-location').value,
            description: description,
            mail: mail,
            phone_number: phone_number,
            is_approved: false
        };

        try {
            const { data, error } = await supabaseClient
                .from('worker_profiles')
                .update(payload)
                .eq('id', workerId)
                .eq('user_id', currentUser.id)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Oppdatering ble avvist (sannsynligvis manglende rettigheter).");
            }

            showToast('Profilen ble oppdatert og sendt til godkjenning.', 'success');
            elEditWorkerModal.classList.add('hidden');
            fetchAndRenderWorkers(); // Refresh
            fetchAndRenderMyWorkerProfiles(); // Refresh Min Profil
        } catch (error) {
            console.error('Error updating worker profile:', error);
            showToast('Kunne ikke oppdatere profilen: ' + error.message, 'error');
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Lagre Endringer (Send til ny godkjenning)';
        }
    });
}

// --- Admin Workers Dashboard ---
async function renderAdminWorkers() {
    // 🛡️ Sentinel: Enforce client-side authorization to prevent admin UI rendering for unauthorized users
    if (!currentUser || currentUser.email !== 'admin@koble.no') return;

    const adminWorkersTableBody = document.getElementById('admin-workers-table-body');
    if (!adminWorkersTableBody) return;

    adminWorkersTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Laster profiler...</td></tr>';

    const { data: workers, error } = await supabaseClient
        .from('worker_profiles')
        .select('*')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

    adminWorkersTableBody.innerHTML = '';

    if (error) {
        console.error('Error fetching workers for admin:', error);
        adminWorkersTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: red;">Kunne ikke laste inn profiler.</td></tr>';
        return;
    }

    if (!workers || workers.length === 0) {
        adminWorkersTableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Ingen arbeidskraftprofiler funnet.</td></tr>';
        return;
    }

    const fragment = document.createDocumentFragment();

    // ⚡ Bolt: Cache Intl.DateTimeFormat outside the loop. Reusing a single formatter
    // is significantly faster than implicitly creating one on every .toLocaleDateString() call.
    const dateFormatter = new Intl.DateTimeFormat('no-NO');

    workers.forEach(worker => {
        const tr = document.createElement('tr');
        const d = new Date(worker.created_at);
        const formattedDate = !isNaN(d.getTime()) ? dateFormatter.format(d) : 'Ukjent dato';

        let statusHtml = '';
        if (worker.is_approved) {
            statusHtml = '<span class="badge badge-filled">Godkjent</span>';
        } else {
            statusHtml = '<span class="badge badge-status-pending" style="background-color: var(--warning-color); color: white;">Venter på godkjenning</span>';
        }

        tr.innerHTML = `
            <td><strong>${escapeHTML(worker.title || '')}</strong></td>
            <td>${escapeHTML(worker.mail || '')}</td>
            <td>${escapeHTML(worker.group_type || '')}</td>
            <td>${formattedDate}</td>
            <td>${statusHtml}</td>
            <td>
                ${!worker.is_approved ? `<button class="btn btn-secondary btn-sm admin-approve-worker-btn" data-id="${worker.id}">Godkjenn</button>` : ''}
                <button class="btn btn-danger btn-sm admin-delete-worker-btn" data-id="${worker.id}">Slett</button>
            </td>
        `;
        fragment.appendChild(tr);
    });

    adminWorkersTableBody.appendChild(fragment);

    const deleteButtons = adminWorkersTableBody.querySelectorAll('.admin-delete-worker-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const workerId = e.target.getAttribute('data-id');
            deleteAdminWorker(workerId);
        });
    });

    const approveButtons = adminWorkersTableBody.querySelectorAll('.admin-approve-worker-btn');
    approveButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const workerId = e.target.getAttribute('data-id');
            approveAdminWorker(workerId);
        });
    });
}

async function approveAdminWorker(workerId) {
    if (!currentUser || currentUser.email !== 'admin@koble.no') {
        showToast('Kun administratorer kan godkjenne profiler.', 'error');
        return;
    }

    try {
        const { data, error } = await supabaseClient
            .from('worker_profiles')
            .update({ is_approved: true })
            .eq('id', workerId)
            .select();

        if (error) throw error;
        if (!data || data.length === 0) {
            throw new Error("Godkjenning ble avvist (manglende admin-rettigheter?).");
        }

        showToast('Profilen ble godkjent.', 'success');
        renderAdminWorkers(); // Refresh admin table
        if (!elWorkersSection.classList.contains('hidden')) {
            fetchAndRenderWorkers(); // Refresh public feed if open
        }
    } catch (error) {
        console.error('Error approving worker profile as admin:', error);
        showToast('Kunne ikke godkjenne profilen.', 'error');
    }
}

async function deleteAdminWorker(workerId) {
    if (!currentUser || currentUser.email !== 'admin@koble.no') {
        showToast('Ingen tilgang.', 'error');
        return;
    }

    if (confirm('ADVARSEL: Er du sikker på at du vil permanent slette denne profilen som administrator?')) {
        try {
            const { data, error } = await supabaseClient
                .from('worker_profiles')
                .delete()
                .eq('id', workerId)
                .select();

            if (error) throw error;
            if (!data || data.length === 0) {
                throw new Error("Sletting ble avvist av databasen (sannsynligvis manglende RLS-policy for admin).");
            }

            showToast('Profilen ble slettet', 'success');
            renderAdminWorkers(); // Refresh table
            if (!elWorkersSection.classList.contains('hidden')) {
                fetchAndRenderWorkers(); // Refresh public feed if open
            }
        } catch (error) {
            console.error('Error deleting worker profile as admin:', error);
            showToast('Kunne ikke slette profilen: ' + error.message, 'error');
        }
    }
}
