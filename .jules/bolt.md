## 2024-05-24 - Debouncing Database Queries Triggered by Frontend Input
**Learning:** Found a codebase-specific bottleneck where frontend filtering logic triggered full database fetches from Supabase on every keystroke. The `input` event on the search field called `renderJobs()`, which in turn invoked `await getJobs()`, pulling the full unpaginated list from Supabase.
**Action:** Implemented a generic `debounce` function and applied it to the `elSearchInput` event listener to ensure that `renderJobs()` is only called after a 300ms pause in typing. Always review frontend event listeners that trigger full data fetches to ensure they are properly debounced, particularly in apps that use serverless/database-as-a-service backends like Supabase where each keystroke translates into a query.

## 2024-06-25 - Prevent Unnecessary Database Fetches on Frontend Filtering
**Learning:** In the initial architecture, modifying job board filters (category, location, sort) or typing in the search bar triggered `renderJobs()`, which awaited a full database fetch (`await getJobs()`) from Supabase on every input (even debounced inputs caused database hits). This is highly inefficient and creates unnecessary load on serverless backend infrastructure.
**Action:** Decoupled data fetching from data rendering by saving the initial fetched jobs to a client-side state variable (`let currentLoadedJobs`). Adjusted the rendering logic (`applyFiltersAndRenderJobs`) to filter this local array instead of refetching on every user interaction. Additionally, utilized a `DocumentFragment` to batch DOM insertions rather than appending elements sequentially to the DOM, reducing layout thrashing.

## 2024-08-21 - Early returns in filtering and lexicographical timestamp sorting
**Learning:** Instantiating `new Date()` objects within the highly iterative callback of `Array.prototype.sort()` can be a significant hidden performance bottleneck, especially on large data sets, increasing time overhead up to ~5-7x. Furthermore, evaluating all conditions (even expensive string allocations/manipulations like `toLowerCase().includes()`) when simple equality checks already disqualify an element creates wasted work in `Array.prototype.filter()`.
**Action:** Always sort database ISO-8601 timestamp strings lexicographically (e.g., `a.created_at < b.created_at ? -1 : 1`) to eliminate Date parsing overhead. Additionally, use early returns in `.filter()` loops to skip expensive computations when possible.

## 2024-11-20 - Prevent Object Re-instantiation in String Replacement Callbacks
**Learning:** Found a micro-performance bottleneck in `escapeHTML()` where a static mapping object (`{ '&': '&amp;', '<': '&lt;', ... }`) was being re-instantiated *inside* the callback function of `String.prototype.replace()` for every single matched character. Given this function is called up to 8 times per rendered job card during list rendering (which already batches DOM nodes), this pattern creates unnecessary memory allocations and garbage collection pressure on the main thread.
**Action:** Always extract static mapping objects or arrays to constants outside of iterative functions or callbacks (like `.replace()`, `.map()`, or `.reduce()`) to ensure they are only instantiated once.

## 2024-11-20 - Pre-compute Searchable Strings to Prevent Redundant Allocation
**Learning:** Calling `.toLowerCase()` inside a `.filter()` array method on keystroke events forces redundant string allocations and GC pressure every time the user types, even with a debouncer.
**Action:** Pre-compute and cache derived values (like lowercased versions of title and description) onto the source object array immediately after fetching from the database, allowing subsequent iterative filters to perform basic string matching without allocating new memory.

## 2024-11-20 - Prevent Expensive UI Formatting inside Render Loops
**Learning:** Found a major bottleneck in the `applyFiltersAndRenderJobs` function. Keystroke events were triggering a re-render of the list. Even with debouncing, every re-render of every job card was synchronously running `parseJobDescription` (which uses string parsing and regex), instantiating multiple `new Date()` objects, and calling the expensive `toLocaleDateString` `Intl` API. This caused significant layout jank and wasted cycles during search filtering.
**Action:** Pre-compute and cache derived display values (`_parsed`, `_formattedDate`, and `_isNew`) onto the source object array immediately after fetching from the database. When rendering lists that are frequently updated by user input, always pull expensive parsing or Intl formatting logic out of the render loop and do it once during the data hydration phase.

## 2024-11-20 - Prevent Redundant Database Queries on Employer Tab Switch
**Learning:** The "Ledige oppdrag" and "Tildelte oppdrag" tabs in the Employer view were both triggering a full database fetch (`renderMyJobs() -> await supabaseClient.from('jobs')`) each time they were clicked. This caused unnecessary network load for simply switching a local filter view.
**Action:** Decoupled the fetch from the render by introducing `fetchAndRenderMyJobs()` (which caches results to `currentLoadedMyJobs`) and `applyFiltersAndRenderMyJobs()`. Tab clicks now only call the latter to filter the local array.

## 2024-11-20 - Cache Expensive Date Formatting in Keystroke Loops
**Learning:** `updateCalculatorTotal()` was instantiating `new Date()` and calling the expensive `toLocaleDateString` on every keystroke event in the calculator inputs.
**Action:** Cached the formatted date string in a global variable (`cachedPdfDateString`) so it is computed only once and reused across all subsequent keystrokes in that session.

## 2024-11-20 - Prevent Memory Bloat with Event Delegation in Vanilla SPA
**Learning:** Attaching event listeners (e.g., via `btn.addEventListener('click', ...)`) directly to dynamically generated elements inside frequent rendering loops (like `applyFiltersAndRenderJobs`) causes significant memory bloat, high garbage collection overhead, and degrades performance. Furthermore, clicking on child icons inside these buttons would fail to trigger actions if `e.target` lacked the `data-*` attributes.
**Action:** Always implement Event Delegation in Vanilla JS SPAs for frequently re-rendered list items. Attach a single event listener to the static parent container (e.g., `elJobBoard`), check `e.target.closest('button')` to identify the action, and read attributes from the button element.
