/**
 * Application-wide constants and configuration values
 */

// Timing constants (in milliseconds)
export const HEALTH_CHECK_INTERVAL_MS = 13 * 60 * 1000; // 13 minutes
// Post-stream: the server saves the script after [DONE]; the client polls the
// project until scriptId appears, then gives up into a retryable error state.
export const SCRIPT_SAVE_POLL_INTERVAL_MS = 2000;
export const SCRIPT_SAVE_POLL_MAX_ATTEMPTS = 15; // ~30s total
