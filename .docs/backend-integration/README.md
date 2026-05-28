# Backend Integration Notes

Status: implemented in frontend

This folder tracks the frontend work needed to connect LexEase FE to the implemented Spring Boot endpoints in `lexease-be/.notes/process`.

## Endpoint Scope

- Auth: `/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/logout`, `/me`.
- Stories: `/stories`, `/stories/{id}`, `/genres`, `/authors`.
- Reading: `/sessions`, `/sessions/active`, `/sessions/{id}`, `/sessions/{id}/progress`, `/sessions/{id}/complete`.
- Family links: `/guardian-child-links` and status actions.
- Display settings: `/children/{childId}/display-settings`.
- Story access: `/story-access/block`, `/story-access/unblock`.

## Known Backend Gaps

- No forgot-password endpoint.
- No recording upload/sync endpoint.
- No guardian analytics/reporting endpoint over reading sessions.
- No scheduler/reminder endpoint.
- Guardian-child link responses include ids/status only, not child profile fields.
- Story responses do not expose cover image or difficulty yet.

## Verification

- `npm run lint`: passed with zero warnings/errors.
- `npx tsc --noEmit`: passed.
- Manual API smoke was not run in this pass because the backend server was not started from this frontend implementation session.
