#!/bin/bash

# Script para construir la imagen del backend
echo "Construyendo imagen del backend..."

# Definir variables
IMAGE_NAME="ministerio-publico-backend"
TAG="1.0.0"

# Construir la imagen
docker build -t $IMAGE_NAME:$TAG .

# Verificar que la imagen se creó correctamente
if [ $? -eq 0 ]; then
    echo "Imagen $IMAGE_NAME:$TAG construida exitosamente"
    echo "Tamaño de la imagen:"
    docker images $IMAGE_NAME:$TAG --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
else
    echo "Error al construir la imagen"
    exit 1
fi