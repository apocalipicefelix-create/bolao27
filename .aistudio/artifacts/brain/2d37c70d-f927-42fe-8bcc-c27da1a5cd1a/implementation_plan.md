# Implementation Plan - Hamburger Menu & Remove Horizontal Scrolling

## Objective
Replace horizontal scrolling with a clean toggleable dropdown menu (hamburger menu) in the header. When clicking the menu button, all options (Home, Table, Stats, Admin, Theme Toggle, Notifications, Regulation) open in a dropdown/collapsible menu.

## Changes
1. **Update `src/App.tsx`**:
   - Add state `isMenuOpen` (boolean).
   - Add a hamburger menu toggle button (`Menu` / `X` icon from `lucide-react`).
   - Wrap the navigation tabs and action tools inside a clean responsive container that collapses into a toggleable dropdown menu when clicked.
   - Remove any horizontal scroll requirements.

## Verification
- Run `compile_applet` and `lint_applet` to verify compilation and lint checks.
