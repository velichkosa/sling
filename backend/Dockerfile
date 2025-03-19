FROM python:3.11-slim

WORKDIR /app

# Копируем и устанавливаем зависимости
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копируем все файлы проекта
COPY . .

# Собираем статические файлы
RUN python manage.py collectstatic --no-input

# Устанавливаем переменную окружения
ENV DJANGO_SETTINGS_MODULE=core.settings

# Открываем порт
EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
