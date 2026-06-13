# backend/Dockerfile
FROM python:3.13-slim

# Set the working directory
WORKDIR /app

# Copy dependency list and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose the FastAPI port
EXPOSE 8000

# Start Uvicorn bound to 0.0.0.0 so it can communicate outside the container
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]