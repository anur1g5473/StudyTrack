-- Force-update your profile
UPDATE public.profiles
SET reg_no = '25BYB0101'
WHERE id = (SELECT id FROM auth.users WHERE email = '25byb0101@studytrack.app');
