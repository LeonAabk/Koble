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
const elAdminSection = document.getElementById('admin-view');
const elCalculatorSection = document.getElementById('calculator-view');
const elAdminLoginSection = document.getElementById('admin-login-section');
const elAdminDashboardSection = document.getElementById('admin-dashboard-section');
const elProfileEmailDisplay = document.getElementById('profile-email-display');
const elProfileLogoutBtn = document.getElementById('profile-logout-btn');
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
const elFilterLocation = document.getElementById('filter-location');
const elFilterSort = document.getElementById('filter-sort');
const elSearchInput = document.getElementById('search-input');
const elNoJobsMsg = document.getElementById('no-jobs-msg');

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
        showView(elEmployerSection);
        renderMyJobs();
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

    if (window.location.hash === '#admin') {
        handleRouting();
    }
}

// Listen for Auth changes
supabaseClient.auth.onAuthStateChange((event, session) => {
    updateNavForUser(session?.user || null);
});

// --- Calculator Logic ---
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
    const today = new Date();
    const dateString = today.toLocaleDateString('no-NO', { year: 'numeric', month: 'long', day: 'numeric' });
    if (pdfDate) pdfDate.textContent = `Dato: ${dateString}`;

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
        if (!window.html2pdf) {
            console.error('html2pdf library is not loaded.');
            return;
        }

        // 1. Clone the Content
        const clonedContent = pdfExportArea.cloneNode(true);

        // Hide UI buttons from final PDF
        const btns = clonedContent.querySelectorAll('button');
        btns.forEach(btn => btn.style.display = 'none');

        // Remove box-shadow and border-radius from elements to strip web CSS
        clonedContent.style.boxShadow = 'none';
        clonedContent.style.borderRadius = '0';
        clonedContent.style.margin = '0';
        clonedContent.style.padding = '0';

        const allElements = clonedContent.querySelectorAll('*');
        allElements.forEach(el => {
            el.style.boxShadow = 'none';
            el.style.borderRadius = '0';
        });

        // 2. Create a Temporary Print Container
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'absolute';
        tempContainer.style.top = '-9999px';
        tempContainer.style.left = '-9999px';
        tempContainer.style.width = '210mm';
        tempContainer.style.background = 'white';
        tempContainer.style.color = 'black';

        // 3. Strip Web CSS
        tempContainer.style.display = 'block';
        tempContainer.style.padding = '20mm';
        tempContainer.style.boxShadow = 'none';
        tempContainer.style.borderRadius = '0';

        tempContainer.appendChild(clonedContent);
        document.body.appendChild(tempContainer);

        const opt = {
            margin:       0, // Handled by the container's padding instead
            filename:     'Koble-Avtale.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true, windowWidth: 794 }, // 794px is A4 width at 96 DPI
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // 4 & 5. Generate & Clean Up
        html2pdf().set(opt).from(tempContainer).save().then(() => {
            tempContainer.remove();
        }).catch(err => {
            console.error('PDF Generation failed', err);
            tempContainer.remove();
        });
    });
}

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

elYouthRoleBtn.addEventListener('click', () => {
    showView(elYouthSection);
    fetchAndRenderJobs();
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
        renderMyJobs();
    });

    elEmployerTabFilled.addEventListener('click', () => {
        currentEmployerManageTab = 'filled';
        elEmployerTabFilled.classList.add('active-tab');
        elEmployerTabActive.classList.remove('active-tab');
        renderMyJobs();
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
    if (time.length > 100) {
        showToast("Tidspunkt kan ikke være over 100 tegn.", "error");
        return;
    }
    const pay = document.getElementById('job-pay').value;
    if (pay.length > 100) {
        showToast("Godtgjørelse kan ikke være over 100 tegn.", "error");
        return;
    }

    const submitBtn = elJobPostForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Publiserer...';

    const category = document.getElementById('job-category').value;
    const location = document.getElementById('job-location').value;
    const email = currentUser.email;

    const jobData = {
        title,
        category,
        location,
        pay,
        email,
        description,
        user_id: currentUser.id,
        phone_number: phoneNumber || null
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
        renderMyJobs();
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

async function renderMyJobs() {
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

    elMyJobsList.innerHTML = '';

    if (!myJobs || myJobs.length === 0) {
        elNoMyJobsMsg.classList.remove('hidden');
        return;
    } else {
        elNoMyJobsMsg.classList.add('hidden');
    }

    let jobsToRender = myJobs;
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

    const fragment = document.createDocumentFragment();

    // ⚡ Bolt: Cache current time outside the render loop to avoid repeated Date instantiations
    const now = Date.now();

    jobsToRender.forEach(job => {
        const article = document.createElement('article');
        article.classList.add('job-card');

        let badgeClass = 'badge-annet';
        let catIcon = 'briefcase';
        if (job.category === 'Gårdsarbeid') { badgeClass = 'badge-gardsarbeid'; catIcon = 'tractor'; }
        else if (job.category === 'Vedlikehold') { badgeClass = 'badge-vedlikehold'; catIcon = 'hammer'; }
        else if (job.category === 'Hushjelp') { badgeClass = 'badge-hushjelp'; catIcon = 'home'; }
        else if (job.category === 'Russedugnad / Gruppearbeid') { badgeClass = 'badge-russedugnad'; catIcon = 'users'; }

        const parsed = parseJobDescription(job.description);

        const d = new Date(job.created_at);
        const formattedDate = d.toLocaleDateString('no-NO');
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
            ${approvalBadge}
            ${feedbackBox}
            <div style="margin-top: 0.5rem; margin-bottom: 0.5rem;">
                <span class="badge ${badgeClass}"><i data-lucide="${catIcon}" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i>${escapeHTML(job.category)}</span>
                ${parsed.isGroupFriendly ? `<span class="badge badge-group-friendly">Passer for grupper</span>` : ''}
            </div>
            ${parsed.employerName ? `<p class="employer"><strong>Arbeidsgiver:</strong> ${escapeHTML(parsed.employerName)}</p>` : ''}
            ${job.phone_number ? `<p class="phone"><i data-lucide="phone" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i><strong>Telefon:</strong> ${escapeHTML(job.phone_number)}</p>` : ''}
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

    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobId = e.target.getAttribute('data-id');
            deleteJob(jobId);
        });
    });

    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobId = e.target.getAttribute('data-id');
            const jobToEdit = myJobs.find(j => j.id === jobId);
            if (jobToEdit) editJob(jobToEdit);
        });
    });

    const assignButtons = document.querySelectorAll('.assign-btn');
    assignButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobId = e.target.getAttribute('data-id');
            markJobAsFilled(jobId);
        });
    });

    if (window.lucide) {
        lucide.createIcons();
    }
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
            renderMyJobs();
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
            renderMyJobs();
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

