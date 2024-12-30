# Étape 1 : Construction des fichiers statiques
FROM node:18 AS builder
WORKDIR /app
COPY . /app
# Pas de dépendances nécessaires, donc cette étape peut être vide

# Étape 2 : Préparer les fichiers pour le serveur Nginx
FROM nginx:alpine
COPY --from=builder /app /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 1897
EXPOSE 1897

# Commande par défaut pour Nginx
CMD ["nginx", "-g", "daemon off;"]
