# Phase 2 - Stories And Reading

Status: complete

## Goals

- Load story library/search/detail from backend stories and metadata endpoints.
- Adapt backend story DTOs to the current `Book` presentation model.
- Start/resume reading sessions from backend.
- Persist progress and complete sessions through backend reading APIs.
- Use backend TTS audio/timings when available, with text fallback otherwise.

## Implemented

- Added story DTOs/adapters and `storyApi` for `/stories`, `/stories/{id}`, `/genres`, and `/authors`.
- Added reading DTOs and `readingApi` for session start/active/detail/progress/complete.
- Added React Query hooks for stories and reading sessions.
- Child library, search, and book detail now load from backend story data.
- Reading screen starts/resumes backend sessions, throttles progress updates, completes sessions, and uses backend TTS audio/timings when `READY`.
- Story cover/difficulty remain generated/defaulted because backend does not expose those fields.
