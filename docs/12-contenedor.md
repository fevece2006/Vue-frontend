# Revisar el contenedor Docker y los archivos desplegados

Este proyecto construye el frontend con Vite y lo sirve con NGINX dentro de un contenedor.

- Los archivos finales (build) se copian a: `/usr/share/nginx/html`
- La configuración de NGINX se carga desde: `/etc/nginx/conf.d/default.conf`

## 1) Construir y levantar el contenedor (docker build / docker run)

Desde la raíz del proyecto:

```bash
docker build -t frontend-productos .

docker run -d -p 80:80 --name frontend-productos frontend-productos
```

Comandos útiles:

```bash
# Ver contenedores
docker ps

# Ver logs del contenedor (NGINX)
docker logs -n 200 frontend-productos

# Detener y eliminar el contenedor
docker stop frontend-productos
docker rm frontend-productos
```

La app queda accesible en:

- `http://localhost/` (puerto 80)

## 2) Levantar con Docker Compose (opcional)

Este repo también incluye `compose.yml` con el servicio `frontend-productos`:

```bash
docker compose up --build -d
```

Para apagar:

```bash
docker compose down
```

## 3) Entrar al contenedor (shell)

### Si levantaste con docker run

```bash
docker exec -it frontend-productos sh
```

### Si levantaste con docker compose

```bash
docker compose exec frontend-productos sh
```

> Nota: la imagen base es Alpine, así que lo normal es usar `sh`.

## 4) Ver los archivos desplegados (NGINX web root)

Ya dentro del contenedor:

```sh
pwd
ls -la /usr/share/nginx/html
```

Para ver algunos archivos puntuales:

```sh
ls -la /usr/share/nginx/html/assets

# listar archivos (primeros 50)
find /usr/share/nginx/html -type f | head -n 50
```

## 5) Confirmar la configuración de NGINX

Dentro del contenedor:

```sh
cat /etc/nginx/conf.d/default.conf
```

Deberías ver:

- `root /usr/share/nginx/html;`
- `try_files ... /index.html;` (para soportar rutas SPA)

## 6) Salir del contenedor

```sh
exit
```
