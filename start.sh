#!/bin/bash

echo "Instalando dependências do front-end..."
cd frontend
npm install
npm start &
cd ..

echo "Instalando dependências do back-end..."
cd backend
npm install
npm run setup-db-docker
npm run start &
cd ..

echo "Instalando dependências da API..."

cd backend/api/env

source env/bin/activate 

pip install pandas
pip install Flask Flask-CORS

python3 GA_SBIE_API.py &
cd ..

wait
echo "Todos os serviços estão rodando."
