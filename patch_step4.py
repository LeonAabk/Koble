import re

with open('script.js', 'r') as f:
    content = f.read()

# Update editJob
edit_job_old = """
    let displayDescription = job.description;
    let isGroupFriendly = false;
    if (displayDescription.startsWith("[GROUP_FRIENDLY]")) {
        isGroupFriendly = true;
        displayDescription = displayDescription.replace("[GROUP_FRIENDLY]", "");
    }
    document.getElementById('job-group-friendly').checked = isGroupFriendly;

    let employerName = '';
    if (displayDescription.startsWith("[EMPLOYER_NAME]")) {
        const parts = displayDescription.split("\\n\\n");
        if (parts.length > 0) {
             employerName = parts[0].replace("[EMPLOYER_NAME]", "");
             displayDescription = parts.slice(1).join("\\n\\n");
        }
    }
    document.getElementById('job-employer-name').value = employerName;

    // Extract time from the description if it starts with "Når: "
    let time = '';
    let rawDescription = displayDescription;
    if (displayDescription.startsWith("Når: ")) {
        const parts = displayDescription.split("\\n\\n");
        if (parts.length > 1) {
            time = parts[0].replace("Når: ", "");
            rawDescription = parts.slice(1).join("\\n\\n");
        } else {
            // fallback if format is slightly off
            time = displayDescription.replace("Når: ", "");
            rawDescription = '';
        }
    }

    document.getElementById('job-time').value = time;
    document.getElementById('job-description').value = rawDescription;
"""

edit_job_new = """
    const parsed = parseJobDescription(job.description);

    document.getElementById('job-group-friendly').checked = parsed.isGroupFriendly;
    document.getElementById('job-employer-name').value = parsed.employerName;
    document.getElementById('job-time').value = parsed.time;
    document.getElementById('job-description').value = parsed.rawDescription;
"""
content = content.replace(edit_job_old.strip(), edit_job_new.strip())


# Update form submission to always pass is_approved: false if editingJobId
form_submit_old = """
        if (editingJobId) {
            const { data, error } = await supabaseClient
                .from('jobs')
                .update(jobData)
                .eq('id', editingJobId)
                .eq('user_id', currentUser.id)
                .select();
"""

form_submit_new = """
        if (editingJobId) {
            jobData.is_approved = false; // Always return to pending on update
            const { data, error } = await supabaseClient
                .from('jobs')
                .update(jobData)
                .eq('id', editingJobId)
                .eq('user_id', currentUser.id)
                .select();
"""
content = content.replace(form_submit_old.strip(), form_submit_new.strip())


# Also update renderJobs to use parseJobDescription for cleaner code (and ensure it doesn't display rejection tags if somehow they slipped in)
render_jobs_old = """
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
"""

render_jobs_new = """
        const parsed = parseJobDescription(job.description);
        let displayDescription = parsed.rawDescription;
        if (parsed.time) {
             displayDescription = `Når: ${parsed.time}\\n\\n${displayDescription}`;
        }
        let isGroupFriendly = parsed.isGroupFriendly;
        let employerName = parsed.employerName;
"""
content = content.replace(render_jobs_old.strip(), render_jobs_new.strip())

with open('script.js', 'w') as f:
    f.write(content)
