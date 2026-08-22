## YYYY-MM-DD - [Title]
**Learning:** [UX/a11y insight]
**Action:** [How to apply next time]

## 2024-05-18 - Disabled Button Focus & Hover Anomalies
**Learning:** Pure CSS button styling for `:hover` and `:active` needs to explicitly exclude `:disabled` states. Otherwise, buttons attempting to show a disabled state (like a loading form submit) will unexpectedly still exhibit "lift" interactions or pointer-cursor behaviors when the mouse is over them.
**Action:** When creating global `.btn` classes, always structure hover/active states as `.btn:hover:not(:disabled)` and ensure a base `.btn:disabled` handles the opacity drop and `cursor: not-allowed`.
