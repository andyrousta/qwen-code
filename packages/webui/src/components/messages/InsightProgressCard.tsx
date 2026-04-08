/**
 * @license
 * Copyright 2025 Qwen Team
 * SPDX-License-Identifier: Apache-2.0
 */

import type { FC } from 'react';

export type InsightTaskStatus = 'progress' | 'ready' | 'failed' | 'cancelled';

export interface InsightTaskState {
  status: InsightTaskStatus;
  stage: string;
  progress?: number;
  detail?: string;
  reportPath?: string | null;
  error?: string | null;
}

export interface InsightProgressCardProps extends InsightTaskState {
  onOpenReport?: () => void;
}

const clamp = (value: number) => Math.max(0, Math.min(100, Math.round(value)));

export const InsightProgressCard: FC<InsightProgressCardProps> = ({
  status,
  stage,
  detail,
  progress,
  reportPath,
  error,
  onOpenReport,
}) => {
  const isReady = status === 'ready';
  const isFailed = status === 'failed';
  const isCancelled = status === 'cancelled';
  const percent = isReady ? 100 : clamp(progress ?? 0);
  const statusLabel =
    status === 'progress'
      ? 'Generating'
      : status === 'ready'
        ? 'Ready'
        : isFailed
          ? 'Failed'
          : 'Cancelled';

  return (
    <div className="w-full px-[30px] py-2">
      <div className="overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--vscode-widget-border,var(--vscode-panel-border,#2a2f3a))_78%,transparent)] bg-[color-mix(in_srgb,var(--vscode-editor-background)_92%,transparent)] px-4 py-3 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <div className="truncate text-sm font-medium text-[var(--vscode-foreground)]">
                {stage}
              </div>
              <span className="rounded-full border border-[color-mix(in_srgb,var(--vscode-widget-border)_75%,transparent)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--vscode-descriptionForeground)]">
                {statusLabel}
              </span>
            </div>
            <div className="mt-1 text-xs text-[var(--vscode-descriptionForeground)]">
              {isReady ? (
                <>
                  Report saved locally
                  {reportPath ? (
                    <span className="ml-1 break-all text-[var(--vscode-textLink-foreground)]">
                      {reportPath}
                    </span>
                  ) : null}
                </>
              ) : isFailed ? (
                error || 'Insight generation failed.'
              ) : isCancelled ? (
                'Insight generation was cancelled.'
              ) : detail ? (
                detail
              ) : (
                'Processing your chat history…'
              )}
            </div>
          </div>
          <div className="shrink-0 text-xs tabular-nums text-[var(--vscode-descriptionForeground)]">
            {percent}%
          </div>
        </div>

        {!isFailed && !isCancelled ? (
          <div className="mt-2 h-1 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--vscode-widget-border,var(--vscode-panel-border,#2a2f3a))_70%,transparent)]">
            <div
              className="h-full rounded-full bg-[var(--vscode-progressBar-background,#0e70c0)] transition-[width] duration-300 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        ) : null}

        {isReady ? (
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="min-w-0 text-xs text-[var(--vscode-descriptionForeground)]">
              Open the report to review the generated summary.
            </div>
            <button
              type="button"
              className="shrink-0 rounded-md bg-[var(--vscode-button-background)] px-3 py-1.5 text-sm font-medium text-[var(--vscode-button-foreground)] hover:bg-[var(--vscode-button-hoverBackground)]"
              onClick={onOpenReport}
              disabled={!onOpenReport}
            >
              Open report
            </button>
          </div>
        ) : null}

        {isFailed ? (
          <div className="mt-3 text-xs text-[var(--vscode-descriptionForeground)]">
            You can rerun `/insight` after the issue is fixed.
          </div>
        ) : null}

        {isCancelled ? (
          <div className="mt-3 text-xs text-[var(--vscode-descriptionForeground)]">
            You can start `/insight` again whenever you are ready.
          </div>
        ) : null}
      </div>
    </div>
  );
};
