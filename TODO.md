# TODO

## CrisisCom Dashboard - Ingested Telemetry Logs (Dynamic)

- [ ] Inspect current logs section markup and hardcoded alerts.
- [x] Remove hardcoded/demo `incidents` rendering from “Ingested Telemetry Logs”.
- [x] Add `useState` for `latestAlert`.
- [x] Add `useEffect` polling every 5 seconds from n8n webhook URL.
- [x] Parse JSON expecting `{ disaster_type, status, cleaned_location }`.
- [x] Render only when `latestAlert` is non-null.
- [x] Ensure old alert is replaced (single entry only).
- [ ] Quick manual test: start dev server, verify UI updates and only one log is shown.

