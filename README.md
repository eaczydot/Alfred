# Alfred
Crime AI Reporter - Camera-first incident reporting app with AI analysis

## Project Structure

This is a React Native (Expo) application with the following file structure:

```
app/
├── (tabs)/
│   ├── _layout.tsx
│   ├── feed.tsx
│   ├── index.tsx
│   └── profile.tsx
├── _layout.tsx
├── +not-found.tsx
└── report.tsx

assets/
└── images/
    ├── adaptive-icon.png
    ├── favicon.png
    ├── icon.png
    └── splash-icon.png

components/
├── ui/
│   ├── Badge.tsx
│   ├── Button.tsx
│   └── Card.tsx
└── IncidentCard.tsx

constants/
├── categories.ts
├── colors.ts (deprecated)
├── config.ts
└── theme.ts

contexts/
└── AppContext.tsx

types/
└── index.ts

Root files:
├── .gitignore
├── app.json
├── bun.lock
├── design-system.v1.schema.json
├── eslint.config.js
├── metro.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## Key Features

- **Camera-first interface**: Main screen focused on capturing incident photos
- **AI Analysis**: Automatic incident categorization and description generation  
- **Feed**: View reported incidents with list/grid toggle
- **Profile**: Track impact metrics, tier levels, and achievements
- **Dark theme**: OLED-friendly design with cyan/amber accents

## Tech Stack

- React Native (Expo)
- TypeScript
- expo-camera
- expo-location
- @rork-ai/toolkit-sdk (AI analysis)
- @tanstack/react-query
- lucide-react-native (icons)
