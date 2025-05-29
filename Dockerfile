# Base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy files
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app

# Expose port
EXPOSE 8080

# Start app
CMD ["gunicorn", "--chdir", "app", "main:app", "--bind", "0.0.0.0:8080"]
