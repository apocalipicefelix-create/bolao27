# Implementation Plan - Automatic Point Saving & Instant Sync

## Objective
Automatically save and sync participant score adjustments (points and AP) in real time when the admin modifies them in `AdminPanel.tsx`, updating the standings table visible to all users immediately.

## Changes
1. **Update `src/components/AdminPanel.tsx`**:
   - In `handleFieldChange`, immediately sort, rank, update parent state via `onUpdateParticipants`, and persist to `localStorage` (`bolao_participants_2027`) upon every score adjustment.

## Verification
- Run `compile_applet` and `lint_applet` to verify compilation and lint checks.
