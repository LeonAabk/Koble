# Koble Security & Architecture Sentinel

### 2024-05-12 - Defense in Depth: Client-Side Ownership Checks
**Context:** Implemented user authentication and job posting deletion.
**Vulnerability:** The `deleteJob` function in `script.js` relied solely on the `jobId` from the DOM element's data attribute, without passing the active user's ID (`currentUser.id`) to the Supabase client query.
**Learning:** While Row Level Security (RLS) is the primary defense layer in Supabase, relying solely on backend RLS from the frontend creates a single point of failure. If RLS is misconfigured or bypassed, any logged-in user could manipulate the client to send a delete request for *any* `jobId`.
**Prevention:** Defense in Depth: Always include explicit ownership checks on the client side before triggering mutable operations (e.g., adding `.eq('user_id', currentUser.id)` to queries). This ensures the client enforces authorization alongside the backend.

### 2026-08-19 - Admin Route Authorization Pattern
When creating authenticated admin routes in vanilla SPA applications lacking robust backend role-based access control (RBAC), checking `if (currentUser)` is insufficient. Ensure explicit verification against known admin identifiers (e.g., `currentUser.email === 'admin@domain.com'`) before granting access to moderation interfaces to prevent unauthorized users from manually routing to the view.

### 2024-08-19 - Navigation Event Handlers in Hash Routing
When binding navigation buttons that update `window.location.hash`, explicitly call the view update function (e.g. `handleRouting()`) inside the click listener. Relying exclusively on the `hashchange` event listener can lead to dead clicks if the user is already on the target hash but the DOM state has been manually manipulated (e.g. via internal 'back' buttons).

### 2024-08-19 - Conditional UI Buttons & Permissions
When rendering UI elements conditionally based on permissions (e.g. inline admin delete buttons), ensure you correctly handle both the presence of the `currentUser` object *and* its properties. Do not assume `currentUser` is always defined; failing to check `if (currentUser)` before checking `currentUser.email` will crash the application for unauthenticated users.
