#!/usr/bin/env node
import { assertGiscusForProduction } from '../src/lib/giscus-config.mjs';

try {
  assertGiscusForProduction();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
