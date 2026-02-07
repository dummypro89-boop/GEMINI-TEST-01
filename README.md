# TRULY PILATES (Next.js)

## Current Tech Stack

- Next.js (App Router)
- TypeScript
- TailwindCSS
- react-hook-form + zod (@hookform/resolvers)
- Local JSON mock data with separated model/types for future CMS integration

## Project Structure

- `app/`: App Router pages/layout/globals
- `src/models/`: domain types and content models
- `src/data/`: local JSON mock content
- `src/lib/`: data loader (replaceable with CMS adapter later)
- `src/components/`: UI components (booking form etc.)

## Run

```bash
npm install
npm run dev
```

## Notes

- `src/lib/content.ts` currently reads from `src/data/site-content.json`.
- CMS 연동 시 `src/models/content.ts` 타입은 그대로 유지하고, `src/lib/content.ts`만 교체하면 됩니다.
