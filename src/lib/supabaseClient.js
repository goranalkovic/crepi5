import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
	'https://yxnciwyqkkxjpixhaalc.supabase.co',
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl4bmNpd3lxa2t4anBpeGhhYWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTEwMDUwNjIsImV4cCI6MjAwNjU4MTA2Mn0.djnee0zhdOT3D43sijLQtgy8nSnrCOl0YHWLTW7ZXmQ'
);
