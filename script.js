// --- Supabase Setup ---
const SUPABASE_URL = 'https://ogpmuicqbcfyxznxjkto.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_yBZlKvvzPzBHkQGntQErjQ_uhSC8bKl';
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

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

const navLoginBtn = document.getElementById('nav-login-btn');
const navUserInfo = document.getElementById('nav-user-info');
const navUserEmail = document.getElementById('nav-user-email');
const navProfileBtn = document.getElementById('nav-profile-btn');

let isLoginMode = true;

// --- Global Constants & Elements ---
// Views
const elLandingSection = document.getElementById('landing-view');
const elEmployerSection = document.getElementById('employer-view');
const elYouthSection = document.getElementById('youth-view');
const elProfileSection = document.getElementById('profile-view');
const elProfileEmailDisplay = document.getElementById('profile-email-display');
const elProfileLogoutBtn = document.getElementById('profile-logout-btn');
const elMainNav = document.getElementById('main-nav');

// Navigation Buttons
const elNavHomeBtn = document.getElementById('nav-home-btn');
const elLogoTitle = document.getElementById('logo-title');
const elYouthRoleBtn = document.getElementById('youth-role-btn');
const elEmployerRoleBtn = document.getElementById('employer-role-btn');

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
const elSearchInput = document.getElementById('search-input');
const elNoJobsMsg = document.getElementById('no-jobs-msg');

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
    isLoginMode = true;
    updateAuthUI();
}

function updateAuthUI() {
    if (isLoginMode) {
        authTitle.textContent = 'Logg inn';
        authSubtitle.textContent = 'Logg inn for å administrere dine oppdrag.';
        authSubmitBtn.textContent = 'Logg inn';
        toggleAuthBtn.textContent = 'Registrer deg';
        toggleAuthBtn.parentElement.childNodes[0].textContent = 'Har du ikke en konto? ';
    } else {
        authTitle.textContent = 'Registrer deg';
        authSubtitle.textContent = 'Opprett en konto for å legge ut oppdrag.';
        authSubmitBtn.textContent = 'Registrer konto';
        toggleAuthBtn.textContent = 'Logg inn';
        toggleAuthBtn.parentElement.childNodes[0].textContent = 'Har du allerede en konto? ';
    }
}

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
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
        if (isLoginMode) {
            const { data, error } = await supabaseClient.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
        } else {
            const { data, error } = await supabaseClient.auth.signUp({
                email,
                password,
            });
            if (error) throw error;
            if (data.user && data.user.identities && data.user.identities.length === 0) {
                 showToast('Kontoen finnes allerede. Prøv å logge inn.', 'error');
                 toggleAuthMode();
                 return;
            }
            showToast('Konto opprettet! Du er nå logget inn.', 'success');
        }
        closeAuthModal();
    } catch (error) {
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
    } else {
        navLoginBtn.classList.remove('hidden');
        navUserInfo.classList.add('hidden');
        navUserEmail.textContent = '';

        // If they are on employer view but logged out, send to home
        if (!elEmployerSection.classList.contains('hidden') || !elProfileSection.classList.contains('hidden')) {
            showHomeView();
        }
    }
}

// Listen for Auth changes
supabaseClient.auth.onAuthStateChange((event, session) => {
    updateNavForUser(session?.user || null);
    if (event === 'SIGNED_IN') {
        showView(elEmployerSection);
        renderMyJobs();
    }
});

// Event Listeners for Auth
navLoginBtn.addEventListener('click', openAuthModal);
closeAuthBtn.addEventListener('click', closeAuthModal);
toggleAuthBtn.addEventListener('click', toggleAuthMode);
authForm.addEventListener('submit', handleAuthSubmit);

navProfileBtn.addEventListener('click', () => {
    showView(elProfileSection);
    elProfileEmailDisplay.textContent = currentUser.email;
});

elProfileLogoutBtn.addEventListener('click', handleLogout);

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
}

function showView(viewElement) {
    hideAllViews();
    viewElement.classList.remove('hidden');
}

function showHomeView() {
    showView(elLandingSection);
}

elNavHomeBtn.addEventListener('click', showHomeView);
elLogoTitle.addEventListener('click', showHomeView);

elYouthRoleBtn.addEventListener('click', () => {
    showView(elYouthSection);
    renderJobs();
});

elEmployerRoleBtn.addEventListener('click', () => {
    if (currentUser) {
        showView(elEmployerSection);
        renderMyJobs();
    } else {
        openAuthModal();
    }
});

