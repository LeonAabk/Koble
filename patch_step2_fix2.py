with open('script.js', 'r') as f:
    content = f.read()

# Make sure job is marked unapproved! wait, earlier I updated is_approved to false when rejecting but let's check
# Oh, the job in db was `is_approved = true`. My reject code sets it to false.
