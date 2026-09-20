import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  assertGiscusForProduction,
  commentsDisabled,
  giscusConfigured,
  isGiscusEnabled,
} from '../src/lib/giscus-config.mjs';

const secrets = {
  PUBLIC_GISCUS_REPO: 'arshad115/arshad115.github.io',
  PUBLIC_GISCUS_REPO_ID: 'R_repo',
  PUBLIC_GISCUS_CATEGORY: 'Announcements',
  PUBLIC_GISCUS_CATEGORY_ID: 'DIC_cat',
};

test('Giscus is off without secrets and on when all four are set', () => {
  assert.equal(giscusConfigured({}), false);
  assert.equal(isGiscusEnabled({}), false);
  assert.equal(giscusConfigured(secrets), true);
  assert.equal(isGiscusEnabled(secrets), true);
});

test('COMMENTS_DISABLED wins even when secrets are present', () => {
  assert.equal(commentsDisabled({ COMMENTS_DISABLED: 'true' }), true);
  assert.equal(commentsDisabled({ PUBLIC_COMMENTS_DISABLED: 'yes' }), true);
  assert.equal(isGiscusEnabled({ ...secrets, COMMENTS_DISABLED: '1' }), false);
});

test('production assert requires secrets or an explicit off flag', () => {
  assert.throws(() => assertGiscusForProduction({}), /COMMENTS_DISABLED/);
  assert.doesNotThrow(() => assertGiscusForProduction({ COMMENTS_DISABLED: 'true' }));
  assert.doesNotThrow(() => assertGiscusForProduction(secrets));
});
