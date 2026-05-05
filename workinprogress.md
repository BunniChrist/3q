# 3q — Work In Progress

> Last updated: 2026-05-05

## Current status

- **Production** : https://3q.bunnichrist.fr — en ligne ✅
- Stack : Next.js 16 (App Router) + Tailwind + Supabase (self-hosted) + Coolify
- Anonymat : techniquement vérifié, aucune métadonnée stockée
- Base de données : 1 vraie réponse en base

## Completed (2026-05-05)

- [x] Projet initialisé (CLAUDE.md, agents.md, skills/, GitHub repo public)
- [x] Migration SQL appliquée : table `responses` + RLS INSERT-only + vue `responses_count`
- [x] App Next.js 16 complète (accueil + tunnel formulaire 3 questions + remerciement)
- [x] Formulaire : questions une par une (age → genre → vœu → récap → merci)
- [x] Page d'accueil : anonymat collapsable, liste des 3 questions, compteur X/500
- [x] Dockerfile multi-stage standalone (HOSTNAME=0.0.0.0, NEXT_TELEMETRY_DISABLED)
- [x] Tests Jest : 27/27 passent (validation, anonymat payload, RLS)
- [x] Déployé sur Coolify — domaine 3q.bunnichrist.fr
- [x] Nettoyage : worktree et branche feature/init-3q supprimés

## Next steps

- Partager le lien https://3q.bunnichrist.fr pour collecter des réponses
- Objectif : 500 réponses
- Analyse des vœux une fois la collecte terminée
