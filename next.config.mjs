import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin(`./i18n.ts`);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};


**4. Railway'da manual deploy:**

Agar avtomatik aniqlamasa:
- Service → **Settings** → **Build Command**:
```
  npm install && npm run build
```
- **Start Command**:
```
  npm start
```

export default withNextIntl(nextConfig);
