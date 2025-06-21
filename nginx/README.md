# Nginx Configuration

This directory contains the Nginx configuration for the AI Requirement application.

## Structure

```
nginx/
├── nginx.conf          # Main Nginx configuration
├── conf.d/             # Server block configurations
│   └── default.conf    # Default server configuration
└── README.md          # This file
```

## Configuration Overview

### Main Configuration (`nginx.conf`)
- **Worker Processes**: Auto-detected based on CPU cores
- **Worker Connections**: 1024 per worker
- **Gzip Compression**: Enabled for better performance
- **Rate Limiting**: 
  - API endpoints: 10 requests/second
  - Login endpoints: 5 requests/minute
- **Security Headers**: XSS protection, frame options, etc.
- **Client Max Body Size**: 100MB for file uploads

### Server Configuration (`conf.d/default.conf`)
- **Port**: 80 (HTTP)
- **Frontend**: Routes `/` to React app (port 3000)
- **API**: Routes `/api/*` to FastAPI backend (port 8000)
- **Documentation**: Routes `/docs` to Swagger UI
- **Health Check**: Routes `/health` to backend health endpoint
- **CORS**: Configured for API endpoints
- **Static Files**: Cached for 1 year

## Features

### 🚀 Performance
- Gzip compression for text-based files
- Static file caching
- Keep-alive connections
- Optimized worker processes

### 🔒 Security
- Rate limiting to prevent abuse
- Security headers (XSS, CSRF protection)
- CORS configuration
- Request size limits

### 📊 Monitoring
- Access and error logging
- Health check endpoints
- Detailed request logging

## Usage

### Development
```bash
# Start all services including Nginx
docker-compose up

# Access the application
http://localhost
```

### Production
For production deployment, consider:
1. Adding SSL/TLS certificates
2. Configuring domain names
3. Setting up monitoring
4. Adjusting rate limits
5. Configuring backup strategies

## Ports

- **80**: HTTP (Nginx)
- **443**: HTTPS (Nginx, for SSL)
- **3000**: Frontend (internal)
- **8000**: Backend (internal)
- **27017**: MongoDB (internal)

## Troubleshooting

### Check Nginx logs
```bash
docker-compose logs nginx
```

### Test Nginx configuration
```bash
docker-compose exec nginx nginx -t
```

### Reload Nginx configuration
```bash
docker-compose exec nginx nginx -s reload
``` 