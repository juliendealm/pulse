# Pulse — Status

Dernière mise à jour : 2026-06-08

## Phase actuelle : M1 — Croissance (0 monétisation)
Objectif : 5 000 users actifs avant de toucher à la monétisation.

---

## Fait

- [x] MVP React + Vite
- [x] Supabase : tables `questions` + `votes`, RLS, Realtime
- [x] Vote 3 options avec animation barre de progression
- [x] Résultats temps réel (Supabase Realtime)
- [x] Countdown jusqu'à minuit (timezone locale)
- [x] Anti-double vote (localStorage)
- [x] Partage natif (Web Share API + fallback clipboard)
- [x] Déploiement Vercel : https://pulse-eight-roan.vercel.app
- [x] Fix timezone UTC → locale
- [x] Git + GitHub repo privé connecté à Vercel (deploy auto sur push main)
- [x] Cron GitHub Actions — question du jour automatique à 6h Paris (55 questions en banque)

---

## En cours

Rien — MVP stable.

---

## Backlog priorisé

### Sprint 1 — Infrastructure ✅ DONE

### Sprint 2 — Rétention
- [ ] **Auth utilisateur** — Supabase Auth (magic link email). Prérequis pour Premium et analytics.
- [ ] **Page archives** — liste des questions passées + résultats. Argument Premium.
- [ ] **Profil utilisateur** — score de participation, streak, historique de ses votes.

### Sprint 3 — Monétisation (M4)
- [ ] **Pulse Premium** — 4,99€/mois via Stripe. Accès archives, analytics perso, vote pondéré x2, badge.
- [ ] **Stripe intégration** — checkout, webhook, gestion abonnement.

### Sprint 4 — B2B (M6)
- [ ] **Dashboard admin** — interface pour programmer les questions à l'avance, voir les stats.
- [ ] **API publique** — endpoint résultats segmentés pour clients B2B (instituts, médias).
- [ ] **Questions sponsorisées** — label "Sponsorisé", soumission via formulaire ou dashboard.

### Sprint 5 — Scale (M9+)
- [ ] **Notifications push** — rappel quotidien "La question du jour est arrivée"
- [ ] **App native** — React Native ou PWA améliorée
- [ ] **Pub contextuelle** — bannière post-vote pour users gratuits, ciblage par opinion

---

## Métriques à suivre

| Métrique | Aujourd'hui | Objectif M3 |
|----------|-------------|-------------|
| Users actifs/jour | 0 | 500 |
| Questions posées | 1 | 90 |
| Votes total | 1 | 25 000 |
| Partages | 0 | 2 000 |

---

## Décisions prises

- Pas de TypeScript pour l'instant — vitesse de ship > rigueur typage en MVP
- Auth après 5k users — ne pas over-engineer avant validation du concept
- Questions manuelles jusqu'au Sprint 1 — le cron est prioritaire mais pas bloquant jour J
