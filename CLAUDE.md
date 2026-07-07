# Gymtracker Frontend

## O projekte
Osobná appka na zapisovanie cvikov v posilke. Zapisujem si cviky, série
(váha + opakovania), tréningy a sledujem osobné rekordy. Neskôr pridam aj grafy a štatistiky. A moznost zapisovat si jedla co som zjedol a sledovat kaloricky prijem. 
Appka je len pre mna, ale moze sa casom rozsirit na viacero uzivatelov.

## Tech stack
- React + TypeScript
- Vite
- Tailwind CSS
- axios (volania API)
- react-router-dom v7 (navigácia)
- recharts (grafy)

## Backend
Spring Boot beží na `http://localhost:8080`
Base URL API: `http://localhost:8080/api`

## Konvencie
- Komponenty v `src/components/`
- Stránky v `src/pages/`
- API volania v `src/api/` (jeden súbor na entitu, napr. `exerciseApi.ts`)
- Typy v `src/types/`
- Používaj funkcionálne komponenty a hooks, žiadne class komponenty
- Tailwind na styling, žiadne samostatné CSS súbory

## Cieľ: PWA
Appka má neskôr fungovať ako PWA (inštalovateľná na iPhone cez Safari).