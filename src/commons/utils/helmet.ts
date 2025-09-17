import helmet from 'helmet';

const isProd = process.env.NODE_ENV === 'production';

export const helmetConfig = helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", ...(isProd ? [] : ["'unsafe-inline'", 'cdn.jsdelivr.net'])],
      styleSrc: ["'self'", 'fonts.googleapis.com', ...(isProd ? [] : ["'unsafe-inline'", 'cdn.jsdelivr.net'])],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'cdn.jsdelivr.net'],
      connectSrc: ["'self'", 'cdn.jsdelivr.net'],
    },
  },
  crossOriginEmbedderPolicy: false, // necesario para cargar fuente
});
