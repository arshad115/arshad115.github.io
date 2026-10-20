import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createContactHandler } from '../worker/index.js';

function contactRequest(fields = {}, origin = 'https://arshadmehmood.com') {
  const form = new FormData();
  for (const [name, value] of Object.entries({
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    website: 'https://example.com',
    message: 'Hello from the contact form.',
    ...fields,
  })) form.set(name, value);

  return new Request(`${origin}/api/contact`, {
    method: 'POST',
    headers: { Origin: origin },
    body: form,
  });
}

test('contact Worker injects the server-side access key', async () => {
  let forwarded;
  const handler = createContactHandler(async (_url, init) => {
    forwarded = JSON.parse(init.body);
    return Response.json({ success: true });
  });

  const response = await handler(contactRequest(), { W3FORMS_ACCESS_KEY: 'server-only-key' });
  assert.equal(response.status, 200);
  assert.equal(forwarded.access_key, 'server-only-key');
  assert.equal(forwarded.email, 'ada@example.com');
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('contact Worker rejects cross-origin and invalid submissions', async () => {
  const neverFetch = async () => assert.fail('upstream must not be called');
  const handler = createContactHandler(neverFetch);

  const crossOrigin = contactRequest();
  crossOrigin.headers.set('Origin', 'https://attacker.example');
  assert.equal((await handler(crossOrigin, { W3FORMS_ACCESS_KEY: 'key' })).status, 403);

  const invalid = contactRequest({ email: 'not-an-email' });
  assert.equal((await handler(invalid, { W3FORMS_ACCESS_KEY: 'key' })).status, 400);
});

test('contact Worker silently accepts a filled honeypot without forwarding', async () => {
  const handler = createContactHandler(async () => assert.fail('upstream must not be called'));
  const response = await handler(contactRequest({ botcheck: 'filled' }), { W3FORMS_ACCESS_KEY: 'key' });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true, message: 'Message received.' });
});
