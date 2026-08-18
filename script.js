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

// --- 4. Employer Features (Posting Jobs) ---

const elJobPostForm = document.getElementById('job-post-form');
const elPostSuccessMsg = document.getElementById('post-success-msg');

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

    // 3. Save to localStorage
    const currentJobs = getJobs();
    currentJobs.push(newJob);
    saveJobs(currentJobs);

    // 4. Reset the form and show success message
    elJobPostForm.reset();
    elPostSuccessMsg.classList.remove('hidden');

    // Hide the success message after 3 seconds
    setTimeout(() => {
        elPostSuccessMsg.classList.add('hidden');
    }, 3000);
}

// Listen for the 'submit' event on the form
elJobPostForm.addEventListener('submit', handleJobSubmission);

// --- 5. Youth Features (Browsing & Filtering Jobs) ---

const elJobBoard = document.getElementById('job-board');
const elFilterCategory = document.getElementById('filter-category');
const elNoJobsMsg = document.getElementById('no-jobs-msg');

/**
 * Renders the jobs to the DOM.
 * It filters the jobs if a specific category is selected.
 */
function renderJobs() {
    // 1. Get current jobs and selected filter
    const jobs = getJobs();
    const selectedFilter = elFilterCategory.value;

    // 2. Clear the current board
    elJobBoard.innerHTML = '';

    // 3. Filter the jobs based on the dropdown
    // If 'Alle' is selected, we keep all jobs. Otherwise, match the category.
    const filteredJobs = jobs.filter(job => {
        if (selectedFilter === 'Alle') return true;
        return job.category === selectedFilter;
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

// Re-render the jobs whenever the filter dropdown changes
elFilterCategory.addEventListener('change', renderJobs);

// Initialize: Show the home view on first load
showHomeView();
