# Phase 1 - API Foundation And Auth

Status: complete

## Goals

- Use `http://localhost:8080` as default backend URL with no `/api` prefix.
- Replace mock auth with real backend auth endpoints.
- Persist access/refresh tokens and backend user payload.
- Add backend error and role adapters.
- Refresh access tokens once on `401` before logging out.

## Implemented

- `src/data/api/apiClient.ts` now defaults to `http://localhost:8080`, handles backend error payloads, resolves relative API URLs, attaches bearer tokens, and refreshes once on `401`.
- `src/data/api/authService.ts` now uses real auth endpoints and adapts backend user roles to frontend roles.
- `src/store/useAuthStore.ts` persists access token, refresh token, expiry, and user.
- `src/hooks/useAuthQueries.ts` exposes login/register/logout/me hooks.
- Auth validation now requires backend-compatible 8-character passwords.
