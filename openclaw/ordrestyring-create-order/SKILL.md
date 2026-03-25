---
name: ordrestyring-create-order
description: >
  General workflow for creating an order (ordre) in Amalo's Ordrestyring system
  (system.ordrestyring.dk) via the "Opret → Ordre" flow. Use this skill as a reference
  whenever any other skill or workflow involves creating an order in Ordrestyring. Also
  use directly when Kristian says things like "opret en ordre i ordrestyring", "lav en
  ny ordre til [kunde]", "opret en fejlordre", or similar — especially when based on a
  HubSpot ticket or a specific customer issue.
---
# Opret ordre i Ordrestyring
This skill documents the general "Opret → Ordre" workflow in Ordrestyring. It covers the steps, Angular/ng-select workarounds, and known gotchas for creating any type of order.
Other skills (e.g. `ordrestyring-service-procedure`) build on top of this — if you're following a higher-level skill, read this for the low-level form-filling details.
---
## Information to Gather First
Before opening the browser, make sure you have:
| Field | Notes |
|-------|-------|
| **Kunde (customer)** | Name or partial name to search for, e.g. "Denny Jakobsen" |
| **Projektnavn** | Short title describing the task |
| **Beskrivelse** | Full description of the problem or task |
| **Bemærkninger** | Any internal notes (admin, upsell, caveats) |
| **Type** | e.g. "Service", "Lovpligtig serviceeftersyn" — default: **Service** |
| **Status** | Default: **Åben** |
| **Ansvarlig** | Technician's initials/name, e.g. PNT, MO |
| **Planlæg dato** | Default: **today** (use "Planlæg nu" toggle). Ask if a specific date is needed. |
---
## Step 1: Navigate and Open the Form
1. Call `tabs_create_mcp` to open a fresh tab — always create a new one, never reuse an existing tab.
2. Navigate to: `https://system.ordrestyring.dk/scheduler`
3. Click the **"Opret"** dropdown button (top-right of the page).
4. In the dropdown menu, click **"Ordre"**.
A side panel opens with a **Kunde** search field.
---
## Step 2: Search for Customer
1. Click into the Kunde search field (it's an ng-select component).
2. Type part of the customer's name (e.g. "Denny").
3. A dropdown list appears — click the correct entry. Verify the address matches.
The full "Opret ordre" form opens on the right side.
---
## Step 3: Fill the Form
Work top to bottom through the form.
### Status and Type
- **Status**: Verify it shows **Åben** — don't change unless asked.
- **Type**: Select the appropriate type. For ad hoc issues: **"Service"**. For scheduled annual inspections: **"Lovpligtig serviceeftersyn"**.
The Type field is a standard Angular `mat-select` — click it and choose the option from the list.
### Projektnavn
Free text. Type a short, descriptive title. Example: `"Sikkerhedsventil - trykfald og lyde"`
### Beskrivelse
Free text. Include:
- Customer's reported symptoms
- Error codes (if any)
- Your technical assessment/diagnosis
### Bemærkninger
Free text. Internal notes — e.g. admin suggestions, upsell ideas, anything not customer-facing.
---
## Step 4: Set Ansvarlig (Responsible Technician)
The Medarbejdere section contains multiple ng-select dropdowns that look similar. **Do not rely on visual position alone** — confirm which field is which via JavaScript first.
### Identify the Ansvarlig field
```javascript
// Map all ng-select components to their labels and current values
const ngSelects = Array.from(document.querySelectorAll('ng-select'));
ngSelects.map((ns, i) => {
  const parent = ns.closest('div') || ns.parentElement;
  const labelDiv = parent?.previousElementSibling;
  return {
    index: i,
    label: labelDiv?.textContent?.trim(),
    selected: ns.querySelector('.ng-value-label')?.textContent?.trim() || 'ingen'
  };
});
```
Find the entry where `label === 'Ansvarlig'` — note its index (typically **10** in this form, but verify).
### Open and select
```javascript
// Open the Ansvarlig dropdown (adjust index if needed)
const ngSelects = Array.from(document.querySelectorAll('ng-select'));
ngSelects[10].querySelector('.ng-select-container').click();
```
Type the technician's initials in the search input (e.g. "PNT" for Per Nørager Thaysen, "MO" for Martin Olsen), then click the matching option.
> **Warning**: Ansvarlig and Formand look visually identical. Always use the JS map to confirm the index before clicking.
---
## Step 5: Set Date ("Planlæg nu" or specific date)
### Option A — Plan for today ("Planlæg nu")
Activate the toggle via JavaScript (direct click is unreliable):
```javascript
const label = Array.from(document.querySelectorAll('label'))
  .find(l => l.textContent.trim() === 'Planlæg nu');
label.click();
```
The date auto-fills to today's date.
### Option B — Specific future date
Click the calendar icon next to the date field, then use JavaScript to click the target day:
```javascript
const calendarCells = Array.from(document.querySelectorAll('mat-calendar .mat-calendar-body-cell'));
const targetDay = calendarCells.find(cell => cell.textContent.trim() === '12'); // adjust day
targetDay.click();
```
If the calendar shows the wrong month, click the navigation arrows first.
---
## Step 6: Check the "Ansvarlig" Checkbox
After setting the date, check the "Ansvarlig" checkbox in the "Opret planlagt tid for" section. Direct DOM clicks on Angular Material checkboxes are unreliable — use label click:
```javascript
const ansvarligCb = Array.from(document.querySelectorAll('input[type="checkbox"]'))
  .find(cb => cb.closest('label')?.textContent?.trim() === 'Ansvarlig');
if (ansvarligCb && !ansvarligCb.checked) {
  ansvarligCb.closest('label').click();
}
ansvarligCb.checked; // should return true
```
---
## Step 7: Verify and Submit
Before submitting, confirm:
- Leveringsadresse (customer): correct
- Status: **Åben**
- Type: correct
- Projektnavn: filled
- Beskrivelse: filled
- Ansvarlig: correct technician
- Date: today or requested date
- "Ansvarlig" checkbox: **checked**
Click **"Opret ordre"** (green button, bottom-right). A green toast "Ordre oprettet" confirms success.
---
## Step 8: Find the Order Number
Navigate to `https://system.ordrestyring.dk/cases`. The new order appears at the top (most recently created). Note the **order number** (e.g. #7794) — the calling skill or Kristian may need it.
---
## Tab Management
Følg `browser-usage-rules`: opret en ny tab med `tabs_create_mcp` ved start, og luk den med `window.close()` via `javascript_tool` når opgaven er færdig.
---
## Known Issues & Workarounds
| Problem | Solution |
|---------|----------|
| Can't tell Ansvarlig from Formand visually | Run the JS map (Step 4) — trust JS index over screenshot |
| "Planlæg nu" toggle doesn't respond to click | Use JavaScript label click |
| Date input shows "00/00/0000" after typing | Use calendar picker + JS cell click instead |
| Checkbox has no effect when clicked directly | Use `label.click()` via JavaScript |
| ng-select dropdown shows "No items found" | Stale filter — clear input value with native setter before opening |
| DPR=2 high-DPI display | Screenshot coords ≈ CSS coords × 0.6412 |
