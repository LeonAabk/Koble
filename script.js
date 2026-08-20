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
const calcPersons = document.getElementById('calc-persons');
const calcHours = document.getElementById('calc-hours');
const calcRate = document.getElementById('calc-rate');
const calcTotal = document.getElementById('calc-total');
const agreementSummary = document.getElementById('agreement-summary');
const signatureCanvas = document.getElementById('signature-canvas');
const clearSignatureBtn = document.getElementById('clear-signature-btn');
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
    const persons = parseInt(calcPersons.value) || 0;
    const hours = parseInt(calcHours.value) || 0;
    const rate = parseInt(calcRate.value) || 0;

    const total = persons * hours * rate;
    calcTotal.textContent = total;

    agreementSummary.textContent = `Avtale om dugnadsarbeid

Det er avtalt at ${persons} person(er) skal utføre arbeid i ${hours} time(r) til en timepris på ${rate} NOK.

Total kompensasjon for arbeidet er beregnet til ${total} NOK.`;
}

calcPersons.addEventListener('input', updateCalculatorTotal);
calcHours.addEventListener('input', updateCalculatorTotal);
calcRate.addEventListener('input', updateCalculatorTotal);

// --- Canvas Drawing Logic ---
let isDrawing = false;
let lastX = 0;
let lastY = 0;
const ctx = signatureCanvas ? signatureCanvas.getContext('2d') : null;

