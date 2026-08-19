# Jules Agent Instructions

You are working in a multi-agent environment where the user frequently runs multiple Jules tasks concurrently on different branches. To ensure smooth merges into the `main` branch and prevent painful merge conflicts, you **MUST** strictly adhere to the following workflow guidelines.

## Concurrent AI Agent Workflow

1. **Minimize Footprint (Strict Scoping):**
   - ONLY modify the specific lines of code absolutely necessary to complete your assigned task.
   - Do NOT edit adjacent lines just because you are "already there."
   - Keep your modifications as localized as possible.

2. **No Unsolicited Refactoring or Reformatting:**
   - NEVER reformat entire files (e.g., changing indentation, replacing quotes, reordering imports/functions).
   - NEVER perform cleanup, standardizations, or variable renaming outside the immediate scope of your specific task.
   - Refactoring unrelated code heavily increases the probability of severe merge conflicts with other agents running simultaneously.

3. **Handling Merge Conflicts:**
   - If the user asks you to resolve a merge conflict, it means another agent's work has been merged into `main` before yours.
   - You must carefully analyze the conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`).
   - Your goal is to **preserve the functionality of both agents' work**. Do not simply overwrite the other agent's code with your own.

4. **Append-Only When Possible:**
   - If adding new features (like a new function or a new CSS class), try to append them to the bottom of the file or in a clearly separated new block, rather than inserting them in the middle of existing dense code blocks.

5. **Diagnostic Awareness:**
   - If a test fails or something is missing, consider that another agent might be working on the prerequisite piece. Communicate clearly with the user about what dependencies might be missing.
