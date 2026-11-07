import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createSearchLoader, searchEntries } from '../src/lib/search.ts';
import { searchableText, searchSummary } from '../src/lib/search-content.mjs';

test('search finds command options inside code while summaries omit terminal output', () => {
  const body = 'Run a remote command with a connection timeout.\n\n```bash\nssh -o ConnectTimeout=5 host "echo test"\n```\n\n~~~text\n@@@@@@@@ WARNING @@@@@@@@\n~~~';
  const entry = { title: 'SSH commands', permalink: '/ssh/', kind: 'til', excerpt: searchSummary(body), searchText: searchableText(body).toLowerCase() };
  assert.equal(searchEntries([entry], 'ConnectTimeout')[0], entry);
  assert.equal(entry.excerpt, 'Run a remote command with a connection timeout.');
  assert.doesNotMatch(entry.excerpt, /WARNING|@|ConnectTimeout/);
  assert.match(searchableText('C# and snake_case identifiers'), /C# and snake_case/);
  assert.ok(searchableText('```sh\nssh -i ~/.ssh/id_rsa [user@]hostname\n```').includes('~/.ssh/id_rsa [user@]hostname'));
  assert.equal(searchableText('Go (language) and [docs](https://go.dev/)'), 'Go (language) and docs');
});

test('search uses consistent ranking, case folding and all query terms', () => {
  const entries = [
    { title: 'Remote commands', searchText: 'remote commands ssh timeout' },
    { title: 'SSH timeout', searchText: 'ssh timeout' },
    { title: 'SSH keys', searchText: 'ssh keys' },
  ];
  assert.deepEqual(searchEntries(entries, '  SSH timeout  ').map(e => e.title), ['SSH timeout', 'Remote commands']);
  assert.deepEqual(searchEntries(entries, 'missing'), []);
  assert.deepEqual(searchEntries(entries, '   '), []);
});

test('a failed index request can be retried and successful concurrent loads are shared', async () => {
  let requests = 0;
  const entries = [{ title: 'SSH', searchText: 'ssh' }];
  const load = createSearchLoader(async () => {
    ++requests;
    return requests === 1
      ? new Response('Unavailable', { status: 503 })
      : Response.json(entries);
  });
  await assert.rejects(load(), /503/);
  const first = load();
  const concurrent = load();
  assert.equal(first, concurrent);
  assert.deepEqual(await first, entries);
  assert.deepEqual(await load(), entries);
  assert.equal(requests, 2);
});
