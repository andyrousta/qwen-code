/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */

export type InsightTaskStatus = 'progress' | 'ready' | 'failed' | 'cancelled';

export interface InsightTaskState {
  status: InsightTaskStatus;
  stage: string;
  progress?: number;
  detail?: string;
  reportPath?: string | null;
  error?: string | null;
}

export interface InsightTaskCardProps extends InsightTaskState {
  onOpenReport?: () => void;
}
