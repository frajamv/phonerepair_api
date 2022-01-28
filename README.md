# PhonerepairAPI
REST API para la aplicación de reparación de teléfonos. Repositorio backend para prueba técnica Mid-Level de Innpactia.
Proyecto generado con NodeJS.

## Ejecutar servidor local:
Ejecutar en terminal integrada `npm run dev` para ejecutar servidor local de desarrollo de la aplicación teniendo el archivo de entorno (.env) en la raíz del proyecto. El servidor estará en línea escuchando peticiones en la ruta `http://localhost:3500/` o la definida en el archivo de entorno (.env).

## Acceder a versión pública de aplicación:
La REST API se encuentra montada en el servicio de Heroku y se puede consumir desde el [enlace](https://phonerepair-api.herokuapp.com/api) para ingresar a los servicios de la aplicación.

## Rutas principales (local y público):
- /users: Ruta inicial de los usuarios dentro del sistema, resuelve las peticiones correspondientes a los datos personales de un usuario y la gestión de la sesión (roles y login) de la aplicación.
- /phones: Ruta inicial de los teléfonos registrados por usuario en el sistema, resuelve las peticiones correspondientes a los datos de un teléfono y las reparaciones registradas de los mismos.
NOTA: Sólamente se podrá acceder a las rutas de la REST API con un token de acceso obtenido consumiendo el servicio de login y poniendo el token como parámetro, como parte del body o como header con la llave 'x-access-control-token'.

## Rutas de usuarios (host/api/users):
`- GET /`: [Requiere token] Obtiene todos los usuarios del sistema. 
`- POST /`: Registra un nuevo usuario en el sistema recibiendo sus datos en el request body.
`- POST /authenticate`: Recibe las credenciales en el request body y verifica que estas sean de un usuario válido de tipo administrador. Retorna el usuario obtenido y un token para futuras peticiones.
`- GET /client`: [Requiere token] Obtiene todos los clientes del sistema (usuarios con rol 'Cliente') junto con sus teléfonos.
`- GET /client/:id`: [Requiere token] Obtiene todos datos personales de un cliente del sistema cuyo id se adjunta como request param, también trae sus teléfonos y reparaciones.

## Rutas de teléfonos (host/api/phones):
`- POST /:id`: [Requiere token] Registra un nuevo teléfono con sus datos en el request body.
`- GET /repairings`: [Requiere token] Obtiene todas las reparaciones a teléfonos realizadas en el sistema.
`- POST /repairings`: [Requiere token] Registra una nueva reparación a un teléfono con sus datos en el request body.
`- GET /repairings/:id`: [Requiere token] Obtiene todas las reparaciones realizadas a un teléfono específico registrado en el sistema.

## Ejecutar módulo de pruebas automatizadas:
Para ejecutar las pruebas automatizadas del REST API se debe ejecutar el comando `npm run test` en la raíz del proyecto.

## Notas finales:
- Las credenciales compuestas por el nombre de usuario 'mocha' y contraseña 'root123' pueden ser utilizadas para acceder al mismo. En caso de pérdida o limpieza de base de datos, es posible registrarse e iniciar sesión.
- La REST API utilizada para realizar las operaciones de datos se encuentra montada en el servicio de Heroku, no se require el montaje del mismo.
- La base de datos utilizada para almacenar y tratar los datos de la prueba se encuentra montada en el servicio RDS de AWS, no se requiere el montaje de la misma.
- Proyecto creado y montado en todas sus fases de desarrollo por Francisco Javier Martínez Vargas en Enero de 2022.