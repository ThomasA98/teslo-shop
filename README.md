# Next.js TesloShop App
Para correr localmente, se necesita la base de datos
```
docker-compose up -d
```
* El -d, significa __detached__

* MongoDB URL Local:
```
mongodb://localhost:27017/teslodb
```
* Impuestos (si no se proporciona toma como valor 0)
````
NEXT_PUBLIC_TAX_RATE=0.15
```
## Llenar la base de datos con informacion de pruebas
Llamar a:
```
http://localhost:3000/api/seed
```