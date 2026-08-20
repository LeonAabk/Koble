with open('script.js', 'r') as f:
    content = f.read()

# Add lucide.createIcons() to renderMyJobs()
my_jobs_end_old = """
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const jobId = e.target.getAttribute('data-id');
            const jobToEdit = myJobs.find(j => j.id === jobId);
            if (jobToEdit) editJob(jobToEdit);
        });
    });
}
"""

my_jobs_end_new = """
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
"""
content = content.replace(my_jobs_end_old.strip(), my_jobs_end_new.strip())

with open('script.js', 'w') as f:
    f.write(content)

print("Patch applied for renderMyJobs()")
