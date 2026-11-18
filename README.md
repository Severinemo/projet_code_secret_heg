# Code secret en couleurs

Un jeu solo de déduction inspiré du Mastermind : retrouvez le code secret choisi par le programme en dix essais au maximum.

## Présentation du projet

Code secret sera une **application web utilisable sur ordinateur et sur smartphone**. Son interface devra s’adapter à ces deux types d’écran.

L’application devra être publiée sur **GitHub Pages** pour permettre de jouer depuis un navigateur web.

## Interface et informations visibles

L’interface devra afficher clairement, à tout moment :

- **Les règles du jeu**, pour pouvoir les consulter pendant la partie.
- **Les essais précédents et leurs indices**, pour pouvoir comparer les propositions et déduire le code secret.

Cette exigence s’applique aussi bien sur ordinateur que sur smartphone. L’historique restera visible après une victoire ou une défaite, jusqu’au lancement d’une nouvelle partie.

## Règles du jeu

### 1. Le code à découvrir

La palette comprend six couleurs, dans cet ordre : **rouge, bleu, vert, jaune, orange, violet**. Leurs noms en minuscules sont également les identifiants exacts utilisés par l’API.

Au début de la partie, le programme choisit au hasard un code de **quatre couleurs**. Une couleur peut apparaître plusieurs fois. Le code reste caché et ne change pas pendant la partie.

### 2. Les propositions

Vous disposez de **dix essais**. Chaque proposition contient quatre couleurs, ordonnées de gauche à droite. Vous pouvez les modifier avant de valider votre proposition.

### 3. Les propositions invalides

Une proposition incomplète ou contenant une couleur absente de la palette est refusée avec une explication. Elle ne consomme aucun essai et ne modifie pas l’historique.

### 4. Les essais et l’historique

Chaque proposition valide consomme un essai. Les propositions validées et leurs indices restent consultables jusqu’au démarrage d’une nouvelle partie.

### 5. Les indices

Après chaque proposition valide, le jeu affiche deux nombres :

- **Bien placées** : les couleurs identiques à celles du code secret à la même position.
- **Mal placées** : les couleurs présentes dans le code secret, mais à une autre position.

Le calcul compte d’abord les couleurs bien placées, puis recherche les couleurs mal placées parmi les occurrences restantes. Chaque occurrence du code secret et de la proposition ne peut être comptée qu’une seule fois. Une couleur répétée dans la proposition ne rapporte donc pas plus de correspondances que le nombre d’occurrences disponibles dans le secret.

Les indices donnent uniquement des totaux : ils ne précisent pas quelles positions sont concernées.

### 6. La victoire et la défaite

- Vous gagnez dès que les **quatre couleurs sont bien placées**, y compris au dixième essai.
- Vous perdez après **dix propositions valides sans avoir trouvé le code**.

### 7. La fin de partie et le redémarrage

Après une victoire ou une défaite, les propositions ne modifient plus la partie.

L’action **« Nouvelle partie »** choisit un nouveau code et remet à zéro le compteur d’essais, l’historique et les indices.

## Exemples d’indices

| Code secret | Proposition | Bien placées | Mal placées |
| --- | --- | --- | --- |
| rouge – bleu – vert – jaune | rouge – vert – bleu – orange | 1 | 2 |
| rouge – rouge – bleu – vert | rouge – rouge – rouge – rouge | 2 | 0 |

Dans le premier exemple, le rouge est à la bonne position ; le vert et le bleu sont présents mais intervertis. Dans le second, les deux premiers rouges sont bien placés ; les deux rouges supplémentaires ne comptent pas.

## Accès au jeu

L’adresse de l’application sur GitHub Pages reste à renseigner après sa publication.

## Source

Ces règles reprennent l’annexe **« Règles communes »**, référence `code-couleurs-1.0`, du document [Projet — Code secret en couleurs, inspiré du Mastermind](https://docs.google.com/document/d/17RUqUnEvIilitiNSY1kbK0QT7vBVcUeAT3L6ONJN8XU/edit?tab=t.0#heading=h.kczu9qr0qzll), édition 2.2, mise à jour le 3 novembre 2026.

Cette variante pédagogique suit les règles de cette annexe ; elle ne reprend pas toutes les variantes commerciales du Mastermind.
