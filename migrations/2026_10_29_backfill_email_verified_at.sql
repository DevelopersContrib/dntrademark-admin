-- Migration: Backfill email_verified_at for existing users
-- Ticket:    VNOC #66287
-- Author:    Ronan Lee
-- Date:      2026-10-29
--
-- The `email_verified_at` column already exists in the `users` table
-- (used by the admin panel / Laravel backend). This migration marks all
-- existing users as verified so they are not locked out by the new
-- email-verification flow. Only NEW sign-ups after this deploy will need
-- to verify their email.
--
-- Run this ONCE on the production DB BEFORE or AT the same time as
-- deploying this branch.
--
-- ⚠ DO NOT run automatically — review and execute manually.

UPDATE users
SET    email_verified_at = NOW(),
       updated_at        = NOW()
WHERE  email_verified_at IS NULL;
