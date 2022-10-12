<img src="https://uploads-ssl.webflow.com/5f4e38c152cd205192a8b27d/5f9299629254ddbe23258547_openclassroomslogo.png" width="400"/>

# Groupomania

Le septième projet de la formation développeur web chez Openclassrooms.
<br />
<br />

# À propos

L'objectif de ce projet est de construire un réseau social interne pour les employés d'une entreprise.

Dans cette application, l'utilisateur peut créer, modifier et supprimer son compte dans la page d'accueil, ainsi il peut créer un post avec du texte ou une image. Ce site donne aussi la possibilité de modifier, liker, commenter ou supprimer un post.
<br />
<br />

# Techniques

<ins>Backend</ins>

- **NodeJS** (**TypeScript**) et **express** pour créer un serveur web et gérer des requêtes et des réponses
- **JWT** pour l'authentification et la session de cookie
- **multer** pour gérer le téléchargement des images

<ins>Frontend</ins>

- **React** (**TypeScript**) pour créer l'interface du site et le management de state

<ins>Base de données</ins>

- **PostgreSQL** pour stocker et récupérer des données

<br />

# How to use

<ins>Base de données</ins>

Créez une base de données dans PostgreSQL, puis importez le fichier `dump.sql` dans votre base de données. Votre BSD devrait se lancer sur le port `localhost:5432`

<br />

<ins>Backend</ins>

Créez un fichier `.env` à la racine du dossier de backend, puis créez deux variables dans le fichier en les nommant `ACCESS_TOKEN` et `REFRESH_TOKEN` en tant que string.

Ensuite, tapez ces commandes dans votre terminal pour lancer le serveur sur le port `localhost:3000`
```
npm install
npm run nodemon-ts
```
<br />

<ins>Frontend</ins>

Tapez ces commandes dans votre terminal pour démarrer l'environnement front sur le port `localhost:3001`
```
npm install
npm run start
```