if (ctx) {
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000000';

    function getCoordinates(e) {
        const rect = signatureCanvas.getBoundingClientRect();
        if (e.touches && e.touches.length > 0) {
            return {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    function startDrawing(e) {
        isDrawing = true;
        const coords = getCoordinates(e);
        lastX = coords.x;
        lastY = coords.y;
    }

    function draw(e) {
        if (!isDrawing) return;
        e.preventDefault(); // Prevent scrolling on touch

        const coords = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(coords.x, coords.y);
        ctx.stroke();

        lastX = coords.x;
        lastY = coords.y;
    }

    function stopDrawing() {
        isDrawing = false;
    }

    // Mouse events
    signatureCanvas.addEventListener('mousedown', startDrawing);
    signatureCanvas.addEventListener('mousemove', draw);
    signatureCanvas.addEventListener('mouseup', stopDrawing);
    signatureCanvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    signatureCanvas.addEventListener('touchstart', startDrawing);
    signatureCanvas.addEventListener('touchmove', draw, { passive: false });
    signatureCanvas.addEventListener('touchend', stopDrawing);

    // Clear canvas
    if (clearSignatureBtn) {
        clearSignatureBtn.addEventListener('click', () => {
            ctx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
        });
    }
}

// PDF Export Logic
if (downloadPdfBtn && pdfExportArea) {
    downloadPdfBtn.addEventListener('click', () => {
        // Use html2pdf with professional formatting options
        const opt = {
            margin:       1,
            filename:     'Dugnadsavtale_Koble.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  {
                scale: 2,
                onclone: function(clonedDoc) {
                    // html2pdf / html2canvas has an issue with rendering drawn canvas elements natively
                    // Workaround: convert the canvas to an image within the cloned document before rendering
                    const originalCanvas = document.getElementById('signature-canvas');
                    const clonedCanvas = clonedDoc.getElementById('signature-canvas');

                    if (originalCanvas && clonedCanvas) {
                        const img = clonedDoc.createElement('img');
                        img.src = originalCanvas.toDataURL('image/png');
                        img.width = originalCanvas.width;
                        img.height = originalCanvas.height;
                        img.style.border = '1px solid #ccc';
                        img.style.borderRadius = 'var(--radius)';
                        clonedCanvas.parentNode.replaceChild(img, clonedCanvas);
                    }
                }
            },
            jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Ensure html2pdf is loaded from the CDN before invoking
        if (window.html2pdf) {
             html2pdf().set(opt).from(pdfExportArea).save();
        } else {
             console.error('html2pdf library is not loaded.');
        }
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
    // Ensure canvas dimensions match its display size to prevent stretching
    const canvas = document.getElementById('signature-canvas');
    if (canvas) {
        const rect = canvas.getBoundingClientRect();
        if (rect.width > 0) {
            canvas.width = rect.width;

            // Re-apply context styles as setting width resets the context
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.lineWidth = 2;
                ctx.lineCap = 'round';
                ctx.strokeStyle = '#0f172a'; // slate-900
            }
        }
    }
});

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

    const jobData = {
        title,
        category,
        location,
        pay,
        email,
        description,
        user_id: currentUser.id
    };

    try {
        if (editingJobId) {
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

    myJobs.forEach(job => {
        const article = document.createElement('article');
        article.classList.add('job-card');

        let badgeClass = 'badge-annet';
        let catIcon = 'briefcase';
        if (job.category === 'Gårdsarbeid') { badgeClass = 'badge-gardsarbeid'; catIcon = 'tractor'; }
        else if (job.category === 'Vedlikehold') { badgeClass = 'badge-vedlikehold'; catIcon = 'hammer'; }
        else if (job.category === 'Hushjelp') { badgeClass = 'badge-hushjelp'; catIcon = 'home'; }
        else if (job.category === 'Russedugnad / Gruppearbeid') { badgeClass = 'badge-russedugnad'; catIcon = 'users'; }

        // Check for the group-friendly tag and remove it from the display string
        let displayDescription = job.description;
        let isGroupFriendly = false;
        if (displayDescription.startsWith("[GROUP_FRIENDLY]")) {
            isGroupFriendly = true;
            displayDescription = displayDescription.replace("[GROUP_FRIENDLY]", "");
        }

        let employerName = '';
        if (displayDescription.startsWith("[EMPLOYER_NAME]")) {
            const parts = displayDescription.split("\n\n");
            if (parts.length > 0) {
                 employerName = parts[0].replace("[EMPLOYER_NAME]", "");
                 displayDescription = parts.slice(1).join("\n\n");
            }
        }

        const d = new Date(job.created_at);
        const formattedDate = d.toLocaleDateString('no-NO');

        // Check if job is less than 24 hours old
        const isNew = (new Date() - d) < (24 * 60 * 60 * 1000);

        const approvalBadge = job.is_approved
            ? '<span class="badge badge-status-active">✅ Aktiv</span>'
            : '<span class="badge badge-status-pending">⏳ Venter på godkjenning</span>';

        article.innerHTML = `
            <h3>${escapeHTML(job.title)}${isNew ? '<span class="badge badge-new">Ny</span>' : ''}</h3>
            ${approvalBadge}
            <span class="badge ${badgeClass}"><i data-lucide="${catIcon}" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i>${escapeHTML(job.category)}</span>
            ${isGroupFriendly ? `<span class="badge badge-group-friendly">Passer for grupper</span>` : ''}
            ${employerName ? `<p class="employer"><strong>Arbeidsgiver:</strong> ${escapeHTML(employerName)}</p>` : ''}
            <p class="location"><i data-lucide="map-pin" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i><strong>Sted:</strong> ${escapeHTML(job.location)}</p>
            <p class="date"><i data-lucide="calendar" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i><em>Lagt ut: ${formattedDate}</em></p>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn btn-secondary edit-btn" data-id="${job.id}">Rediger</button>
                <button class="btn btn-danger delete-btn" data-id="${job.id}">Slett oppdrag</button>
            </div>
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

    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobId = e.target.getAttribute('data-id');
            const jobToEdit = myJobs.find(j => j.id === jobId);
            if (jobToEdit) editJob(jobToEdit);
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

    let displayDescription = job.description;
    let isGroupFriendly = false;
    if (displayDescription.startsWith("[GROUP_FRIENDLY]")) {
        isGroupFriendly = true;
        displayDescription = displayDescription.replace("[GROUP_FRIENDLY]", "");
    }
    document.getElementById('job-group-friendly').checked = isGroupFriendly;

    let employerName = '';
    if (displayDescription.startsWith("[EMPLOYER_NAME]")) {
        const parts = displayDescription.split("\n\n");
        if (parts.length > 0) {
             employerName = parts[0].replace("[EMPLOYER_NAME]", "");
             displayDescription = parts.slice(1).join("\n\n");
        }
    }
    document.getElementById('job-employer-name').value = employerName;

    // Extract time from the description if it starts with "Når: "
    let time = '';
    let rawDescription = displayDescription;
    if (displayDescription.startsWith("Når: ")) {
        const parts = displayDescription.split("\n\n");
        if (parts.length > 1) {
            time = parts[0].replace("Når: ", "");
            rawDescription = parts.slice(1).join("\n\n");
        } else {
            // fallback if format is slightly off
            time = displayDescription.replace("Når: ", "");
            rawDescription = '';
        }
    }

    document.getElementById('job-time').value = time;
    document.getElementById('job-description').value = rawDescription;

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
async function renderJobs() {
    renderSkeletons(elJobBoard, 4);
    elNoJobsMsg.classList.add('hidden');

    const isAdmin = currentUser && currentUser.email === 'admin@koble.no';
    const jobs = await getJobs(!isAdmin); // Fetch all if admin, else only approved
    const selectedFilter = elFilterCategory.value;
    const selectedLocation = elFilterLocation.value;
    const searchQuery = elSearchInput.value.toLowerCase().trim();

    elJobBoard.innerHTML = '';

    const filteredJobs = jobs.filter(job => {
        const matchesCategory = selectedFilter === 'Alle' || job.category === selectedFilter;
        const matchesLocation = selectedLocation === 'Alle' || job.location === selectedLocation;
        const matchesSearch = job.title.toLowerCase().includes(searchQuery) ||
                              job.description.toLowerCase().includes(searchQuery);

        return matchesCategory && matchesLocation && matchesSearch;
    });

    // Sort logic
    const sortOrder = elFilterSort.value;
    filteredJobs.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === 'oldest' ? dateA - dateB : dateB - dateA;
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
        let catIcon = 'briefcase';
        if (job.category === 'Gårdsarbeid') { badgeClass = 'badge-gardsarbeid'; catIcon = 'tractor'; }
        else if (job.category === 'Vedlikehold') { badgeClass = 'badge-vedlikehold'; catIcon = 'hammer'; }
        else if (job.category === 'Hushjelp') { badgeClass = 'badge-hushjelp'; catIcon = 'home'; }
        else if (job.category === 'Russedugnad / Gruppearbeid') { badgeClass = 'badge-russedugnad'; catIcon = 'users'; }

        let displayDescription = job.description;
        let isGroupFriendly = false;
        if (displayDescription.startsWith("[GROUP_FRIENDLY]")) {
            isGroupFriendly = true;
            displayDescription = displayDescription.replace("[GROUP_FRIENDLY]", "");
        }

        let employerName = '';
        if (displayDescription.startsWith("[EMPLOYER_NAME]")) {
            const parts = displayDescription.split("\n\n");
            if (parts.length > 0) {
                 employerName = parts[0].replace("[EMPLOYER_NAME]", "");
                 displayDescription = parts.slice(1).join("\n\n");
            }
        }

        const d = new Date(job.created_at);
        const formattedDate = d.toLocaleDateString('no-NO');

        // Check if job is less than 24 hours old
        const isNew = (new Date() - d) < (24 * 60 * 60 * 1000);

        let adminActions = '';
        if (isAdmin) {
            adminActions = `
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <span style="font-weight: 600; font-size: 0.9rem; margin-right: auto; align-self: center;">Admin:</span>
                    ${!job.is_approved ? `<button class="btn btn-secondary btn-sm admin-approve-btn" data-id="${job.id}">Godkjenn</button>` : ''}
                    <button class="btn btn-danger btn-sm admin-delete-btn" data-id="${job.id}">Slett</button>
                </div>
            `;
        }

        article.innerHTML = `
            <h3>${escapeHTML(job.title)}${isNew ? '<span class="badge badge-new">Ny</span>' : ''}</h3>
            ${isAdmin && !job.is_approved ? '<span class="badge badge-status-pending">⏳ Venter på godkjenning</span>' : ''}
            <span class="badge ${badgeClass}"><i data-lucide="${catIcon}" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i>${escapeHTML(job.category)}</span>
            ${isGroupFriendly ? `<span class="badge badge-group-friendly">Passer for grupper</span>` : ''}
            ${employerName ? `<p class="employer"><strong>Arbeidsgiver:</strong> ${escapeHTML(employerName)}</p>` : ''}
            <p class="location"><i data-lucide="map-pin" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i><strong>Sted:</strong> ${escapeHTML(job.location)}</p>
            ${job.pay ? `<p class="pay"><strong>Godtgjørelse:</strong> ${escapeHTML(job.pay)}</p>` : ''}
            <p class="date"><i data-lucide="calendar" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i><em>Lagt ut: ${formattedDate}</em></p>
            <p class="description">${escapeHTML(displayDescription)}</p>
            <button class="btn btn-primary apply-btn" data-email="${escapeHTML(job.email)}" data-title="${escapeHTML(job.title)}" data-employer="${escapeHTML(employerName)}"><i data-lucide="send" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i>Søk nå</button>
            ${adminActions}
        `;

        elJobBoard.appendChild(article);
    });

    const applyButtons = document.querySelectorAll('.apply-btn');
    applyButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const email = e.target.getAttribute('data-email');
            const title = e.target.getAttribute('data-title');
            const employer = e.target.getAttribute('data-employer');
            openApplicationModal(email, title, employer);
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
    }

    if (window.lucide) {
        lucide.createIcons();
    }
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

// --- Utility Functions ---
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

elFilterCategory.addEventListener('change', renderJobs);
elFilterLocation.addEventListener('change', renderJobs);
elFilterSort.addEventListener('change', renderJobs);
// ⚡ Bolt: Apply debounce to search input to prevent unnecessary API calls and database hits on every keystroke
elSearchInput.addEventListener('input', debounce(renderJobs, 300));

const btnResetFilters = document.getElementById('btn-reset-filters');
if (btnResetFilters) {
    btnResetFilters.addEventListener('click', () => {
        elSearchInput.value = '';
        elFilterCategory.value = 'Alle';
        elFilterLocation.value = 'Alle';
        elFilterSort.value = 'newest';
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

        tr.innerHTML = `
            <td>${escapeHTML(job.title)}</td>
            <td>${escapeHTML(job.email)}</td>
            <td>${escapeHTML(job.location)}</td>
            <td>${formattedDate}</td>
            <td style="color: ${statusColor}; font-weight: bold;">${statusText}</td>
            <td style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                ${!job.is_approved ? `<button class="btn btn-secondary btn-sm admin-approve-btn" data-id="${job.id}">Godkjenn</button>` : ''}
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
                renderJobs();
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
