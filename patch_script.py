import re

with open('script.js', 'r') as f:
    content = f.read()

# Define badge mapping block to insert category icon logic
badge_mapping_old = """
        let badgeClass = 'badge-annet';
        if (job.category === 'Gårdsarbeid') badgeClass = 'badge-gardsarbeid';
        else if (job.category === 'Vedlikehold') badgeClass = 'badge-vedlikehold';
        else if (job.category === 'Hushjelp') badgeClass = 'badge-hushjelp';
        else if (job.category === 'Russedugnad / Gruppearbeid') badgeClass = 'badge-russedugnad';
"""

badge_mapping_new = """
        let badgeClass = 'badge-annet';
        let catIcon = 'briefcase';
        if (job.category === 'Gårdsarbeid') { badgeClass = 'badge-gardsarbeid'; catIcon = 'tractor'; }
        else if (job.category === 'Vedlikehold') { badgeClass = 'badge-vedlikehold'; catIcon = 'hammer'; }
        else if (job.category === 'Hushjelp') { badgeClass = 'badge-hushjelp'; catIcon = 'home'; }
        else if (job.category === 'Russedugnad / Gruppearbeid') { badgeClass = 'badge-russedugnad'; catIcon = 'users'; }
"""
content = content.replace(badge_mapping_old.strip(), badge_mapping_new.strip())


# Replace renderMyJobs innerHTML
my_jobs_html_old = """
        article.innerHTML = `
            <h3>${escapeHTML(job.title)}${isNew ? '<span class="badge badge-new">Ny</span>' : ''}</h3>
            ${approvalBadge}
            <span class="badge ${badgeClass}">${escapeHTML(job.category)}</span>
            ${isGroupFriendly ? `<span class="badge badge-group-friendly">Passer for grupper</span>` : ''}
            ${employerName ? `<p class="employer"><strong>Arbeidsgiver:</strong> ${escapeHTML(employerName)}</p>` : ''}
            <p class="location"><strong>Sted:</strong> ${escapeHTML(job.location)}</p>
            <p class="date"><em>Lagt ut: ${formattedDate}</em></p>
            <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
                <button class="btn btn-secondary edit-btn" data-id="${job.id}">Rediger</button>
                <button class="btn btn-danger delete-btn" data-id="${job.id}">Slett oppdrag</button>
            </div>
        `;
"""

my_jobs_html_new = """
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
content = content.replace(my_jobs_html_old.strip(), my_jobs_html_new.strip())

# Replace renderJobs innerHTML
render_jobs_html_old = """
        article.innerHTML = `
            <h3>${escapeHTML(job.title)}${isNew ? '<span class="badge badge-new">Ny</span>' : ''}</h3>
            ${isAdmin && !job.is_approved ? '<span class="badge badge-status-pending">⏳ Venter på godkjenning</span>' : ''}
            <span class="badge ${badgeClass}">${escapeHTML(job.category)}</span>
            ${isGroupFriendly ? `<span class="badge badge-group-friendly">Passer for grupper</span>` : ''}
            ${employerName ? `<p class="employer"><strong>Arbeidsgiver:</strong> ${escapeHTML(employerName)}</p>` : ''}
            <p class="location"><strong>Sted:</strong> ${escapeHTML(job.location)}</p>
            ${job.pay ? `<p class="pay"><strong>Godtgjørelse:</strong> ${escapeHTML(job.pay)}</p>` : ''}
            <p class="date"><em>Lagt ut: ${formattedDate}</em></p>
            <p class="description">${escapeHTML(displayDescription)}</p>
            <button class="btn btn-primary apply-btn" data-email="${escapeHTML(job.email)}" data-title="${escapeHTML(job.title)}" data-employer="${escapeHTML(employerName)}">Søk nå</button>
            ${adminActions}
        `;
"""

render_jobs_html_new = """
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
"""
content = content.replace(render_jobs_html_old.strip(), render_jobs_html_new.strip())


with open('script.js', 'w') as f:
    f.write(content)

print("Patch applied via python script")