// --- Employer Tabs Logic ---
function switchEmployerTab(activeTabBtn, activeSection) {
    elTabPostJob.classList.remove('active-tab');
    elTabMyJobs.classList.remove('active-tab');

    elPostSection.classList.add('hidden');
    elManageSection.classList.add('hidden');

    activeTabBtn.classList.add('active-tab');
    activeSection.classList.remove('hidden');
}

elTabPostJob.addEventListener('click', () => switchEmployerTab(elTabPostJob, elPostSection));
elTabMyJobs.addEventListener('click', () => {
    switchEmployerTab(elTabMyJobs, elManageSection);
    renderMyJobs();
});


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
async function getJobs() {
    const { data, error } = await supabaseClient
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching jobs:', error);
        showToast('Kunne ikke hente oppdrag.', 'error');
        return [];
    }
    return data || [];
}

const elJobPostForm = document.getElementById('job-post-form');

elJobPostForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!currentUser) {
        showToast('Du må være logget inn for å publisere oppdrag.', 'error');
        return;
    }

    const title = document.getElementById('job-title').value;
    const rawDescription = document.getElementById('job-description').value;
    const time = document.getElementById('job-time').value;
    const isGroupFriendly = document.getElementById('job-group-friendly').checked;

    // Combine the time, the description, and the group-friendly tag into one string
    // This allows us to handle the logic without a DB migration
    let description = `Når: ${time}\n\n${rawDescription}`;
    if (isGroupFriendly) {
        description = "[GROUP_FRIENDLY]" + description;
    }

    if (title.length < 5) {
        showToast("Tittelen må være minst 5 tegn lang.", "error");
        return;
    }
    if (rawDescription.length < 10) {
        showToast("Beskrivelsen må være minst 10 tegn.", "error");
        return;
    }

    const submitBtn = elJobPostForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Publiserer...';

    const category = document.getElementById('job-category').value;
    const location = document.getElementById('job-location').value;
    const pay = document.getElementById('job-pay').value;
    const email = currentUser.email;

    const newJob = {
        title,
        category,
        location,
        pay,
        email,
        description,
        user_id: currentUser.id
    };

    try {
        const { error } = await supabaseClient
            .from('jobs')
            .insert([newJob]);

        if (error) throw error;

        elJobPostForm.reset();
        showToast('Oppdraget ble publisert!', 'success');

        switchEmployerTab(elTabMyJobs, elManageSection);
        renderMyJobs();
    } catch (error) {
        console.error('Error saving job:', error);
        showToast('Feil ved lagring av oppdrag.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Publiser jobb';
    }
});


async function renderMyJobs() {
    if (!currentUser) return;

    const { data: myJobs, error } = await supabaseClient
        .from('jobs')
        .select('*')
        .eq('user_id', currentUser.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching my jobs:', error);
        return;
    }

    elMyJobsList.innerHTML = '';

    if (!myJobs || myJobs.length === 0) {
        elNoMyJobsMsg.classList.remove('hidden');
        return;
    } else {
        elNoMyJobsMsg.classList.add('hidden');
    }

    myJobs.forEach(job => {
        const article = document.createElement('article');
        article.classList.add('job-card');

        let badgeClass = 'badge-annet';
        if (job.category === 'Gårdsarbeid') badgeClass = 'badge-gardsarbeid';
        else if (job.category === 'Vedlikehold') badgeClass = 'badge-vedlikehold';
        else if (job.category === 'Hushjelp') badgeClass = 'badge-hushjelp';
        else if (job.category === 'Russedugnad / Gruppearbeid') badgeClass = 'badge-russedugnad';

        // Check for the group-friendly tag and remove it from the display string
        let displayDescription = job.description;
        let isGroupFriendly = false;
        if (displayDescription.startsWith("[GROUP_FRIENDLY]")) {
            isGroupFriendly = true;
            displayDescription = displayDescription.replace("[GROUP_FRIENDLY]", "");
        }

        const d = new Date(job.created_at);
        const formattedDate = d.toLocaleDateString('no-NO');

        article.innerHTML = `
            <h3>${escapeHTML(job.title)}</h3>
            <span class="badge ${badgeClass}">${escapeHTML(job.category)}</span>
            ${isGroupFriendly ? `<span class="badge badge-group-friendly">Passer for grupper</span>` : ''}
            <p class="location"><strong>Sted:</strong> ${escapeHTML(job.location)}</p>
            <p class="date"><em>Lagt ut: ${formattedDate}</em></p>
            <button class="btn btn-danger delete-btn" data-id="${job.id}">Slett oppdrag</button>
        `;

        elMyJobsList.appendChild(article);
    });

    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobId = e.target.getAttribute('data-id');
            deleteJob(jobId);
        });
    });
}

