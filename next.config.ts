import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/webp'],
    // Гости смотрят с телефона: ширины больше 1080 не нужны.
    deviceSizes: [360, 414, 640, 828, 1080],
  },
  experimental: {
    // CSS (около 12 КБ) встраивается прямо в HTML. Страница рисуется сразу,
    // без отдельного запроса за стилями: на медленной сети это экономит целый
    // круг «запрос-ответ». Работает только в production-сборке.
    inlineCss: true,
  },
};

export default nextConfig;
