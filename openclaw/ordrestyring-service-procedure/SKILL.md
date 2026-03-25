---
name: ordrestyring-service-procedure
description: >
  Amalo's full workflow for assigning a service task to the service department: creates
  an order in Ordrestyring and sends a Slack notification to #drift-team. Use this skill
  when Kristian wants to pass a task to the service team — e.g. "opret en serviceordre
  til [tekniker] baseret på denne ticket", "send det videre til serviceafdelingen",
  "book en opgave til PNT", "opret ordre og giv drift-teamet besked", or when working
  from a HubSpot ticket and the next step is to create a task for a technician.
  This skill handles both steps: order creation AND the Slack message.
---
# Service Procedure — Tildel opgave til serviceafdeling
This skill covers Amalo's full workflow for handing off a customer issue to the service department:
1. **Opret ordre** i Ordrestyring for the assigned technician
2. **Send Slack-besked** til #drift-team med ordre-nummer og hvem der er ansvarlig
Both steps should be completed. The skill is typically triggered from a HubSpot ticket or a customer issue Kristian describes directly.
---
## Step 1: Gather Information
Before starting, collect the following — most of it typically comes from a HubSpot ticket or Kristian's description:
| Field | Notes |
|-------|-------|
| **Kunde** | Customer name, e.g. "Denny Jakobsen" |
| **Adresse** | For reference and verification |
| **Projektnavn** | Short title of the issue, e.g. "Sikkerhedsventil - trykfald og lyde" |
| **Beskrivelse** | Full problem description (symptoms, error codes, diagnosis) |
| **Bemærkninger** | Internal notes from Kristian (admin comments, upsell suggestions) |
| **Ansvarlig tekniker** | Who to assign — Kristian will specify. Common choices: PNT (Per Nørager Thaysen), MO (Martin Olsen) |
| **Dato** | Default: **today** ("Planlæg nu"). Ask if a specific future date is needed. |
---
## Step 2: Opret ordre i Ordrestyring
Follow the **`ordrestyring-create-order`** skill for the full step-by-step instructions. Summary:
1. Navigate to `https://system.ordrestyring.dk/scheduler`
2. Click **"Opret" → "Ordre"**
3. Search for the customer by name
4. Fill in the form:
   - **Type**: Service
   - **Status**: Åben
   - **Projektnavn**: short title
   - **Beskrivelse**: full problem description
   - **Bemærkninger**: internal notes
   - **Ansvarlig**: the assigned technician (use JS ng-select inspection to confirm field index)
   - **Planlæg nu**: activate via JS label click (or set specific date)
   - **Ansvarlig checkbox**: check via JS label click
5. Click **"Opret ordre"** — wait for the green "Ordre oprettet" toast
6. Navigate to `https://system.ordrestyring.dk/cases` and note the **order number** (top of list)
---
## Step 3: Send Slack-besked til #drift-team
After noting the order number, send a message to #drift-team tagging the assigned technician.
### Channel and known user IDs
| Name | Slack ID |
|------|----------|
| #drift-team | `C02GHUC9GPM` |
| Per Nørager Thaysen (PNT) | `U01D545NBHC` |
For other technicians not listed above, use `slack_search_users` with the technician's name to find their Slack ID.
### Message format
Use a clear, concise format — include order number, customer, address, and a brief summary of the issue:
```
Ordre #[nummer] oprettet til <@[slack-id]>
*Kunde:* [Kundenavn] — [Adresse]
*Opgave:* [Kort beskrivelse af problemet]
```
Example from session:
```
Ordre #7794 oprettet til <@U01D545NBHC>
*Kunde:* Denny Jakobsen — Holmehaven 50, 2670 Greve
*Opgave:* Mistanke om skidt i sikkerhedsventilen (dagligt trykfald, lyde, H62 flowfejl)
```
### Send the message
Use `slack_send_message` with:
- `channel_id`: `C02GHUC9GPM` (or found via `slack_search_channels`)
- `message`: the formatted message above
Confirm to Kristian that both the order has been created and the Slack message has been sent, including the order number.
---
## Tab Management
Følg `browser-usage-rules`: opret en ny tab med `tabs_create_mcp` ved start, og luk den med `window.close()` via `javascript_tool` når opgaven er færdig.
---
## Checklist
Before considering the task done:
- [ ] Order created in Ordrestyring with correct Type, Status, Projektnavn, Beskrivelse, Bemærkninger
- [ ] Correct technician set as Ansvarlig
- [ ] Date planned (today or specific date)
- [ ] Order number noted
- [ ] Slack message sent to #drift-team with order number and technician tagged
