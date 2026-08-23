## 2026-08-22 - Input Length Validation Gap
**Vulnerability:** Input fields (`job-employer-name`, `job-time`, `job-pay`, `job-title`) lacked explicit maximum length bounds both in the HTML attributes and the JavaScript validation logic before interacting with Supabase.
**Learning:** This architectural gap exposed the application to potential Resource Exhaustion (DoS risk) by allowing users to programmatically submit excessively large string payloads to the database. Although `title` had a minimum check, and `description` was checked, the other fields were entirely unbounded.
**Prevention:** Always implement defense-in-depth by explicitly setting reasonable length limits (e.g., `maxlength="100"` or `"2000"`) on all HTML `<input>` and `<textarea>` elements, AND replicate these bounds in the client-side JavaScript validation prior to any database mutation.

## 2026-08-22 - Type Error Denial of Service
**Vulnerability:** Client-side rendering loops crash when processing database entries containing non-string primitive values (like `null` or integers) for properties expected to be strings (e.g. `job.description` or `job.title`).
**Learning:** Bypassing client-side form validation (e.g., via direct API/DB inserts) allows non-string data to reach the frontend. Blindly invoking string methods like `.includes()` or `.toLowerCase()` on this data throws unhandled `TypeError` exceptions, effectively causing a Denial of Service by locking out the admin dashboard and breaking the public job feed for all users.
**Prevention:** Always implement explicit type casting (e.g., `String(job.description)` or `(job.description || '')`) when rendering or transforming external data, ensuring that string-specific operations safely execute on all data types.
