/**
 * Koble - Main Application Logic
 *
 * This file handles the Single Page Application (SPA) routing,
 * local storage management, and DOM manipulation for both
 * the Employer (posting jobs) and Youth (browsing jobs) views.
 */

// --- 1. DOM Elements ---
// We grab references to all the HTML elements we need to interact with.
// Prefixing with 'el' helps us remember these are DOM elements.
const elLandingView = document.getElementById('landing-view');
const elEmployerView = document.getElementById('employer-view');
const elYouthView = document.getElementById('youth-view');
const elMainNav = document.getElementById('main-nav');

const btnEmployerRole = document.getElementById('employer-role-btn');
const btnYouthRole = document.getElementById('youth-role-btn');
const btnNavHome = document.getElementById('nav-home-btn');

// --- 2. State & Routing (SPA Logic) ---
// A Single Page Application works by hiding and showing sections of the page
// rather than loading completely new HTML files. This makes it fast.

/**
 * Hides all main views.
 * We use the '.hidden' utility class defined in our CSS (`display: none`).
 */
function hideAllViews() {
    elLandingView.classList.add('hidden');
    elEmployerView.classList.add('hidden');
    elYouthView.classList.add('hidden');
}

/**
 * Shows the Landing / Home view.
 */
function showHomeView() {
    hideAllViews();
    elLandingView.classList.remove('hidden');
    elMainNav.classList.add('hidden'); // Hide the home button when already home
}

/**
 * Shows the Employer view (where they can post jobs).
 */
function showEmployerView() {
    hideAllViews();
    elEmployerView.classList.remove('hidden');
    elMainNav.classList.remove('hidden'); // Show navigation to get back home
}

/**
 * Shows the Youth view (where they can browse jobs).
 */
function showYouthView() {
    hideAllViews();
    elYouthView.classList.remove('hidden');
    elMainNav.classList.remove('hidden'); // Show navigation to get back home

    // Every time we show the youth view, we should re-render the jobs
    // to ensure they are up to date.
    renderJobs();
}

// Attach Event Listeners for Navigation
btnNavHome.addEventListener('click', showHomeView);
btnEmployerRole.addEventListener('click', showEmployerView);
btnYouthRole.addEventListener('click', showYouthView);


// --- 3. Local Storage Management ---
// Since we don't have a backend database for the MVP, we use the browser's
// built-in `localStorage`. It saves data as strings. We must convert our
// JavaScript Arrays to JSON strings when saving, and parse them back when reading.

const STORAGE_KEY = 'koble_jobs';

/**
 * Fetches all jobs from localStorage.
 * @returns {Array} An array of job objects.
 */
function getJobs() {
    const jobsJSON = localStorage.getItem(STORAGE_KEY);
    // If there are no jobs yet, return an empty array
    if (!jobsJSON) {
        return [];
    }
    // Convert the string back into a usable JavaScript array of objects
    return JSON.parse(jobsJSON);
}

/**
 * Saves the current array of jobs back to localStorage.
 * @param {Array} jobs - The array of job objects to save.
 */
function saveJobs(jobs) {
    const jobsJSON = JSON.stringify(jobs);
    localStorage.setItem(STORAGE_KEY, jobsJSON);
}

// --- Next Steps will be added here (Employer & Youth Logic) ---

// --- Toast Notification Logic ---
const elToastNotification = document.getElementById('toast-notification');
const elToastMessage = document.getElementById('toast-message');
let toastTimeout;

/**
 * Displays a global toast notification.
 * @param {string} message - The text to display.
 * @param {string} type - 'success' or 'error'.
 */
function showToast(message, type = 'success') {
    // Clear any existing timeout so we don't hide prematurely if clicked rapidly
    if (toastTimeout) clearTimeout(toastTimeout);

    // Set message and styling
    elToastMessage.textContent = message;
    if (type === 'error') {
        elToastNotification.classList.add('toast-error');
    } else {
        elToastNotification.classList.remove('toast-error');
    }

    // Show the toast
    elToastNotification.classList.remove('hidden');

    // Hide after 3.5 seconds
    toastTimeout = setTimeout(() => {
        elToastNotification.classList.add('hidden');
    }, 3500);
}

// --- 4. Employer Features (Posting Jobs) ---

