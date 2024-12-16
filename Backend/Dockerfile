# Usa a imagem base do Python
FROM python:3.10-slim

WORKDIR /app

# Copia o arquivo de dependências do Django (requirements.txt)
COPY requirements.txt .

# Instala as dependências do Django
RUN pip install -r requirements.txt

# Copia o restante do código
COPY . .

# Expõe a porta 8000 (do Django)
EXPOSE 8000

# Comando para rodar o Django (iniciar o servidor)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
