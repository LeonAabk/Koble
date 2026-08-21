## 2024-05-28 - Missing Ownership Checks (IDOR Risk)
**Vulnerability:** The `deleteJob` function in `script.js` relied solely on the `jobId` from the DOM element's data attribute, without passing the active user's ID (`currentUser.id`) to the Supabase client query.
**Learning:** While Row Level Security (RLS) is the primary defense layer in Supabase, relying solely on backend RLS from the frontend creates a single point of failure. If RLS is misconfigured or bypassed, any logged-in user could manipulate the client to send a delete request for *any* `jobId`.
**Prevention:** Defense in Depth: Always include explicit ownership checks on the client side before triggering mutable operations (e.g., adding `.eq('user_id', currentUser.id)` to queries). This ensures the client enforces authorization alongside the backend.

### 2026-08-19 - Admin Route Authorization Pattern
When creating authenticated admin routes in vanilla SPA applications lacking robust backend role-based access control (RBAC), checking `if (currentUser)` is insufficient. Ensure explicit verification against known admin identifiers (e.g., `currentUser.email === 'admin@domain.com'`) before granting access to moderation interfaces to prevent unauthorized users from manually routing to the view.

### 2024-08-19 - Navigation Event Handlers in Hash Routing
When binding navigation buttons that update `window.location.hash`, explicitly call the view update function (e.g. `handleRouting()`) inside the click listener. Relying exclusively on the `hashchange` event listener can lead to dead clicks if the user is already on the target hash but the DOM state has been manually manipulated (e.g. via internal 'back' buttons).

### 2024-08-19 - Conditional UI Buttons & Permissions
When rendering UI elements conditionally based on permissions (e.g. inline admin delete buttons), ensure you correctly handle both the presence of the `currentUser` object *and* its properties. Do not assume `currentUser` is always defined; failing to check `if (currentUser)` before checking `currentUser.email` will crash the application for unauthenticated users.

### 2024-08-19 - Moderation Queues and User Feedback
When implementing moderation queues (`is_approved` flags) that delay content publication, always provide explicit feedback to the creator immediately upon submission, and reflect that pending status clearly in their personal management dashboard. Failing to do so causes confusion and duplicate submissions.

### 2024-08-20 - Silent Failure Mitigation in Supabase Client
**Vulnerability:** Supabase queries (e.g., updates, deletes) may fail silently if Row Level Security (RLS) blocks the operation or conditions are not met, returning no data but also no hard error, leading the frontend to incorrectly assume success.
**Learning:** Checking `if (error) throw error;` is insufficient for mutation operations. The client must verify that the database actually modified rows, otherwise unauthorized attempts appear successful locally while silently failing on the backend.
**Prevention:** Chain `.select()` to mutation queries and check `if (!data || data.length === 0)` to detect and handle silent RLS rejections, ensuring accurate UI feedback for authorization failures.

## 2026-08-21 - Missing Input Length Validations
**Vulnerability:** User input fields (title, description, employer name) lacked maximum length constraints on the frontend before submission.
**Learning:** Relying only on minimum length validation leaves the application vulnerable to resource exhaustion (DoS) or unexpected database truncation errors if excessively large payloads are sent.
**Prevention:** Defense in Depth: Always implement explicit maximum length bounds on user inputs alongside minimums, both on the frontend (for UX and basic filtering) and backend.


## 2026-08-21 - Type Confusion in HTML Escaping
**Vulnerability:** The  utility function implicitly assumed all inputs were strings and called  directly.
**Learning:** If a non-string type (like a number from JSON or a null value bypassing the falsy check) reaches the escaping function, it throws a TypeError, potentially crashing parts of the application or allowing bypasses if error states fail open.
**Prevention:** Always explicitly cast untrusted or dynamically-typed variables to strings (e.g., ) before performing string manipulation or sanitization.


## 2024-05-28 - Missing Input Length Validations
**Vulnerability:** User input fields (title, description, employer name) lacked maximum length constraints on the frontend before submission.
**Learning:** Relying only on minimum length validation leaves the application vulnerable to resource exhaustion (DoS) or unexpected database truncation errors if excessively large payloads are sent.
**Prevention:** Defense in Depth: Always implement explicit maximum length bounds on user inputs alongside minimums, both on the frontend (for UX and basic filtering) and backend.

## 2024-05-28 - Type Confusion in HTML Escaping
**Vulnerability:** The `escapeHTML` utility function implicitly assumed all inputs were strings and called `.replace()` directly.
**Learning:** If a non-string type (like a number from JSON or a null value bypassing the falsy check) reaches the escaping function, it throws a TypeError, potentially crashing parts of the application or allowing bypasses if error states fail open.
**Prevention:** Always explicitly cast untrusted or dynamically-typed variables to strings (e.g., `String(str)`) before performing string manipulation or sanitization.
