with open('script.js', 'r') as f:
    content = f.read()

# Let's insert it before the utility functions
parse_func = """
function parseJobDescription(rawString) {
    let result = {
        isGroupFriendly: false,
        employerName: '',
        statusRejected: false,
        rejectionReason: '',
        time: '',
        rawDescription: rawString || ''
    };

    if (!result.rawDescription) return result;

    if (result.rawDescription.includes("[STATUS:REJECTED]")) {
        result.statusRejected = true;
        result.rawDescription = result.rawDescription.replace("[STATUS:REJECTED]\\n\\n", "").replace("[STATUS:REJECTED]", "");
    }

    const reasonMatch = result.rawDescription.match(/\\[REASON:(.*?)\\](?:\\n\\n)?/);
    if (reasonMatch) {
        result.rejectionReason = reasonMatch[1];
        result.rawDescription = result.rawDescription.replace(reasonMatch[0], "");
    }

    if (result.rawDescription.includes("[GROUP_FRIENDLY]")) {
        result.isGroupFriendly = true;
        result.rawDescription = result.rawDescription.replace("[GROUP_FRIENDLY]", "");
    }

    if (result.rawDescription.startsWith("[EMPLOYER_NAME]")) {
        const parts = result.rawDescription.split("\\n\\n");
        if (parts.length > 0) {
            result.employerName = parts[0].replace("[EMPLOYER_NAME]", "");
            result.rawDescription = parts.slice(1).join("\\n\\n");
        }
    }

    if (result.rawDescription.startsWith("Når: ")) {
        const parts = result.rawDescription.split("\\n\\n");
        if (parts.length > 1) {
            result.time = parts[0].replace("Når: ", "");
            result.rawDescription = parts.slice(1).join("\\n\\n");
        } else {
            result.time = result.rawDescription.replace("Når: ", "");
            result.rawDescription = '';
        }
    }

    return result;
}
"""

content = content.replace("// --- Utility Functions ---", "// --- Utility Functions ---\n" + parse_func)

with open('script.js', 'w') as f:
    f.write(content)
