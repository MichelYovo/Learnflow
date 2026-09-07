# LearnFlow

Plateforme APC Togo : app élève, version web, back-office et site vitrine.

```
LearnFlow/
├── mobile/              App élève React Native (Expo)
├── learnflow-web/       Version web élève (Next.js, port 3002)
├── admin/               Back-office admin (Next.js, port 3001)
└── site-vitrine-lf/     Site vitrine (Next.js, port 3000)
```

Chaque dossier a son propre `package.json` et ses dépendances. On lance l’app depuis son dossier.

## Mobile

```bash
cd mobile
npm install
npm start
```

Expo Go sur le téléphone, ou `npm run android` / `npm run ios`.

## Web élève

```bash
cd learnflow-web
npm install
npm run dev
```

Ouvre [http://localhost:3002](http://localhost:3002).

## Admin

```bash
cd admin
npm install
npm run dev
```

Ouvre [http://localhost:3001](http://localhost:3001).

## Site vitrine

```bash
cd site-vitrine-lf
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000).
