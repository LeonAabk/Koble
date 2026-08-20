import re

# Read the file
with open('script.js', 'r') as file:
    script_data = file.read()

# Replace the specific lines with the desired ones
# Search for getJobs
print(re.search(r'function getJobs\(.*?\).*?}', script_data, re.DOTALL))
