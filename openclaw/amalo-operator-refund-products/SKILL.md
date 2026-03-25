---
name: amalo-operator-refund-products
description: >
  Refunds products for an Amalo customer in Amalo Operator (app.amalo.dk). This covers the full
  workflow: creating one kreditnota (credit note) per product to be refunded, sending each kreditnota,
  then processing a refund on the customer's most recent completed payment. Use this skill whenever
  Kristian says things like "krediter dette produkt", "lav en kreditnota", "refunder kunden",
  "vi skal kreditere X", "lav en tilbagebetaling", "refund", or when working from a HubSpot ticket
  where the resolution involves crediting or refunding one or more products. Also use when Kristian
  mentions a specific product that needs to be credited on a deal, even if he doesn't use the word
  "kreditnota" explicitly.
---
# Amalo Operator — Refund Products
This skill handles product refunds in **Amalo Operator** (app.amalo.dk) for Amalo ApS. The workflow has two phases: creating kreditnotaer (credit notes) and then processing the actual refund on the customer's payment.
## Important Constraint
Amalo Operator does not yet support multi-line kreditnotaer. If multiple products need to be refunded, create **one separate kreditnota for each product**. This is the most critical thing to remember — never try to add multiple product lines to a single kreditnota.
## Concepts
**Kreditnota** = A credit note. In Amalo Operator, it's simply a faktura (invoice) with a negative quantity. You create it by making a new faktura with `Antal = -1`. The system handles the rest.
**Pris i øre** = The price field uses øre (1/100 of a krone). So 1.500 kr = `150000` in the Pris field. Always convert before entering.
**Moms (VAT)** = 25% is added automatically by the system. Prices entered in the Pris field are excl. moms. Example: Pris = 150000 øre (1.500 kr excl.) → system shows 1.875 kr incl. moms.
**"Diverse" produkt** = For non-standard items not in the product catalog, use the product type "Diverse". This lets you enter a custom description and price.
## Prerequisites
Before starting, you need:
- The **deal** in Amalo Operator where the products were originally invoiced
- The **product name(s)** and **price(s)** to credit (these may come from a HubSpot ticket, Kristian's instructions, or the deal's existing invoices)
- If the product isn't a standard catalog item, you'll use "Diverse" and need the custom description and price
## Phase 1: Create Kreditnotaer
Repeat this phase for **each product** that needs to be refunded.
### Step 1: Navigate to the Deal
Go to the deal page in Amalo Operator. The URL pattern is:
```
https://app.amalo.dk/deals/{deal_id}
```
If you don't have the deal ID, search for the customer or navigate from a HubSpot ticket link.
### Step 2: Open the Fakturaer Section
On the deal page, find the **Fakturaer** (Invoices) section. This is where you create new invoices, including kreditnotaer.
### Step 3: Create a New Faktura
Click the button to create a new faktura. This opens the invoice creation form.
### Step 4: Add the Product Line
- **Product**: Select the product to credit. If it's a standard product, search for it by name. If it's a non-standard item, select **"Diverse"** and enter the custom description.
- **Antal (Quantity)**: Set to **-1** — this is what makes it a kreditnota rather than a regular invoice.
- **Pris (Price)**: Enter the price **in øre, excl. moms**. Remember: multiply the krone amount by 100. For example:
  - 2.000 kr → `200000`
  - 1.500 kr → `150000`
  - 500 kr → `50000`
### Step 5: Save and Verify
Save the faktura. Verify that:
- The total shows a **negative** amount (since Antal is -1)
- The moms (25%) is calculated correctly
- The product description matches what should be credited
### Step 6: Send the Kreditnota
Send the kreditnota — this finalizes it and assigns a kreditnota number (e.g., 1020196).
Note the kreditnota number and amount for each one — you'll need these for the refund reason field later.
### Repeat
If there are more products to credit, go back to Step 3 and create another separate kreditnota. Each product gets its own kreditnota.
## Phase 2: Process the Refund
After all kreditnotaer are created and sent, process the actual money refund.
### Step 1: Navigate to the Customer's Contact Page
The Betalinger (Payments) tab on the deal page is not yet fully implemented — it may show placeholder content. Instead, navigate to the **contact/customer page**. You can do this via breadcrumbs at the top of the deal page (click the customer name).
The contact page URL pattern is:
```
https://app.amalo.dk/contacts/{contact_id}
```
### Step 2: Find the Betalinger Section
On the contact page, scroll to the **Betalinger** (Payments) section. This shows all payments for the customer across deals.
### Step 3: Locate the Target Payment
Find the most recent payment with status **"Behandlet"** (Processed). This is typically the payment you want to refund against. Confirm with Kristian if unclear which payment to use.
### Step 4: Open the Refund Dialog
Click the **three-dot menu (⋮)** on the target payment row. Use the `find` tool to locate it reliably — coordinate clicks on these small menu icons can be unreliable:
```
find: "three-dot menu" or "⋮" or "menu" on the payment row
```
From the dropdown, click **"Refunder betaling"** (Refund payment). Again, prefer using the `find` tool + ref click:
```
find: "Refunder betaling"
```
### Step 5: Fill in the Refund Form
A refund dialog will appear with:
- **Beløb (Amount)**: Enter the **total** amount to refund in kroner (the sum of all kreditnotaer, incl. moms). For example, if you created two kreditnotaer for 2.000 kr and 1.875 kr incl. moms, enter `3875`.
- **Årsag (Reason)**: Write a descriptive reason referencing the kreditnota numbers and what was credited. Example:
  ```
  Kreditnota 1020196 (ekstra kabelføring, -2.000 kr) + kreditnota 1020197 (indrykning varmepumpe, -1.875 kr)
  ```
### Step 6: Submit the Refund
Click **"Refunder"** to process the refund. Confirm the success message appears.
## Browser Automation Tips
- **Use `find` + ref clicks** for dropdown menus and dialog buttons. Coordinate clicks on small UI elements (three-dot menus, dropdown items) are unreliable and may close the dropdown or navigate away instead.
- **Screenshots**: Take screenshots after key steps (kreditnota creation, refund confirmation) for verification.
- **Betalinger location**: Always use the contact page for Betalinger — the deal page's Betalinger tab is under development.
## Troubleshooting
| Problem | Solution |
|---------|----------|
| Three-dot menu click navigates away instead of opening dropdown | Use `find` tool to get ref, then click via ref |
| "Refunder betaling" option not visible | Make sure the dropdown actually opened; retry with `find` + ref |
| Betalinger tab on deal page shows placeholder | Navigate to contact page via breadcrumbs instead |
| Pris field doesn't accept value | Ensure you're entering øre (multiply kr by 100), no decimals |
| Can't find the product in search | Use "Diverse" for non-standard products |
## Tab Management
Følg `browser-usage-rules`: opret en ny tab med `tabs_create_mcp` ved start, og luk den med `window.close()` via `javascript_tool` når opgaven er færdig.
