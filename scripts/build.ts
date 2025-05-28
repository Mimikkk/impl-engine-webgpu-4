#!/usr/bin/env -S deno run -A

/**
 * Build script for the Deno project
 * Equivalent to: npm run build
 */

import { ensureDir } from '@std/fs';

async function build() {
  console.log('🔨 Building project...');

  try {
    // Ensure dist directory exists
    await ensureDir('./dist');

    // Build the preview app
    console.log('📦 Building preview app...');
    const buildProcess = new Deno.Command('deno', {
      args: ['run', '-A', 'apps/preview/src/mod.ts'],
      cwd: Deno.cwd(),
    });

    const { success } = await buildProcess.output();

    if (success) {
      console.log('✅ Build completed successfully!');
    } else {
      console.error('❌ Build failed!');
      Deno.exit(1);
    }
  } catch (error) {
    console.error('❌ Build error:', error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await build();
}
