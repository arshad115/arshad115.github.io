import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  assertGiscusForProduction,
  commentsDisabled,
  GISCUS_DEFAULTS,
  giscusConfigured,
  isGiscusEnabled,
} from '../src/lib/giscus-config.mjs';

const secrets = {
  PUBLIC_GISCUS_REPO: 'arshad115/arshad115.github.io',
  PUBLIC_GISCUS_REPO_ID: 'R_repo',
  PUBLIC_GISCUS_CATEGORY: 'Announcements',
  PUBLIC_GISCUS_CATEGORY_ID: 'DIC_cat',
};

test('Giscus uses public defaults and accepts complete overrides', () => {
  assert.equal(giscusConfigured({}), true);
  assert.equal(isGiscusEnabled({}), true);
  assert.equal(GISCUS_DEFAULTS.PUBLIC_GISCUS_REPO, 'arshad115/arshad115.github.io');
  assert.equal(giscusConfigured(secrets), true);
  assert.equal(isGiscusEnabled(secrets), true);
});

test('COMMENTS_DISABLED wins even when secrets are present', () => {
  assert.equal(commentsDisabled({ COMMENTS_DISABLED: 'true' }), true);
  assert.equal(commentsDisabled({ PUBLIC_COMMENTS_DISABLED: 'yes' }), true);
  assert.equal(isGiscusEnabled({ ...secrets, COMMENTS_DISABLED: '1' }), false);
});

test('production assert accepts public defaults or an explicit off flag', () => {
  assert.doesNotThrow(() => assertGiscusForProduction({}));
  assert.doesNotThrow(() => assertGiscusForProduction({ COMMENTS_DISABLED: 'true' }));
  assert.doesNotThrow(() => assertGiscusForProduction(secrets));
});