const elJobPostForm = document.getElementById('job-post-form');
const elTabPostJob = document.getElementById('tab-post-job');
const elTabMyJobs = document.getElementById('tab-my-jobs');
const elEmployerPostSection = document.getElementById('employer-post-section');
const elEmployerManageSection = document.getElementById('employer-manage-section');
const elMyJobsList = document.getElementById('my-jobs-list');
const elNoMyJobsMsg = document.getElementById('no-my-jobs-msg');

const MY_JOBS_STORAGE_KEY = 'koble_my_job_ids';

/**
 * Gets the array of job IDs created by this device.
 */
function getMyJobIds() {
    const idsJSON = localStorage.getItem(MY_JOBS_STORAGE_KEY);
    return idsJSON ? JSON.parse(idsJSON) : [];
}

/**
 * Saves the array of job IDs created by this device.
 */
function saveMyJobIds(ids) {
    localStorage.setItem(MY_JOBS_STORAGE_KEY, JSON.stringify(ids));
}

// --- Employer Tab Switching Logic ---

elTabPostJob.addEventListener('click', () => {
    elTabPostJob.classList.add('active-tab');
    elTabMyJobs.classList.remove('active-tab');
    elEmployerPostSection.classList.remove('hidden');
    elEmployerManageSection.classList.add('hidden');
});

elTabMyJobs.addEventListener('click', () => {
    elTabMyJobs.classList.add('active-tab');
    elTabPostJob.classList.remove('active-tab');
    elEmployerManageSection.classList.remove('hidden');
    elEmployerPostSection.classList.add('hidden');
    renderMyJobs(); // Refresh the list when opening the tab
});


/**
 * Handles the submission of the job posting form.
 * We prevent the default form submission to handle it via JavaScript.
 */
function handleJobSubmission(event) {
    // Prevent the browser from refreshing the page (default form behavior)
    event.preventDefault();

    // 1. Gather data from the form fields
    const title = document.getElementById('job-title').value;
    const category = document.getElementById('job-category').value;
    const location = document.getElementById('job-location').value;
    const pay = document.getElementById('job-pay').value;
    const email = document.getElementById('job-email').value;
    const description = document.getElementById('job-description').value;

    // --- Validation Logic ---
    // Make sure the description is at least 10 characters long
    if (description.length < 10) {
        showToast("Beskrivelsen må være på minst 10 tegn.", "error");
        return; // Stop execution, don't save
    }

    // 2. Create a Job Object
    // We add a unique ID (using timestamp) so we can potentially delete/edit later
    const newJob = {
        id: Date.now().toString(),
        title: title,
        category: category,
        location: location,
        pay: pay,
        email: email,
        description: description,
        datePosted: new Date().toLocaleDateString('no-NO')
    };

    // 3. Save to global jobs list
    const currentJobs = getJobs();
    currentJobs.push(newJob);
    saveJobs(currentJobs);

    // 4. Save ID to my personal jobs list
    const myJobIds = getMyJobIds();
    myJobIds.push(newJob.id);
    saveMyJobIds(myJobIds);

    // 5. Reset the form and show toast success message
    elJobPostForm.reset();
    showToast("Jobben er publisert!", "success");
}

// Listen for the 'submit' event on the form
elJobPostForm.addEventListener('submit', handleJobSubmission);


/**
 * Renders the jobs created by the current user in the Employer "Manage" tab.
 */
function renderMyJobs() {
    const allJobs = getJobs();
    const myJobIds = getMyJobIds();

    // Filter the global jobs list down to just the ones this user created
    const myJobs = allJobs.filter(job => myJobIds.includes(job.id));

    elMyJobsList.innerHTML = '';

    if (myJobs.length === 0) {
        elNoMyJobsMsg.classList.remove('hidden');
        return;
    } else {
        elNoMyJobsMsg.classList.add('hidden');
    }

    // Reverse to show newest first
    myJobs.reverse().forEach(job => {
        const article = document.createElement('article');
        article.classList.add('job-card');

        article.innerHTML = `
            <h3>${escapeHTML(job.title)}</h3>
            <span class="badge">${escapeHTML(job.category)}</span>
            <p class="location"><strong>Sted:</strong> ${escapeHTML(job.location)}</p>
            <p class="date"><em>Lagt ut: ${job.datePosted}</em></p>
            <button class="btn btn-danger delete-btn" data-id="${job.id}">Slett oppdrag</button>
        `;

        elMyJobsList.appendChild(article);
    });

    // Attach event listeners to all newly created delete buttons
    const deleteButtons = document.querySelectorAll('.delete-btn');
    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobId = e.target.getAttribute('data-id');
            deleteJob(jobId);
        });
    });
}

