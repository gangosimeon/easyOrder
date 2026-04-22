# 🛒 BurkinaShop — Application de Gestion Boutique
### Angular 20 | Signals | @for/@if | inject() | takeUntilDestroyed

Application de gestion moderne pour une petite boutique au Burkina Faso.
Design warm African-inspired, mobile-first, entièrement en localStorage.

---

## 🚀 Lancer le projet

```bash
# Prérequis : Node.js v20+ et Angular CLI v20
npm install -g @angular/cli@20

# 1. Installer les dépendances
cd gestion-boutique
npm install

# 2. Démarrer le serveur de développement
ng serve

# 3. Ouvrir dans le navigateur
# → http://localhost:4200
```

---

## 🆕 Nouvelles APIs Angular 20 utilisées

| Fonctionnalité           | Détail                                                   |
|--------------------------|----------------------------------------------------------|
| **Signals stables**      | `signal()`, `computed()`, `asReadonly()` dans les services |
| **`inject()`**           | Remplace le constructeur pour les dépendances            |
| **`@for` / `@if`**       | Nouveau control flow natif (plus de `*ngFor`/`*ngIf`)    |
| **`@empty`**             | Bloc vide intégré dans `@for`                            |
| **`takeUntilDestroyed`** | Remplace `Subject + ngOnDestroy` pour les subscriptions  |
| **`provideAnimationsAsync`** | Animations lazy-loaded dans `app.config.ts`          |
| **`satisfies`**          | TypeScript 5.6 pour la sécurité des types de dialog data |
| **`withComponentInputBinding`** | Router inputs directement dans les composants   |

---

## 📁 Structure du projet

```
src/app/
├── models/
│   ├── category.model.ts       Interface Category + icônes/couleurs
│   ├── product.model.ts        Interface Product + unités + emojis
│   └── annonce.model.ts        Interface Annonce + types + config
├── services/
│   ├── category.service.ts     CRUD catégories avec Signals
│   ├── product.service.ts      CRUD produits avec Signals + computed
│   └── annonce.service.ts      CRUD annonces avec Signals
└── components/
    ├── category-list/          Grille catégories (Signals + @for/@if)
    ├── category-form/          Dialog formulaire catégorie
    ├── product-list/           Grille produits (computed filtrage réactif)
    ├── product-form/           Dialog formulaire produit
    ├── annonce-list/           Liste annonces avec bandeau épinglées
    └── annonce-form/           Dialog formulaire annonce
```

---

## ✨ Fonctionnalités

### 📂 Catégories
- CRUD complet (ajouter, modifier, supprimer)
- 16 icônes Material + 12 couleurs au choix
- Prévisualisation en temps réel dans le formulaire
- Compteur de produits par catégorie

### 🛍️ Produits
- CRUD complet avec 40 emojis visuels
- Prix en FCFA + gestion promotions (-X%) avec calcul automatique
- Filtrage par catégorie et recherche en temps réel (100% réactif via `computed()`)
- Unités, stock, description optionnels

### 📢 Annonces *(nouveau composant)*
- 4 types : Promotion 🔥 | Info ℹ️ | Alerte ⚠️ | Événement 📅
- Bandeau épinglées en haut de page (style tableau de bord sombre)
- Activation/désactivation en un clic
- Dates de début et fin avec détection d'expiration automatique
- Filtrage par onglets (Toutes / Actives / Épinglées / par type)
- Indicateur "En ligne" avec animation dot pulsante

### 💾 Persistance
- Tout est sauvegardé en `localStorage`
- Données mockées chargées au premier lancement

---

## 🎨 Design

- **Couleurs** : Orange chaud `#E8521A` + sidebar `#1A1A2E`
- **Typographie** : Nunito (titres gras) + Outfit (corps)
- **UI Framework** : Angular Material 20
- **Animations** : `fadeInUp` avec délais en cascade sur les cards
- **Mobile** : sidebar masquée → barre de navigation en bas

---

## 📦 Données mockées incluses

| Type       | Nombre | Dont en promo |
|------------|--------|---------------|
| Catégories | 6      | —             |
| Produits   | 9      | 4             |
| Annonces   | 4      | 2 épinglées   |
