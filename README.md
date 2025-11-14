This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Contributors
Zarret Mills - GitHub: ZarretKieran

## Deployment 
Once again, Vercel Hobby users cannot deploy from a team, so I deployed this project to Vercel from a cloned version of this repo in my personal GitHub at https://github.com/ZarretKieran/zarretkieran-hw3.

Vercel deployment URL: zarretkieran-hw3.vercel.app

## PRD
https://drive.google.com/file/d/1ULET7aF2T_C3-sMmDHyVD2Qh03RiFXZT/view?usp=sharing

## Getting Started

First, cd into the project root, then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

For AI-powered transcript summarization to work, you need to configure the Gemini API key:

### Local Development
Create a `.env.local` file in the project root:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

Get your API key from: https://ai.google.dev/

### Vercel Deployment
1. Go to your Vercel project dashboard
2. Navigate to **Settings → Environment Variables**
3. Add: `GEMINI_API_KEY` = `your_gemini_api_key_here`

**Note**: If no API key is configured, the app will automatically use a fallback summary generator that provides structured summaries without AI processing.