/**
 * Deletes a job from both the global list and the user's personal list.
 * @param {string} jobId - The ID of the job to delete.
 */
function deleteJob(jobId) {
    // 1. Remove from global jobs
    let allJobs = getJobs();
    allJobs = allJobs.filter(job => job.id !== jobId);
    saveJobs(allJobs);

    // 2. Remove from my local IDs
    let myJobIds = getMyJobIds();
    myJobIds = myJobIds.filter(id => id !== jobId);
    saveMyJobIds(myJobIds);

    // 3. Provide feedback and refresh the view
    showToast("Oppdraget ble slettet.", "success");
    renderMyJobs();

    // Note: If we had a backend, we'd make an API DELETE request here instead.
}

// --- 5. Youth Features (Browsing, Searching & Filtering Jobs) ---

const elJobBoard = document.getElementById('job-board');
const elFilterCategory = document.getElementById('filter-category');
const elSearchInput = document.getElementById('search-input');
const elNoJobsMsg = document.getElementById('no-jobs-msg');

/**
 * Renders the jobs to the DOM.
 * It filters the jobs if a specific category is selected AND by text search.
 */
function renderJobs() {
    // 1. Get current jobs and selected filter/search values
    const jobs = getJobs();
    const selectedFilter = elFilterCategory.value;
    // Convert search query to lowercase for case-insensitive matching
    const searchQuery = elSearchInput.value.toLowerCase().trim();

    // 2. Clear the current board
    elJobBoard.innerHTML = '';

    // 3. Filter the jobs based on the dropdown AND search input
    const filteredJobs = jobs.filter(job => {
        // Category Check
        const matchesCategory = selectedFilter === 'Alle' || job.category === selectedFilter;

        // Search Check (look in title or description)
        const matchesSearch = job.title.toLowerCase().includes(searchQuery) ||
                              job.description.toLowerCase().includes(searchQuery);

        return matchesCategory && matchesSearch;
    });

    // 4. Handle Empty State
    if (filteredJobs.length === 0) {
        elNoJobsMsg.classList.remove('hidden');
        return; // Stop execution here since there's nothing to render
    } else {
        elNoJobsMsg.classList.add('hidden');
    }

    // 5. Build and inject the HTML for each job
    // We reverse the array so the newest jobs (added last) appear first.
    filteredJobs.reverse().forEach(job => {
        // Create the container for the job card
        const article = document.createElement('article');
        article.classList.add('job-card');

        // Construct the mailto link dynamically
        const subject = encodeURIComponent(`Søknad på jobb: ${job.title}`);
        const body = encodeURIComponent(`Hei!\n\nJeg er interessert i jobben "${job.title}".\n\nMed vennlig hilsen,\n[Ditt Navn]`);
        const mailtoLink = `mailto:${job.email}?subject=${subject}&body=${body}`;

        // Build the inner HTML of the card
        article.innerHTML = `
            <h3>${escapeHTML(job.title)}</h3>
            <span class="badge">${escapeHTML(job.category)}</span>
            <p class="location"><strong>Sted:</strong> ${escapeHTML(job.location)}</p>
            ${job.pay ? `<p class="pay"><strong>Godtgjørelse:</strong> ${escapeHTML(job.pay)}</p>` : ''}
            <p class="date"><em>Lagt ut: ${job.datePosted}</em></p>
            <p class="description">${escapeHTML(job.description)}</p>
            <a href="${mailtoLink}" class="btn btn-primary">Søk nå (E-post)</a>
        `;

        // Append the newly created article to the job board
        elJobBoard.appendChild(article);
    });
}

/**
 * Utility function to prevent XSS (Cross-Site Scripting) attacks.
 * Since we are taking user input and rendering it as HTML, we MUST escape
 * characters like < and > so they are treated as text, not executable code.
 */
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

// Re-render the jobs whenever the filter dropdown OR search input changes
elFilterCategory.addEventListener('change', renderJobs);
// 'input' event triggers every time a key is pressed or text is pasted
elSearchInput.addEventListener('input', renderJobs);

// Initialize: Show the home view on first load
showHomeView();
