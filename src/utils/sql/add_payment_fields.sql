
-- Add payment-related fields to the appointments table
ALTER TABLE public.appointments 
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS payment_id TEXT,
ADD COLUMN IF NOT EXISTS consultation_type TEXT DEFAULT 'in-person',
ADD COLUMN IF NOT EXISTS fee_amount INTEGER;
