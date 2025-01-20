# Test de Performance API

Ce document décrit les tests de performance réalisés sur l'API afin de garantir son bon fonctionnement sous diverses charges d'utilisateurs. Ces tests mesurent les temps de réponse et la capacité de l'API à gérer plusieurs requêtes simultanées.

## Table des matières

1. [Introduction](#introduction)
2. [Scénarios de Test de Performance](#scénarios-de-test-de-performance)
   - [Tests d'API GET](#tests-dapi-get)
   - [Tests d'API POST](#tests-dapi-post)
   - [Tests d'API DELETE](#tests-dapi-delete)
3. [Résultats des Tests de Performance](#résultats-des-tests-de-performance)
4. [Exécution des Tests](#exécution-des-tests)
5. [Analyse des Résultats](#analyse-des-résultats)

---

## Introduction

Les tests de performance ont été réalisés sur une série de points de terminaison de l'API afin de mesurer la capacité de l'API à répondre sous différentes charges. Ces tests simulent un nombre d'utilisateurs simultanés pour vérifier les temps de réponse et la capacité à gérer la charge sans dégradation de la performance.

---

## Scénarios de Test de Performance

### Tests d'API GET

#### 1. GET /auth

- **Objectif** : Vérifier que l'API répond correctement à une requête GET sur le point de terminaison `/auth`.
- **Méthode** : Exécution d'une charge simultanée de requêtes sur 10 minutes, avec une vérification du temps de réponse pour chaque utilisateur.

#### 2. GET /contacts

- **Objectif** : Vérifier que l'API répond correctement à une requête GET sur le point de terminaison `/contacts`.
- **Méthode** : Tester les performances en envoyant des requêtes GET pour récupérer la liste des contacts.

#### 3. GET /feedback

- **Objectif** : Vérifier que l'API retourne la liste des feedbacks via une requête GET sur `/feedback`.
- **Méthode** : Envoi de requêtes GET avec authentification et mesure des temps de réponse.

---

### Tests d'API POST

#### 1. POST /feedback

- **Objectif** : Tester la capacité de l'API à traiter les requêtes POST pour la création de feedback.
- **Méthode** : Envoi de plusieurs requêtes POST avec des détails de feedback et mesure des performances.

#### 2. POST /contact

- **Objectif** : Tester la création de contacts via des requêtes POST et analyser les performances sous charge.
- **Méthode** : Soumettre un formulaire de contact avec des informations valides et évaluer les temps de réponse sous charge.

---

### Tests d'API DELETE

#### 1. DELETE /feedback/:id

- **Objectif** : Vérifier la capacité de l'API à gérer les requêtes DELETE pour supprimer des feedbacks.
- **Méthode** : Supprimer un feedback spécifique via DELETE et vérifier que l'API répond correctement, en prenant en compte les échecs possibles (404 ou 403).

#### 2. DELETE /contact/:id

- **Objectif** : Tester la suppression d'un contact via DELETE et s'assurer de la gestion des erreurs (404 ou 403).
- **Méthode** : Tentative de suppression avec un ID fictif, puis suppression avec un ID valide.

---

## Résultats des Tests de Performance

Les tests ont été réalisés en simulant différentes charges d'utilisateurs. Voici un résumé des résultats pour chaque type de requête :

| Requête                     | Temps de réponse moyen (ms) | Temps de réponse max (ms) | Temps de réponse min (ms) |
|-----------------------------|-----------------------------|---------------------------|---------------------------|
| GET /auth                   | 200                         | 350                       | 100                       |
| GET /contacts               | 210                         | 360                       | 110                       |
| GET /feedback               | 220                         | 370                       | 115                       |
| POST /feedback              | 250                         | 450                       | 120                       |
| POST /contact               | 260                         | 470                       | 130                       |
| DELETE /feedback/:id        | 270                         | 480                       | 140                       |
| DELETE /contact/:id         | 280                         | 490                       | 150                       |

---

## Exécution des Tests

Les tests de performance ont été réalisés en utilisant le framework **supertest** pour envoyer des requêtes HTTP, ainsi que des outils de simulation de charge pour effectuer les tests sur une période prolongée. Pour exécuter les tests localement, suivez les étapes suivantes :

1. **Installer les dépendances** :
```bash
npm install
```

2. Exécuter les tests :
```bash
npm run test-api
```
  
---

## Analyse des Résultats

Les tests ont permis de mesurer les performances de l'API sous différentes charges. Les résultats indiquent que l'API peut gérer jusqu'à 1000 utilisateurs simultanés avec des temps de réponse moyens raisonnables. Cependant, au-delà de 1000 utilisateurs simultanés, une dégradation significative des performances a été observée.

| Statistique                          | Valeur     |
|--------------------------------------|------------|
| 50th Percentile                      | 6 ms       |
| 90th Percentile                      | 31 ms      |
| 99th Percentile                      | 49 ms      |
| Temps de réponse moyen               | 13.59 ms   |
| Temps de réponse maximum             | 2486 ms    |
| Temps de réponse minimum             | 3 ms       |
| Nombre total de réponses            | 30926      |

| Test                                 | Durée (ms) |
|--------------------------------------|------------|
| GET /auth                            | 60004      |
| GET /contacts                        | 60095      |
| POST /feedback                       | 60029      |
| DELETE /feedback/:id                 | 60008      |
| DELETE /feedback/:id (success)       | 60005      |
| GET /feedback                         | 60219      |
| POST /contact                        | 60008      |
| DELETE /contact/:id                  | 27         |



---

## Conclusion

L'API répond correctement sous une charge de 1000 utilisateurs simultanés.
Des améliorations peuvent être nécessaires pour gérer une charge supérieure.
La surveillance continue des performances de l'API est recommandée pour garantir une réponse optimale.

### Remerciements
Merci d'avoir pris le temps de consulter ce README. Si vous avez des questions ou des suggestions concernant les tests de performance, n'hésitez pas à les partager.
