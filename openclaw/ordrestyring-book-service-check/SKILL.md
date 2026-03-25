---
name: ordrestyring-book-service-check
description: >
  Books a lovpligtig serviceeftersyn (mandatory annual service inspection) for an Amalo
  customer in Ordrestyring (system.ordrestyring.dk). Use this skill when Kristian mentions
  "lovpligtig service", "lovpligtig serviceeftersyn", "planlæg service", "book service hos
  [kunde]", "book et servicebesøg til [dato]", or similar — especially when a specific
  date and time is provided. This flow uses the "Planlæg service" button (not "Opret"),
  which searches service agreements directly. For ad hoc orders without a fixed time slot,
  use `ordrestyring-service-procedure` or `ordrestyring-create-order` instead.
---
# Book Lovpligtig Serviceeftersyn — Ordrestyring
This skill covers the specific workflow for booking a **lovpligtig serviceeftersyn** — the scheduled annual service inspection that Amalo performs for customers with a service agreement.
This flow is different from creating a general order. It starts from the "Planlæg service" button, which searches existing service agreements — not the general "Opret → Ordre" flow. For the general order flow, see `ordrestyring-create-order`.
---
## Information to Gather First
| Info | Default / Example |
|------|-------------------|
| Customer name or address | e.g. "Stubvænget 15, Espergærde" |
| Date (Startdato) | e.g. "mandag 10/03/2026" |
| Start time (Starttid) | e.g. "08:00" |
| End time (Sluttid) | e.g. "09:00" |
| Ansvarlig (technician) | Default: **Martin Olsen (MO)** |
| Type | Default: **Lovpligtig serviceeftersyn** |
| Status | Default: **Åben** |
---
## Step 1: Navigate to Scheduler
1. Call `tabs_create_mcp` to open a fresh tab — always create a new one, never reuse an existing tab.
2. Navigate to: `https://system.ordrestyring.dk/scheduler`
3. Click the **"Planlæg service"** button (top-right area of the page).
A right-side panel opens titled "Planlæg service" with a search box.
---
## Step 2: Find the Customer
1. Type the customer's **address** or name in the search field.
2. Results show service agreements — find the correct entry (verify address and customer name match).
3. Click **"Planlæg service"** on the matching result.
The "Opret ordre" form opens on the right.
---
## Step 3: Fill the Form
### Status and Type
- **Status**: Verify **Åben** — don't change.
- **Type**: Select **"Lovpligtig serviceeftersyn"** (or as requested by Kristian).
### Ansvarlig
Scroll to the Medarbejdere section. The Ansvarlig field is an ng-select dropdown.
Type "MO" or "Martin" to find Martin Olsen, then select him. Be careful — Formand and Sælger fields look similar. If unsure which field is focused, use the JavaScript inspection from `ordrestyring-create-order` Step 4 to verify by index.
### Date — Startdato
The date input is Angular Material (`mat-datepicker`) — typing directly is unreliable. Use the calendar:
1. Click the calendar icon (toggle button) next to the date field.
2. If the wrong month is shown, use the navigation arrows.
3. Click the target day via JavaScript:
```javascript
const calendarCells = Array.from(document.querySelectorAll('mat-calendar .mat-calendar-body-cell'));
const targetDay = calendarCells.find(cell => cell.textContent.trim() === '10'); // adjust day
targetDay.click();
```
Slutdato auto-updates to match — this is expected.
### Time — Starttid and Sluttid
Both pickers are `OS-TIMEPICKER` → `ng-select`. The dropdown can have a stale filter — always clear it first:
```javascript
function openTimePicker(pickerIndex) {
  const tp = document.querySelectorAll('OS-TIMEPICKER')[pickerIndex];
  const searchInput = tp.querySelector('ng-select input');
  const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
  nativeSetter.call(searchInput, '');
  searchInput.dispatchEvent(new Event('input', { bubbles: true }));
  tp.querySelector('.ng-select-container').click();
}
openTimePicker(0); // Starttid
```
Then select the time from the open dropdown:
```javascript
const items = document.querySelectorAll('ng-dropdown-panel .ng-option:not(.ng-option-disabled)');
Array.from(items).find(i => i.textContent.trim() === '08:00').click();
```
Repeat for Sluttid: `openTimePicker(1)` then select the end time.
### "Opret planlagt tid for" — Ansvarlig checkbox
Check **only the "Ansvarlig" checkbox** (leave Formand and Yderligere medarbejdere unchecked):
```javascript
const ansvarligCb = Array.from(document.querySelectorAll('input[type="checkbox"]'))
  .find(cb => cb.closest('label')?.textContent?.trim() === 'Ansvarlig');
if (ansvarligCb && !ansvarligCb.checked) {
  ansvarligCb.closest('label').click();
}
ansvarligCb.checked; // verify = true
```
---
## Step 4: Verify and Submit
Before clicking "Opret ordre", confirm:
- Leveringsadresse: correct customer
- Status: **Åben**, Type: **Lovpligtig serviceeftersyn**
- Startdato + Starttid + Sluttid: correct
- Ansvarlig: **MO - Martin Olsen** (or as requested)
- "Ansvarlig" checkbox: **checked**
Click **"Opret ordre"** (green button). Toast "Ordre oprettet" = success.
---
## Known Issues & Workarounds
| Problem | Solution |
|---------|----------|
| Date input shows "00/00/0000" after typing | Use calendar picker + JS click on `.mat-calendar-body-cell` |
| Time dropdown shows "No items found" | Clear stale filter with native input setter before clicking container |
| Checkbox doesn't respond to click | Use `label.click()` via JavaScript |
| Ansvarlig and Formand look identical | JS map (see `ordrestyring-create-order` Step 4) — trust JS over screenshot |
| Accidentally added someone to Sælger | Click **×** on that person's tag to remove |
| DPR=2 high-DPI display | Screenshot coords ≈ CSS coords × 0.6412 |
---
## Tab Management
Følg `browser-usage-rules`: opret en ny tab med `tabs_create_mcp` ved start, og luk den med `window.close()` via `javascript_tool` når opgaven er færdig.
