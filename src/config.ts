/**
 * Configuration module for qwen-code
 * Handles environment variables, model settings, and runtime configuration
 */

import * as path from 'path';
import * as os from 'os';

export interface ModelConfig {
  /** The model identifier to use for code generation */
  model: string;
  /** API base URL for the model provider */
  baseUrl: string;
  /** Maximum tokens for a single response */
  maxTokens: number;
  /** Temperature for response generation (0.0 - 2.0) */
  temperature: number;
}

export interface AppConfig {
  /** Model configuration */
  model: ModelConfig;
  /** Directory to store conversation history and cache */
  dataDir: string;
  /** Enable debug logging */
  debug: boolean;
  /** Maximum number of conversation turns to retain in context */
  maxContextTurns: number;
  /** Timeout in milliseconds for API requests */
  requestTimeoutMs: number;
}

/** Default model configuration values */
const DEFAULT_MODEL_CONFIG: ModelConfig = {
  model: process.env.QWEN_MODEL ?? 'qwen-coder-plus-latest',
  baseUrl: process.env.DASHSCOPE_BASE_URL ?? 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  maxTokens: parseInt(process.env.QWEN_MAX_TOKENS ?? '8192', 10),
  temperature: parseFloat(process.env.QWEN_TEMPERATURE ?? '0.7'),
};

/** Resolve the application data directory */
function resolveDataDir(): string {
  const envDir = process.env.QWEN_DATA_DIR;
  if (envDir) {
    return path.resolve(envDir);
  }
  return path.join(os.homedir(), '.qwen-code');
}

/** Build and return the full application configuration */
export function getConfig(): AppConfig {
  return {
    model: DEFAULT_MODEL_CONFIG,
    dataDir: resolveDataDir(),
    debug: process.env.DEBUG === 'true' || process.env.QWEN_DEBUG === 'true',
    maxContextTurns: parseInt(process.env.QWEN_MAX_CONTEXT_TURNS ?? '50', 10),
    requestTimeoutMs: parseInt(process.env.QWEN_REQUEST_TIMEOUT_MS ?? '60000', 10),
  };
}

/** Validate that required environment variables are set */
export function validateConfig(config: AppConfig): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!process.env.DASHSCOPE_API_KEY && !process.env.OPENAI_API_KEY) {
    errors.push(
      'Missing API key: set DASHSCOPE_API_KEY (for Qwen models) or OPENAI_API_KEY (for OpenAI-compatible endpoints)',
    );
  }

  if (config.model.temperature < 0 || config.model.temperature > 2) {
    errors.push(`Invalid temperature value: ${config.model.temperature}. Must be between 0.0 and 2.0`);
  }

  if (config.model.maxTokens < 1 || config.model.maxTokens > 128000) {
    errors.push(`Invalid maxTokens value: ${config.model.maxTokens}. Must be between 1 and 128000`);
  }

  return { valid: errors.length === 0, errors };
}

/** Retrieve the active API key from environment */
export function getApiKey(): string {
  const key = process.env.DASHSCOPE_API_KEY ?? process.env.OPENAI_API_KEY ?? '';
  return key;
}
