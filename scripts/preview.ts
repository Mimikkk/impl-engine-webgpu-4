#!/usr/bin/env -S deno run -A

/**
 * Preview server script
 * Equivalent to: npm run preview
 */

async function startPreviewServer() {
  console.log('👀 Starting preview server...');

  try {
    // First, ensure the project is built
    console.log('🔨 Building project first...');
    const buildProcess = new Deno.Command('deno', {
      args: ['task', 'build'],
      cwd: Deno.cwd(),
    });

    const buildResult = await buildProcess.output();

    if (!buildResult.success) {
      console.error('❌ Build failed, cannot start preview server');
      Deno.exit(1);
    }

    // Start a simple HTTP server to serve the built files
    console.log('🌐 Starting HTTP server on http://localhost:8000');

    const serverProcess = new Deno.Command('deno', {
      args: [
        'run',
        '-A',
        '--allow-net',
        '--allow-read',
        'jsr:@std/http/file-server',
        './dist',
      ],
      cwd: Deno.cwd(),
      stdout: 'inherit',
      stderr: 'inherit',
    });

    const child = serverProcess.spawn();

    // Handle graceful shutdown
    const handleShutdown = () => {
      console.log('\n🛑 Shutting down preview server...');
      child.kill('SIGTERM');
      Deno.exit(0);
    };

    Deno.addSignalListener('SIGINT', handleShutdown);
    Deno.addSignalListener('SIGTERM', handleShutdown);

    await child.status;
  } catch (error) {
    console.error('❌ Preview server error:', error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  await startPreviewServer();
}