async function deleteJob(jobId) {
    if (confirm('Er du sikker på at du vil slette dette oppdraget?')) {
        try {
            const { error } = await supabaseClient
                .from('jobs')
                .delete()
                .eq('id', jobId);

            if (error) throw error;

            showToast('Oppdraget ble slettet', 'success');
            renderMyJobs();
        } catch (error) {
            console.error('Error deleting job:', error);
            showToast('Kunne ikke slette oppdraget.', 'error');
        }
    }
}

// --- Application Modal Logic ---
const elApplicationModal = document.getElementById('application-modal');
const elCloseModalBtn = document.getElementById('close-modal-btn');
const elModalEmailDisplay = document.getElementById('modal-email-display');
const elCopyEmailBtn = document.getElementById('copy-email-btn');
const elApplicantGroupName = document.getElementById('applicant-group-name');
const elCopyTemplateBtn = document.getElementById('copy-template-btn');

let currentEmailToCopy = '';
let currentJobTitleForTemplate = '';

function openApplicationModal(email, jobTitle) {
    currentEmailToCopy = email;
    currentJobTitleForTemplate = jobTitle;
    elModalEmailDisplay.textContent = email;
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
async function renderJobs() {
    const jobs = await getJobs();
    const selectedFilter = elFilterCategory.value;
    const searchQuery = elSearchInput.value.toLowerCase().trim();

    elJobBoard.innerHTML = '';

    const filteredJobs = jobs.filter(job => {
        const matchesCategory = selectedFilter === 'Alle' || job.category === selectedFilter;
        const matchesSearch = job.title.toLowerCase().includes(searchQuery) ||
                              job.description.toLowerCase().includes(searchQuery);

        return matchesCategory && matchesSearch;
    });

    if (filteredJobs.length === 0) {
        elNoJobsMsg.classList.remove('hidden');
        return;
    } else {
        elNoJobsMsg.classList.add('hidden');
    }

    filteredJobs.forEach(job => {
        const article = document.createElement('article');
        article.classList.add('job-card');

        let badgeClass = 'badge-annet';
        if (job.category === 'Gårdsarbeid') badgeClass = 'badge-gardsarbeid';
        else if (job.category === 'Vedlikehold') badgeClass = 'badge-vedlikehold';
        else if (job.category === 'Hushjelp') badgeClass = 'badge-hushjelp';
        else if (job.category === 'Russedugnad / Gruppearbeid') badgeClass = 'badge-russedugnad';

        let displayDescription = job.description;
        let isGroupFriendly = false;
        if (displayDescription.startsWith("[GROUP_FRIENDLY]")) {
            isGroupFriendly = true;
            displayDescription = displayDescription.replace("[GROUP_FRIENDLY]", "");
        }

        const d = new Date(job.created_at);
        const formattedDate = d.toLocaleDateString('no-NO');

        article.innerHTML = `
            <h3>${escapeHTML(job.title)}</h3>
            <span class="badge ${badgeClass}">${escapeHTML(job.category)}</span>
            ${isGroupFriendly ? `<span class="badge badge-group-friendly">Passer for grupper</span>` : ''}
            <p class="location"><strong>Sted:</strong> ${escapeHTML(job.location)}</p>
            ${job.pay ? `<p class="pay"><strong>Godtgjørelse:</strong> ${escapeHTML(job.pay)}</p>` : ''}
            <p class="date"><em>Lagt ut: ${formattedDate}</em></p>
            <p class="description">${escapeHTML(displayDescription)}</p>
            <button class="btn btn-primary apply-btn" data-email="${escapeHTML(job.email)}" data-title="${escapeHTML(job.title)}">Søk nå</button>
        `;

        elJobBoard.appendChild(article);
    });

    const applyButtons = document.querySelectorAll('.apply-btn');
    applyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const email = e.target.getAttribute('data-email');
            const title = e.target.getAttribute('data-title');
            openApplicationModal(email, title);
        });
    });
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g,
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}

elFilterCategory.addEventListener('change', renderJobs);
elSearchInput.addEventListener('input', renderJobs);

const btnResetFilters = document.getElementById('btn-reset-filters');
if (btnResetFilters) {
    btnResetFilters.addEventListener('click', () => {
        elSearchInput.value = '';
        elFilterCategory.value = 'Alle';
        renderJobs();
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
showHomeView();
