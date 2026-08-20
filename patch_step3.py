with open('script.js', 'r') as f:
    content = f.read()

render_my_jobs_old = """
        // Check for the group-friendly tag and remove it from the display string
        let displayDescription = job.description;
        let isGroupFriendly = false;
        if (displayDescription.startsWith("[GROUP_FRIENDLY]")) {
            isGroupFriendly = true;
            displayDescription = displayDescription.replace("[GROUP_FRIENDLY]", "");
        }

        let employerName = '';
        if (displayDescription.startsWith("[EMPLOYER_NAME]")) {
            const parts = displayDescription.split("\\n\\n");
            if (parts.length > 0) {
                 employerName = parts[0].replace("[EMPLOYER_NAME]", "");
                 displayDescription = parts.slice(1).join("\\n\\n");
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
"""

render_my_jobs_new = """
        const parsed = parseJobDescription(job.description);

        const d = new Date(job.created_at);
        const formattedDate = d.toLocaleDateString('no-NO');
        const isNew = (new Date() - d) < (24 * 60 * 60 * 1000);

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

        article.innerHTML = `
            <h3>${escapeHTML(job.title)}${isNew ? '<span class="badge badge-new">Ny</span>' : ''}</h3>
            ${approvalBadge}
            ${feedbackBox}
            <div style="margin-top: 0.5rem; margin-bottom: 0.5rem;">
                <span class="badge ${badgeClass}"><i data-lucide="${catIcon}" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i>${escapeHTML(job.category)}</span>
                ${parsed.isGroupFriendly ? `<span class="badge badge-group-friendly">Passer for grupper</span>` : ''}
            </div>
            ${parsed.employerName ? `<p class="employer"><strong>Arbeidsgiver:</strong> ${escapeHTML(parsed.employerName)}</p>` : ''}
            <p class="location"><i data-lucide="map-pin" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i><strong>Sted:</strong> ${escapeHTML(job.location)}</p>
            <p class="date"><i data-lucide="calendar" style="width: 1rem; height: 1rem; vertical-align: middle; margin-right: 0.25rem;"></i><em>Lagt ut: ${formattedDate}</em></p>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn btn-secondary edit-btn" data-id="${job.id}">${editButtonLabel}</button>
                <button class="btn btn-danger delete-btn" data-id="${job.id}">Slett oppdrag</button>
            </div>
        `;
"""

content = content.replace(render_my_jobs_old.strip(), render_my_jobs_new.strip())

with open('script.js', 'w') as f:
    f.write(content)
