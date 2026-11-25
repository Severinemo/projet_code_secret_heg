# Code secret en couleurs

Un jeu solo de déduction inspiré du Mastermind : retrouver une combinaison de quatre couleurs en dix essais maximum.

## État actuel

**Version 1.1.0 — 25 novembre 2026.** Sources et tests disponibles dans ce dépôt ; publication via la branche `gh-pages`. Le résultat du déploiement est consultable dans [GitHub Actions](https://github.com/Severinemo/projet_code_secret_heg/actions).

- **Disponible :** application web publiée sur GitHub Pages, sélection de quatre couleurs, validation des propositions, calcul des indices, historique des essais, règles affichées, détection de victoire ou de défaite et lancement d’une nouvelle partie.
- **Limites connues :** la présentation est conçue pour ordinateur et smartphone, mais son affichage et ses interactions n’ont pas encore été vérifiés dans un navigateur. La partie n’est pas sauvegardée : recharger la page lance une nouvelle partie. La copie de préparation locale se trouve dans `Code secret/version-1.1` ; les anciens fichiers du dossier parent n’ont pas été remplacés.
- **Prévu :** vérifier le fonctionnement dans un navigateur sur ordinateur et smartphone, notamment la lisibilité, l’utilisation au clavier et les commandes tactiles.

## Commencer

Ouvrir [Code secret en couleurs](https://severinemo.github.io/projet_code_secret_heg/) dans un navigateur web. Aucune installation n’est nécessaire pour jouer.

1. Choisir une couleur pour chacune des quatre positions, de gauche à droite.
2. Cliquer sur **Valider l’essai**. Après un essai accepté, la saisie est vidée ; si moins de quatre couleurs sont choisies, les choix sont conservés et un message demande de compléter la proposition.
3. Consulter le tableau « Bien placées / Mal placées » et les essais précédents pour préparer la proposition suivante.
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

### Bilan de la version 1.1.0 — 25 novembre 2026

Version testée localement dans `Code secret/version-1.1`, commit local `916f342bae0b57150766c0266b59b388479035a9`. Sources de départ : `main` au commit `0f3ebb400c6dc3130404c7860d25616932a9fe85`. Les fichiers du jeu et des tests ont ensuite été transférés sans modification dans ce dépôt. Les résultats ci-dessous concernent cette version 1.1.0 ; ils ne constituent pas un test du site en ligne.

Modifications : chaque essai dispose d’un tableau à deux colonnes « Bien placées » et « Mal placées » ; les pastilles passent de 20 à 36 pixels ; les quatre sélecteurs et leurs pastilles sont réinitialisés uniquement après un essai accepté. Une saisie de zéro à trois couleurs reste intacte et affiche « Veuillez sélectionner 4 couleurs avant de valider l’essai. ». L’historique est conservé.

Environnement : Windows, Node.js v24.22.3. Commandes réellement exécutées : `node engine.test.js`, `node app.test.js`, `node --check app.js`. Le contrôleur réel est exécuté contre un DOM minimal simulé ; ce contrôle ne remplace pas un navigateur.

| Contrôle | Attendu | Observé | Statut | Type / version |
| --- | --- | --- | --- | --- |
| 15 assertions historiques du moteur (cas 1 à 15 détaillés dans le bilan 1.0 ci-dessous) | Toutes conformes aux mêmes attentes | « 15 vérifications réussies. » | Réussi | Automatisé / 1.1.0 |
| Saisie de 0 couleur | Refus, saisie conservée, compteur à 0, historique vide, message explicite et focus sur première case vide | Toutes ces assertions conformes | Réussi | DOM simulé / 1.1.0 |
| Saisie de 1 couleur | Même refus sans effacement | Toutes ces assertions conformes | Réussi | DOM simulé / 1.1.0 |
| Saisie de 2 couleurs | Même refus sans effacement | Toutes ces assertions conformes | Réussi | DOM simulé / 1.1.0 |
| Saisie de 3 couleurs | Même refus sans effacement | Toutes ces assertions conformes | Réussi | DOM simulé / 1.1.0 |
| Essai rouge–vert–bleu–orange contre rouge–bleu–vert–jaune | Saisie vide, pastilles neutres, 1 essai conservé, tableau 1 bien placée / 2 mal placées avec en-têtes de colonnes | Toutes ces assertions conformes | Réussi | DOM simulé / 1.1.0 |
| Saisie incomplète après un essai accepté | Historique et compteur inchangés, trois choix conservés | Toutes ces assertions conformes | Réussi | DOM simulé / 1.1.0 |
| Victoire | Saisie vidée, commandes désactivées, historique conservé, message de victoire | Toutes ces assertions conformes | Réussi | DOM simulé / 1.1.0 |
| Nouvelle partie | Commandes actives, historique vide et compteur à 0 | Toutes ces assertions conformes | Réussi | DOM simulé / 1.1.0 |
| Défaite après dix essais | Dix essais conservés, validation désactivée, saisie vide et message de défaite | Toutes ces assertions conformes | Réussi | DOM simulé / 1.1.0 |
| Syntaxe du contrôleur | Aucune erreur | `node --check app.js` terminé sans erreur | Réussi | Automatisé / 1.1.0 |
| Exécution par `npm test` | Lancement des suites | Commande npm introuvable ; suites exécutées directement avec node | Échec d’outil | Local / 1.1.0 |
| Rendu ordinateur et smartphone, clavier et toucher | Tableaux et pastilles lisibles, interactions correctes | Navigateur automatisé indisponible : « trusted Node process exited unexpectedly » | Non réalisé | Navigateur / 1.1.0 |

Aucun échec du moteur ou du contrôleur n’a été observé dans ces tests. La taille de 36 pixels est définie dans le CSS, mais le rendu effectif et les éventuels débordements restent à vérifier visuellement. Ces tests ont été exécutés avant publication.

### Nouvelle exécution après publication — version 1.1.0, 25 novembre 2026

**Version concernée :** [commit 43f2a920d457a049c6823f244c3fc6d4163a422c](https://github.com/Severinemo/projet_code_secret_heg/commit/43f2a920d457a049c6823f244c3fc6d4163a422c). Avant l’exécution, les contenus de `app.js` et `engine.js` récupérés sur GitHub Pages ont été comparés à la copie locale : ils correspondent, après normalisation des fins de ligne et des espaces en fin de fichier.

**Méthode : test automatisé avec une interface simulée (DOM minimal), sous Windows et Node.js v24.22.3.** La commande `node app.test.js` a exécuté le contrôleur réel avec des sélecteurs et événements simulés. Le code secret de test était fixé à **rouge – bleu – vert – jaune**. Ce ne sont pas des clics réalisés dans un navigateur.

| Scénario | Résultat attendu | Résultat observé | Statut | Version / type |
| --- | --- | --- | --- | --- |
| Choisir rouge, bleu, vert, laisser la quatrième position vide, puis soumettre | Refus avec message, trois choix conservés, focus sur la quatrième position, aucun essai consommé | Message exact : « Veuillez sélectionner 4 couleurs avant de valider l’essai. » ; sélections rouge, bleu, vert et valeur vide conservées ; focus sur le quatrième sélecteur ; compteur 0 / 10 ; historique vide | Réussi | 1.1.0 / interface simulée |
| Démarrer une nouvelle partie de test, choisir rouge, vert, bleu, orange, puis soumettre | Essai accepté ; sélecteurs vidés et pastilles neutres ; proposition conservée dans l’historique avec les bons indices | Quatre valeurs de sélection vides, correspondant à « Choisir… » ; quatre pastilles neutres ; compteur 1 / 10 ; proposition rouge–vert–bleu–orange conservée ; tableau avec en-têtes « Bien placées » / « Mal placées » et valeurs 1 / 2 | Réussi | 1.1.0 / interface simulée |

Ces deux cas sont des scénarios distincts, avec une nouvelle partie entre eux. Le résultat 1 / 2 dépend du code secret fixé pour le test.

**Résultat global de cette nouvelle exécution :** `9 scénarios du contrôleur réussis (DOM simulé).` Les sept autres scénarios couvrent zéro, une et deux couleurs, une saisie incomplète après un essai accepté, la victoire, la nouvelle partie et la défaite. Aucun échec n’a été observé dans cette suite. Les 15 assertions du moteur n’ont pas été relancées lors de cette exécution.

**Limite :** la tentative d’ouverture du navigateur automatisé a échoué avant toute interaction, avec `CreateProcessWithLogonW failed: 1920`. Le rendu visuel et les interactions dans un vrai navigateur restent **non vérifiés**. Aucun fichier n’a été modifié pendant ces tests ; cette entrée du README en consigne les résultats a posteriori.

### Bilan des tests du moteur — version 1.0

**Date d’exécution : 18 novembre 2026.** Les tests ont été exécutés dans l’environnement JavaScript de l’assistant, sur le code ensuite enregistré dans le commit [ea038fb8f0900511dab3c2f37afb93ae0996c13a](https://github.com/Severinemo/projet_code_secret_heg/commit/ea038fb8f0900511dab3c2f37afb93ae0996c13a) (version 1.0). Ils correspondent aux assertions de [engine.test.js à cette version](https://github.com/Severinemo/projet_code_secret_heg/blob/ea038fb8f0900511dab3c2f37afb93ae0996c13a/engine.test.js).

**Preuve retrouvée dans la conversation de création :** sortie globale `{"passed":15}`. Chaque assertion interrompt l’exécution en cas d’échec : ce total confirme les 15 réussites, sans constituer un journal individuel. Ces résultats concernent cette version du moteur ; ils ne prouvent ni le fonctionnement de l’interface ni celui de versions futures.

| Nº | Comportement vérifié | Résultat attendu | Résultat observé | Type | Statut | Version |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Secret rouge–bleu–vert–jaune ; proposition rouge–vert–bleu–orange | 1 bien placée, 2 mal placées | Valeurs conformes | Automatisé | Réussi | 1.0 / ea038fb |
| 2 | Secret rouge–rouge–bleu–vert ; proposition de quatre rouges | 2 bien placées, 0 mal placée | Valeurs conformes ; rouges supplémentaires non comptés | Automatisé | Réussi | 1.0 / ea038fb |
| 3 | Quatre couleurs correctes, toutes décalées | 0 bien placée, 4 mal placées | Valeurs conformes | Automatisé | Réussi | 1.0 / ea038fb |
| 4 | Proposition incomplète : une seule couleur | Refus | `ok = false` | Automatisé | Réussi | 1.0 / ea038fb |
| 5 | Proposition contenant la couleur interdite rose | Refus | `ok = false` | Automatisé | Réussi | 1.0 / ea038fb |
| 6 | Historique après les deux propositions invalides | Aucun essai enregistré | Longueur : 0 | Automatisé | Réussi | 1.0 / ea038fb |
| 7 | Code trouvé après neuf propositions incorrectes | Victoire au dixième essai | État `won` | Automatisé | Réussi | 1.0 / ea038fb |
| 8 | Compteur après cette victoire | 10 essais enregistrés | Longueur : 10 | Automatisé | Réussi | 1.0 / ea038fb |
| 9 | Nouvelle proposition après une victoire | Refus | `ok = false` | Automatisé | Réussi | 1.0 / ea038fb |
| 10 | État après ce refus | État et historique inchangés | Égalité avec l’état mémorisé | Automatisé | Réussi | 1.0 / ea038fb |
| 11 | Dix propositions incorrectes | Défaite | État `lost` | Automatisé | Réussi | 1.0 / ea038fb |
| 12 | Proposition correcte après la défaite | Refus | `ok = false` | Automatisé | Réussi | 1.0 / ea038fb |
| 13 | Compteur après cette proposition refusée | Toujours 10 essais | Longueur : 10 | Automatisé | Réussi | 1.0 / ea038fb |
| 14 | Création d’une nouvelle instance de partie | Partie en cours et historique vide | `status: playing`, `history: []` | Automatisé | Réussi | 1.0 / ea038fb |
| 15 | Modification d’une copie de l’historique obtenue par `getState()` | Historique interne protégé | La couleur interne reste `violet` | Automatisé | Réussi | 1.0 / ea038fb |

### Autres contrôles retrouvés

Ces contrôles ont été réalisés le 18 novembre 2026. Les comparaisons de contenu proviennent des résultats d’outils consignés dans la conversation.

| Contrôle | Résultat attendu | Résultat observé | Type | Statut | Version concernée |
| --- | --- | --- | --- | --- | --- |
| Syntaxe d’`app.js`, après retrait de son import pour l’analyse | Aucune erreur de syntaxe | Construction JavaScript acceptée | Automatisé | Réussi | 1.0 / `ea038fb` |
| Déploiement initial GitHub Pages | Workflow terminé avec succès | `status: completed`, `conclusion: success` | Automatisé — GitHub Actions | Réussi | `ea038fb` |
| Tentatives de consultation du site publié par l’outil web | Page accessible pour inspection | Erreur de l’outil : URL inaccessible ; aucun résultat exploitable sur le jeu | Automatisé — outil web | Résultat non retrouvé | Site visé après le déploiement initial ; version servie non confirmée |
| Conformité du README publié avec la proposition validée | Contenu identique | Comparaison : `true` | Automatisé | Réussi | `33e2ffcf060a5237c8a09f840538c860a9d770f6` |
| Conformité d’AGENTS.md avec le texte fourni | Contenu identique | Comparaison : `true` | Automatisé | Réussi | `83aaf4031043507859bc26351b8cfc07416118a8` |

Le [workflow de déploiement initial](https://github.com/Severinemo/projet_code_secret_heg/actions/runs/44280852956) confirme la publication, mais pas le bon fonctionnement du jeu dans un navigateur. Aucun test manuel exécuté ni aucun échec démontré du jeu n’a été retrouvé. Les erreurs observées concernaient les outils d’accès.

### Tests prévus sans preuve d’exécution

| Test prévu | Type prévu | Contrôle restant | Version exécutée |
| --- | --- | --- | --- |
| Exécution locale de `npm test` | Automatisé | Lancement de la suite avec Node.js et la configuration du dépôt | Aucune exécution retrouvée |
| Affichage sur ordinateur et smartphone | Manuel | Lisibilité, adaptation aux écrans, règles et historique consultables | Aucune exécution retrouvée |
| Sélection au clavier et au toucher | Manuel | Navigation et choix des quatre couleurs | Aucune exécution retrouvée |
| Messages, compteur et historique | Manuel | Mise à jour après validation et refus d’une proposition | Aucune exécution retrouvée |
| Bouton **Nouvelle partie** | Manuel | Réinitialisation de l’interface, des essais et des indices ; création d’un code | Aucune exécution retrouvée |
| Partie complète gagnée et perdue | Manuel | Fonctionnement de bout en bout et blocage après la fin | Aucune exécution retrouvée |

### Reproduire les tests du moteur

Avec Node.js installé, ouvrir un terminal à la racine d’une copie locale du dépôt, puis lancer :

```sh
npm test
```

Aucune dépendance externe n’est nécessaire. Pour reproduire la version historique, utiliser le commit `ea038fb8f0900511dab3c2f37afb93ae0996c13a`. La commande locale n’a pas été exécutée lors de la création : les outils locaux étaient indisponibles.

Le bilan historique ci-dessus conserve les preuves de la version 1.0. Les nouvelles exécutions sont consignées séparément dans le bilan 1.1.0.

## Se repérer

| Fichier | Rôle |
| --- | --- |
| `index.html` | Structure de la page et règles du jeu visibles. |
| `style.css` | Présentation et adaptation aux tailles d’écran. |
| `engine.js` | Code secret, validation, indices et état de la partie. |
| `app.test.js` | Scénarios du contrôleur exécutés avec un DOM simulé. |
| `app.js` | Sélection des couleurs, boutons, messages et historique. |
| `engine.test.js` | Vérifications automatisées du moteur. |
| `package.json` | Configuration des modules JavaScript et commande de test. |
| `.nojekyll` | Désactivation du traitement Jekyll pour le site statique. |
| `README.md` | Présentation, utilisation, vérifications et suivi du projet. |

Le code est conservé dans le [dépôt GitHub](https://github.com/Severinemo/projet_code_secret_heg). La branche `main` contient les sources ; la branche `gh-pages` fournit les fichiers publiés. Une évolution de `main` doit être reportée sur `gh-pages` pour apparaître sur le site.

Les règles proviennent de l’annexe **« Règles communes »**, référence `code-couleurs-1.0`, du document [Projet — Code secret en couleurs, inspiré du Mastermind](https://docs.google.com/document/d/17RUqUnEvIilitiNSY1kbK0QT7vBVcUeAT3L6ONJN8XU/edit?tab=t.0#heading=h.kczu9qr0qzll), édition 2.2, mise à jour le 3 novembre 2026. Cette variante pédagogique ne reprend pas toutes les variantes commerciales du Mastermind.

### Étapes de conception

**25 novembre 2026 — Version 1.1.0** : clarification des indices, agrandissement des pastilles et réinitialisation conditionnelle de la saisie. Les 15 assertions du moteur et 9 scénarios du contrôleur ont réussi. Vérification visuelle non réalisée. Publication autorisée par l’utilisateur : transfert de tous les fichiers nécessaires, du test de contrôleur et du README sur `main`, puis mise à jour de `gh-pages`.

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

