#!/usr/bin/env node
/**
 * hubspot.js — HubSpot CLI helper til Maja
 *
 * Usage:
 *   node hubspot.js search-deal <address>
 *   node hubspot.js add-note <dealId> <noteBody>
 *   node hubspot.js add-note-contact <contactId> <noteBody>
 *   node hubspot.js get-deal <dealId>
 *   node hubspot.js search-contact <email>
 *
 * Requires environment variable:
 *   HUBSPOT_TOKEN - HubSpot Private App token
 *   (set in ~/.zshrc or .env file - NEVER hardcode in this file)
 */

const https = require('https');

const TOKEN = process.env.HUBSPOT_TOKEN;
if (!TOKEN) {
  console.error('Error: HUBSPOT_TOKEN environment variable is required.');
  console.error('Set it in your shell: export HUBSPOT_TOKEN="pat-na1-..."');
  process.exit(1);
}

const BASE = 'api.hubapi.com';

function request(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: BASE,
      path,
      method,
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve(data); }
      });
    });
    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(); reject(new Error('timeout')); });
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function searchDeal(address) {
  const body = {
    filterGroups: [{
      filters: [{
        propertyName: 'dealname',
        operator: 'CONTAINS_TOKEN',
        value: address.split(',')[0].trim(),
      }]
    }],
    properties: ['dealname', 'dealstage', 'amount', 'hs_object_id', 'hubspot_owner_id'],
    limit: 10,
  };
  const result = await request('POST', '/crm/v3/objects/deals/search', body);
  return result;
}

async function addNoteToObject(objectId, objectType, noteBody) {
  const note = await request('POST', '/crm/v3/objects/notes', {
    properties: {
      hs_note_body: noteBody,
      hs_timestamp: Date.now().toString(),
    },
    associations: [{
      to: { id: objectId },
      types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: objectType === 'deal' ? 214 : 202 }],
    }],
  });
  return note;
}

async function getDeal(dealId) {
  return request('GET', `/crm/v3/objects/deals/${dealId}?properties=dealname,dealstage,amount,hs_object_id`);
}

async function searchContact(email) {
  const body = {
    filterGroups: [{
      filters: [{ propertyName: 'email', operator: 'EQ', value: email }]
    }],
    properties: ['email', 'firstname', 'lastname', 'hs_object_id'],
    limit: 5,
  };
  return request('POST', '/crm/v3/objects/contacts/search', body);
}

async function main() {
  const [,, cmd, ...args] = process.argv;

  if (cmd === 'search-deal') {
    const result = await searchDeal(args.join(' '));
    if (result.results && result.results.length > 0) {
      console.log(`Fundet ${result.total} deal(s):`);
      result.results.forEach(d => {
        console.log(`  ID: ${d.id} | Navn: ${d.properties.dealname} | Stage: ${d.properties.dealstage}`);
      });
    } else {
      console.log('Ingen deals fundet for:', args.join(' '));
    }
  } else if (cmd === 'add-note') {
    const [dealId, ...noteParts] = args;
    const noteBody = noteParts.join(' ');
    const result = await addNoteToObject(dealId, 'deal', noteBody);
    if (result.id) {
      console.log(`Note oprettet: ${result.id} på deal ${dealId}`);
    } else {
      console.log('Fejl:', JSON.stringify(result));
    }
  } else if (cmd === 'add-note-contact') {
    const [contactId, ...noteParts] = args;
    const noteBody = noteParts.join(' ');
    const result = await addNoteToObject(contactId, 'contact', noteBody);
    if (result.id) {
      console.log(`Note oprettet: ${result.id} på kontakt ${contactId}`);
    } else {
      console.log('Fejl:', JSON.stringify(result));
    }
  } else if (cmd === 'get-deal') {
    const result = await getDeal(args[0]);
    console.log(JSON.stringify(result, null, 2));
  } else if (cmd === 'search-contact') {
    const result = await searchContact(args[0]);
    if (result.results && result.results.length > 0) {
      result.results.forEach(c => {
        console.log(`  ID: ${c.id} | ${c.properties.firstname} ${c.properties.lastname} | ${c.properties.email}`);
      });
    } else {
      console.log('Ingen kontakter fundet');
    }
  } else {
    console.log(`Usage:
  node hubspot.js search-deal <adresse>
  node hubspot.js add-note <dealId> <note tekst>
  node hubspot.js add-note-contact <contactId> <note tekst>
  node hubspot.js get-deal <dealId>
  node hubspot.js search-contact <email>`);
  }
}

main().catch(e => { console.error('Fejl:', e.message); process.exit(1); });
