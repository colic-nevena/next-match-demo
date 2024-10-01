This is a demo application used as a social platform for meeting and matching new people.

## Getting Started

First, install dependencies and set up the DB:

```bash
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
```

Secondly, run the development server:

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
