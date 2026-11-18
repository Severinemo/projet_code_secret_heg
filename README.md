# Code secret en couleurs

Un jeu solo de déduction inspiré du Mastermind : retrouver une combinaison de quatre couleurs en dix essais maximum.

## État actuel

- **Disponible :** application web publiée sur GitHub Pages, sélection de quatre couleurs, validation des propositions, calcul des indices, historique des essais, règles affichées, détection de victoire ou de défaite et lancement d’une nouvelle partie.
- **Limites connues :** la présentation est conçue pour ordinateur et smartphone, mais son affichage et ses interactions n’ont pas encore été vérifiés dans un navigateur. La partie n’est pas sauvegardée : recharger la page lance une nouvelle partie. Les fichiers présents sur GitHub ne sont pas synchronisés avec le dossier local.
- **Prévu :** vérifier le fonctionnement dans un navigateur sur ordinateur et smartphone, notamment la lisibilité, l’utilisation au clavier et les commandes tactiles.

## Commencer

Ouvrir [Code secret en couleurs](https://severinemo.github.io/projet_code_secret_heg/) dans un navigateur web. Aucune installation n’est nécessaire pour jouer.

1. Choisir une couleur pour chacune des quatre positions, de gauche à droite.
2. Cliquer sur **Valider l’essai**.
3. Consulter les indices et les essais précédents pour préparer la proposition suivante.
4. Continuer jusqu’à trouver le code ou atteindre dix essais.
5. Cliquer sur **Nouvelle partie** pour recommencer.

Les six couleurs possibles sont **rouge, bleu, vert, jaune, orange et violet**. Une même couleur peut apparaître plusieurs fois dans le code.

Les indices indiquent :

- **Bien placées :** couleurs correctes à la bonne position.
- **Mal placées :** couleurs présentes dans le code, mais à une autre position.

Chaque occurrence ne compte qu’une fois, en donnant la priorité aux couleurs bien placées. Les indices ne révèlent pas les positions concernées.

Une proposition incomplète ou contenant une couleur non autorisée est refusée sans utiliser d’essai. Quatre couleurs bien placées donnent la victoire, même au dixième essai. Après la fin de partie, aucune nouvelle proposition ne peut modifier le résultat.

## Exemple d’utilisation

Exemple illustratif, avec un code secret supposé égal à **rouge – bleu – vert – jaune** :

- **Entrée ou action :** sélectionner **rouge – vert – bleu – orange**, puis valider.
- **Résultat attendu :** la proposition apparaît dans l’historique avec **1 couleur bien placée et 2 mal placées**. Un essai est consommé.

Le rouge est bien placé. Le vert et le bleu sont présents, mais intervertis. L’orange n’appartient pas au code.

Dans une partie réelle, le code est choisi aléatoirement et reste caché : cette même proposition ne produit donc pas nécessairement ces indices.

## Vérifier

### Vérifications du moteur

Le fichier `engine.test.js` contient 15 assertions portant sur :

- les exemples d’indices et les répétitions de couleurs ;
- le refus des propositions invalides sans consommation d’essai ;
- la victoire au dixième essai et la défaite après dix échecs ;
- le blocage des propositions après la fin de partie ;
- l’état initial d’une nouvelle partie ;
- la protection de l’historique contre une modification extérieure.

Pour les exécuter avec Node.js installé, ouvrir un terminal à la racine d’une copie locale du dépôt, puis lancer :

```sh
npm test
```

Aucune dépendance externe n’est nécessaire.

**Résultat observé le 18 novembre 2026 :** les 15 assertions ont réussi dans l’environnement JavaScript utilisé pendant la création. La commande `npm test` n’a pas été exécutée localement, les outils d’accès local étant indisponibles.

### Vérifications de publication

Le déploiement initial du jeu sur GitHub Pages s’est terminé avec succès le **18 novembre 2026**. Les exécutions sont consultables dans [GitHub Actions](https://github.com/Severinemo/projet_code_secret_heg/actions).

### Vérifications restant à réaliser

Les tests du moteur ne valident pas l’interface. Il reste à vérifier dans un navigateur :

1. L’affichage et la lisibilité sur ordinateur et smartphone.
2. La sélection des couleurs au clavier et au toucher.
3. L’affichage des messages, du compteur, des essais et de leurs indices.
4. Le comportement du bouton **Nouvelle partie**.
5. Le déroulement complet d’une partie jusqu’à la victoire ou la défaite.

## Se repérer

| Fichier | Rôle |
| --- | --- |
| `index.html` | Structure de la page et règles du jeu visibles. |
| `style.css` | Présentation et adaptation aux tailles d’écran. |
| `engine.js` | Code secret, validation, indices et état de la partie. |
| `app.js` | Sélection des couleurs, boutons, messages et historique. |
| `engine.test.js` | Vérifications automatisées du moteur. |
| `package.json` | Configuration des modules JavaScript et commande de test. |
| `.nojekyll` | Désactivation du traitement Jekyll pour le site statique. |
| `README.md` | Présentation, utilisation, vérifications et suivi du projet. |

Le code est conservé dans le [dépôt GitHub](https://github.com/Severinemo/projet_code_secret_heg). La branche `main` contient les sources ; la branche `gh-pages` fournit les fichiers publiés. Une évolution de `main` doit être reportée sur `gh-pages` pour apparaître sur le site.

Les règles proviennent de l’annexe **« Règles communes »**, référence `code-couleurs-1.0`, du document [Projet — Code secret en couleurs, inspiré du Mastermind](https://docs.google.com/document/d/17RUqUnEvIilitiNSY1kbK0QT7vBVcUeAT3L6ONJN8XU/edit?tab=t.0#heading=h.kczu9qr0qzll), édition 2.2, mise à jour le 3 novembre 2026. Cette variante pédagogique ne reprend pas toutes les variantes commerciales du Mastermind.

### Étapes de conception

Le **18 novembre 2026**, la première version a été réalisée en six étapes :

1. **Cadrage :** reprise des règles communes et des exigences d’affichage du README.
2. **Architecture :** choix d’une application statique en HTML, CSS et JavaScript, sans dépendance externe.
3. **Moteur :** création du tirage du code, de la validation, du calcul des indices et des conditions de fin.
4. **Interface :** création des sélecteurs, des messages, du compteur et de l’historique ; ajout des noms des couleurs et des règles.
5. **Vérification :** exécution réussie des 15 assertions du moteur ; vérification visuelle laissée ouverte.
6. **Publication :** dépôt des sources sur GitHub, création de la branche `gh-pages` et déploiement initial réussi.

## Aide et reprise

Le dépôt est géré par **Severinemo**.

Pour signaler un problème, utiliser la rubrique [Issues du dépôt](https://github.com/Severinemo/projet_code_secret_heg/issues), si elle est activée. Indiquer :

- l’appareil et le navigateur utilisés ;
- les actions effectuées ;
- le résultat attendu et le résultat observé ;
- une capture d’écran si elle aide à comprendre le problème.

Pour reprendre le développement, lire les règles et les limites ci-dessus, limiter chaque changement à son objectif, puis exécuter les tests du moteur et vérifier les interactions concernées dans le navigateur. Consigner les résultats et les questions ouvertes dans ce README, puis créer un commit pour chaque changement important.
