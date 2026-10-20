const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';
const MAX_REQUEST_BYTES = 32_000;

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

function textField(form, name, maxLength) {
  const value = form.get(name);
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function validEmail(value) {
  return value.length <= 255 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function createContactHandler(fetchImpl = fetch) {
  return async function handleContact(request, env) {
    if (request.method !== 'POST') {
      return json({ success: false, message: 'Method not allowed.' }, 405);
    }

    const contentLength = Number(request.headers.get('content-length') || 0);
    if (contentLength > MAX_REQUEST_BYTES) {
      return json({ success: false, message: 'Message is too large.' }, 413);
    }

    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) {
      return json({ success: false, message: 'Invalid submission origin.' }, 403);
    }

    if (!env.W3FORMS_ACCESS_KEY) {
      return json({ success: false, message: 'The contact form is temporarily unavailable.' }, 503);
    }

    let form;
    try {
      form = await request.formData();
    } catch {
      return json({ success: false, message: 'Invalid form submission.' }, 400);
    }

    if (textField(form, 'botcheck', 20)) {
      return json({ success: true, message: 'Message received.' });
    }

    const name = textField(form, 'name', 100);
    const email = textField(form, 'email', 255);
    const website = textField(form, 'website', 255);
    const message = textField(form, 'message', 5_000);

    if (!name || !validEmail(email) || !message) {
      return json({ success: false, message: 'Please complete the required fields.' }, 400);
    }

    if (website) {
      try {
        const websiteUrl = new URL(website);
        if (!['http:', 'https:'].includes(websiteUrl.protocol)) throw new Error('Invalid protocol');
      } catch {
        return json({ success: false, message: 'Please enter a valid website URL.' }, 400);
      }
    }

    let upstream;
    try {
      upstream = await fetchImpl(WEB3FORMS_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: env.W3FORMS_ACCESS_KEY,
          subject: 'New message from arshadmehmood.com',
          from_name: 'arshadmehmood.com contact form',
          name,
          email,
          website,
          message,
        }),
      });
    } catch {
      return json({ success: false, message: 'The message service could not be reached.' }, 502);
    }

    const result = await upstream.json().catch(() => ({}));
    if (!upstream.ok || result.success === false) {
      return json({ success: false, message: 'Your message could not be sent.' }, 502);
    }

    return json({ success: true, message: 'Thanks — your message has been sent.' });
  };
}

const handleContact = createContactHandler();

export default {
  async fetch(request, env) {
    const pathname = new URL(request.url).pathname.replace(/\/$/, '');
    if (pathname === '/api/contact') return handleContact(request, env);
    return env.ASSETS.fetch(request);
  },
};
