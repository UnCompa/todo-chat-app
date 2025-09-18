import dotenv from 'dotenv';
dotenv.config({ override: true });

console.log('🔑 ENV LOADED:', process.env.RESEND_API_KEY);
