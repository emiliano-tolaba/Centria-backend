Preparación del entorno de trabajo

# 1. Inicializar el proyecto con npm
Este comando crea automáticamente un archivo package.json con valores por defecto.
El archivo package.json es esencial para gestionar las dependencias y scripts del proyecto.

🔹 npm init -y

# 2. Configuración del archivo 'package.json'

🔹 Agregar "type": "module" en package.json.
🔹 Crear scripts:
    "start": "node index.js",
    "dev": "nodemon index.js"
🔹 Configurar autor, licencia y versión 

# 2. Instalación del framework Express
Instala Express, un framework minimalista para construir servidores web con Node.js..
Se agrega como dependencia del proyecto (aparecerá en dependencies dentro de package.json).

🔹 npm i express

# 3. Instalación de Nodemon (como dependencia de desarrollo)
Instala Nodemon, una herramienta que reinicia automáticamente el servidor cuando detecta cambios en los archivos.
Se instala como dependencia de desarrollo (-D o --save-dev), ya que solo se usa durante el desarrollo, no en producción.

🔹 npm i -D nodemon

# 4. Instalación de Cors
Middleware que habilita o restringe solicitudes entre distintos orígenes (Cross-Origin Resource Sharing). Esencial para que tu frontend pueda comunicarse con tu backend.

🔹npm i cors