async function fetchAndRenderJobs() {
    renderSkeletons(elJobBoard, 4);
    elNoJobsMsg.classList.add('hidden');

    const isAdmin = currentUser && currentUser.email === 'admin@koble.no';
    currentLoadedJobs = await getJobs(!isAdmin); // Fetch all if admin, else only approved
    const now = Date.now();

    // ⚡ Bolt: Pre-compute lowercased search strings to avoid repetitive string allocation and garbage collection overhead during frequent filtering
    // ⚡ Bolt: Also pre-compute parsing and Date calculations to prevent expensive work in render loops
    currentLoadedJobs.forEach(job => {
        job._searchTitle = String(job.title || '').toLowerCase();
        job._searchDescription = String(job.description || '').toLowerCase();

        job._parsed = parseJobDescription(job.description);

        const d = new Date(job.created_at);
        job._formattedDate = d.toLocaleDateString('no-NO');
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

    filteredJobs.forEach(job => {
        const article = document.createElement('article');
        article.classList.add('job-card');

        let badgeClass = 'badge-annet';
        let catIcon = 'briefcase';
        if (job.category === 'Gårdsarbeid') { badgeClass = 'badge-gardsarbeid'; catIcon = 'tractor'; }
        else if (job.category === 'Vedlikehold') { badgeClass = 'badge-vedlikehold'; catIcon = 'hammer'; }
        else if (job.category === 'Hushjelp') { badgeClass = 'badge-hushjelp'; catIcon = 'home'; }
        else if (job.category === 'Russedugnad / Gruppearbeid') { badgeClass = 'badge-russedugnad'; catIcon = 'users'; }

        const parsed = job._parsed || parseJobDescription(job.description);
        let displayDescription = parsed.rawDescription;
        if (parsed.time) {
             displayDescription = `Når: ${parsed.time}\n\n${displayDescription}`;
        }
        let isGroupFriendly = parsed.isGroupFriendly;
        let employerName = parsed.employerName;

        const formattedDate = job._formattedDate || new Date(job.created_at).toLocaleDateString('no-NO');

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
            ${isAdmin && !job.is_approved ? '<span class="badge badge-status-pending">⏳ Venter på godkjenning</span>' : ''}
            <span class="badge ${badgeClass}"><i data-lucide="${catIcon}" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i>${escapeHTML(job.category)}</span>
            ${isGroupFriendly ? `<span class="badge badge-group-friendly">Passer for grupper</span>` : ''}
            ${employerName ? `<p class="employer"><strong>Arbeidsgiver:</strong> ${escapeHTML(employerName)}</p>` : ''}
            ${job.phone_number && !isFilled ? `<p class="phone"><i data-lucide="phone" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i><strong>Telefon:</strong> ${escapeHTML(job.phone_number)}</p>` : ''}
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

        fragment.appendChild(article);
    });

    elJobBoard.appendChild(fragment);

    const applyButtons = document.querySelectorAll('.apply-btn');
    applyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const email = e.target.getAttribute('data-email');
            const title = e.target.getAttribute('data-title');
            const employer = e.target.getAttribute('data-employer');
            openApplicationModal(email, title, employer);
        });
    });

    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            // Traverse up to find the button in case the click was on the icon
            const targetBtn = e.target.closest('.share-btn');
            if (!targetBtn) return;

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
        });
    });

    if (isAdmin) {
        const deleteButtons = elJobBoard.querySelectorAll('.admin-delete-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-id');
                deleteAdminJob(jobId);
            });
        });

        const approveButtons = elJobBoard.querySelectorAll('.admin-approve-btn');
        approveButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-id');
                approveAdminJob(jobId);
            });
        });

        const rejectButtons = elJobBoard.querySelectorAll('.admin-reject-btn');
        rejectButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-id');
                const job = filteredJobs.find(j => j.id === jobId);
                if (job) rejectAdminJob(jobId, job.description);
            });
        });
    }

    if (window.lucide) {
        lucide.createIcons();
    }
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
        rawDescription: rawString || ''
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

    jobs.forEach(job => {
        const tr = document.createElement('tr');
        const d = new Date(job.created_at);
        const formattedDate = d.toLocaleDateString('no-NO');
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
            <td>${escapeHTML(job.title)}</td>
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
