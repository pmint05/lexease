# Phase 3 - Family Links, Settings, And Access

Status: complete

## Goals

- Load guardian-child links from backend instead of demo seeding.
- Add link request/accept/reject/revoke hooks.
- Connect child display settings get/save/reset APIs.
- Add story block/unblock controls for guardian story detail.

## Implemented

- Added `familyApi` and hooks for guardian-child link list/request/accept/reject/revoke.
- Guardian child selector and dashboard now read accepted backend links instead of auto-seeding demo children.
- Added minimal child-link request UI in guardian settings.
- Added display settings API/hooks and sync into reading visual store.
- Added story block/unblock calls from guardian story detail.
- Link display uses shortened child IDs/status because backend link responses do not include child profile fields.
