# Family Group Draw

Application web de tirage au sort entre plusieurs groupes. Chaque participant donne et reçoit une fois, sans tirage au sein du même groupe ni paire réciproque (A → B et B → A).

L'application utilise uniquement HTML, CSS et JavaScript et s'exécute dans le navigateur. Aucune dépendance à installer, aucun serveur applicatif et aucune étape de build ne sont nécessaires.

## Utilisation en local

```bash
git clone https://github.com/BerthetQuentin/FamilyGroupDraw.git
cd FamilyGroupDraw
```

Ouvrir `app/index.html` dans un navigateur, puis :

1. Saisir le nom d'un participant et son groupe.
2. Cliquer sur **Ajouter** et répéter pour les autres participants.
3. Cliquer sur **Tirage !** pour afficher les attributions.

Il faut au moins trois participants pour éviter les paires réciproques. La répartition des groupes doit également permettre un tirage valide.

Les participants et les résultats restent en mémoire dans l'onglet : recharger ou fermer la page les efface.

## Déployer sur Vercel

1. Pousser les modifications sur GitHub.
2. Dans Vercel, choisir **Add New → Project**, puis importer le dépôt.
3. Conserver la **Root Directory** à la racine du dépôt (`.`), afin que Vercel lise `vercel.json`.
4. Cliquer sur **Deploy**.

Le fichier [`vercel.json`](vercel.json) définit les paramètres suivants :

| Paramètre | Valeur |
| --- | --- |
| Framework Preset | Other |
| Build Command | Vide (aucun build) |
| Install Command | Vide (aucune installation) |
| Output Directory | `app` |

Seul le contenu de `app/` est publié. Aucune variable d'environnement ni aucun secret GitHub n'est nécessaire. Les déploiements suivants sont gérés par l'intégration Git de Vercel.

Voir la [documentation Vercel sur les sites statiques](https://vercel.com/docs/builds/configure-a-build#skip-build-step) et la [configuration `vercel.json`](https://vercel.com/docs/project-configuration/vercel-json).

## Structure

```text
app/
  index.html    # Interface
  script.js     # Gestion des participants et tirage
  style.css     # Styles
vercel.json     # Déploiement statique sur Vercel
```

## Contribuer

Créer une branche, modifier les fichiers dans `app/`, puis vérifier l'ajout de participants et le tirage dans le navigateur avant d'ouvrir une pull request.
