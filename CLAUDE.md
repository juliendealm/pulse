# Pulse — La question du jour

App d'opinions communautaires en temps réel. Une question par jour, vote parmi 3 options, résultats en direct, expire à minuit.

## Prod
- URL : https://pulse-eight-roan.vercel.app
- Supabase project : `cdxdiecyjejcgvvraamw` (eu-central-1, Frankfurt)
- Déploiement : `npx vercel --prod` depuis `/Users/julien/Desktop/pulse/`

## Stack
- React 18 + Vite (pas de TypeScript — volontaire, vitesse de ship)
- Supabase : Postgres + Realtime sur table `votes`
- Vercel : déploiement statique, variables d'env côté Vercel dashboard

## Architecture

```
src/
  components/
    Countdown.jsx     timer jusqu'à minuit, se recalcule en local
    VoteOption.jsx    bouton vote avec barre de progression animée
    ShareButton.jsx   Web Share API + fallback clipboard
  lib/
    supabase.js       client Supabase (URL + anon key depuis .env)
    useQuestion.js    fetch question du jour + subscription realtime votes
    useVote.js        cast vote + persistance localStorage (anti-double vote)
  App.jsx             orchestration, états loading/error/voted
  index.css           variables CSS globales (couleurs, fonts)
  main.jsx            entry point
```

## Décisions techniques clés

- **Date locale** : `new Date().getDate()` pas `toISOString()` — évite le bug timezone UTC vs CEST
- **Anti-double vote** : localStorage `pulse_vote_${questionId}` — sans auth, c'est le compromis acceptable en MVP
- **Realtime** : subscription Supabase sur INSERT de votes, pas de polling
- **Pas de backend custom** : tout passe par Supabase directement depuis le client (RLS = sécurité suffisante pour le MVP)

## Ajouter la question du jour (manuel)

```sql
INSERT INTO questions (text, options, date)
VALUES (
  'Ta question ici ?',
  ARRAY['Option A', 'Option B', 'Option C'],
  CURRENT_DATE
);
```

Si la question du jour existe déjà (UPDATE) :
```sql
UPDATE questions SET
  text = 'Nouvelle question ?',
  options = ARRAY['Option 1', 'Option 2', 'Option 3']
WHERE date = CURRENT_DATE;
```

## Conventions
- Tout en anglais dans le code (noms de variables, fonctions, fichiers)
- Inline styles uniquement (pas de CSS modules, pas de Tailwind — cohérence avec l'existant)
- Pas de commit automatique — demander explicitement
- Pas d'over-engineering — on ship vite, on itère

## Variables d'env
Copier `.env.example` en `.env` et remplir avec les clés Supabase (Settings > API > Legacy anon key).

## Roadmap → voir STATUS.md
