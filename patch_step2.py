with open('script.js', 'r') as f:
    content = f.read()

# Update renderAdminJobs
admin_table_html_old = """
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
"""

admin_table_html_new = """
        let isRejected = false;
        if (job.description && job.description.includes("[STATUS:REJECTED]")) {
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
                ${!job.is_approved && !isRejected ? `<button class="btn btn-danger btn-sm admin-reject-btn" data-id="${job.id}" data-desc="${escapeHTML(job.description)}">Avvis</button>` : ''}
                <button class="btn btn-danger btn-sm admin-delete-btn" data-id="${job.id}">Slett</button>
            </td>
        `;
"""
content = content.replace(admin_table_html_old.strip(), admin_table_html_new.strip())

# Add event listener for reject buttons in renderAdminJobs
admin_reject_listeners = """
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
"""
old_listeners = """
    const approveButtons = adminTableBody.querySelectorAll('.admin-approve-btn');
    approveButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobId = e.target.getAttribute('data-id');
            approveAdminJob(jobId);
        });
    });
"""
content = content.replace(old_listeners.strip(), admin_reject_listeners.strip())

# Update renderJobs admin view
render_jobs_admin_old = """
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
"""
render_jobs_admin_new = """
        let adminActions = '';
        if (isAdmin) {
            let isRejected = false;
            if (job.description && job.description.includes("[STATUS:REJECTED]")) {
                isRejected = true;
            }
            adminActions = `
                <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border-color); display: flex; gap: 0.5rem; flex-wrap: wrap;">
                    <span style="font-weight: 600; font-size: 0.9rem; margin-right: auto; align-self: center;">Admin:</span>
                    ${!job.is_approved ? `<button class="btn btn-secondary btn-sm admin-approve-btn" data-id="${job.id}">Godkjenn</button>` : ''}
                    ${!job.is_approved && !isRejected ? `<button class="btn btn-danger btn-sm admin-reject-btn" data-id="${job.id}">Avvis</button>` : ''}
                    <button class="btn btn-danger btn-sm admin-delete-btn" data-id="${job.id}">Slett</button>
                </div>
            `;
        }
"""
content = content.replace(render_jobs_admin_old.strip(), render_jobs_admin_new.strip())

render_jobs_listeners_old = """
        const approveButtons = elJobBoard.querySelectorAll('.admin-approve-btn');
        approveButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-id');
                approveAdminJob(jobId);
            });
        });
"""
render_jobs_listeners_new = """
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
"""
content = content.replace(render_jobs_listeners_old.strip(), render_jobs_listeners_new.strip())


# Add rejectAdminJob function
reject_func = """
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

    const newDescription = `[STATUS:REJECTED]\\n\\n[REASON:${reason.trim()}]\\n\\n${currentDescription}`;

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
            renderJobs();
        }
    } catch (error) {
        console.error('Error rejecting job as admin:', error);
        showToast('Kunne ikke avvise oppdraget.', 'error');
    }
}
"""

content = content + "\n" + reject_func

with open('script.js', 'w') as f:
    f.write(content)
