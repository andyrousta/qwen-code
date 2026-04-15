#!/usr/bin/env node

/**
 * qwen-code - A fork of QwenLM/qwen-code
 * Main entry point for the CLI application
 */

import { createCLI } from './cli';
import { loadConfig } from './config';
import { logger } from './utils/logger';

const VERSION = process.env.npm_package_version || '0.0.1';

async function main(): Promise<void> {
  try {
    // Load configuration from environment and config files
    const config = await loadConfig();

    // Initialize and run the CLI
    const cli = createCLI(config);
    await cli.run(process.argv);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Fatal error: ${error.message}`);
      // Always log stack trace, not just in DEBUG mode - easier to diagnose issues
      if (error.stack) {
        logger.error(error.stack);
      }
    } else {
      logger.error('An unexpected error occurred');
    }
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason: unknown) => {
  logger.error(
    `Unhandled rejection: ${
      reason instanceof Error ? reason.message : String(reason)
    }`
  );
  // Log the full stack in debug mode for easier troubleshooting
  if (process.env.DEBUG && reason instanceof Error) {
    logger.error(reason.stack || '');
  }
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error: Error) => {
  logger.error(`Uncaught exception: ${error.message}`);
  // Log stack trace for uncaught exceptions to aid debugging
  if (error.stack) {
    logger.error(error.stack);
  }
  process.exit(1);
});

// Graceful shutdown on SIGINT / SIGTERM
process.on('SIGINT', () => {
  logger.info('\nReceived SIGINT. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  logger.info('Received SIGTERM. Shutting down gracefully...');
  process.exit(0);
});

export { VERSION };

main();
