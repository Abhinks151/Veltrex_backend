-- Drop email_verification_tokens table
DROP TABLE IF EXISTS "email_verification_tokens";

-- Drop password_reset_tokens table
DROP TABLE IF EXISTS "password_reset_tokens";

-- Remove is_deleted column drift (added manually to nc_programs)
-- Already exists in the DB from previous work
