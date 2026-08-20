with open('script.js', 'r') as f:
    content = f.read()

# I need to fix the condition for the reject button because job is approved currently
render_jobs_admin_old = """
                    ${!job.is_approved && !isRejected ? `<button class="btn btn-danger btn-sm admin-reject-btn" data-id="${job.id}">Avvis</button>` : ''}
"""
render_jobs_admin_new = """
                    ${!isRejected ? `<button class="btn btn-danger btn-sm admin-reject-btn" data-id="${job.id}">Avvis</button>` : ''}
"""
content = content.replace(render_jobs_admin_old.strip(), render_jobs_admin_new.strip())


admin_table_html_old = """
                ${!job.is_approved && !isRejected ? `<button class="btn btn-danger btn-sm admin-reject-btn" data-id="${job.id}" data-desc="${escapeHTML(job.description)}">Avvis</button>` : ''}
"""
admin_table_html_new = """
                ${!isRejected ? `<button class="btn btn-danger btn-sm admin-reject-btn" data-id="${job.id}" data-desc="${escapeHTML(job.description)}">Avvis</button>` : ''}
"""
content = content.replace(admin_table_html_old.strip(), admin_table_html_new.strip())

with open('script.js', 'w') as f:
    f.write(content)
