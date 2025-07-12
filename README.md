📱 Aplicación de Autenticación con React Native
Descripción
Esta es una aplicación móvil desarrollada con React Native que implementa un sistema de autenticación local con:

Inicio de sesión y registro de usuarios

Navegación protegida

Menú lateral (Drawer Navigation)

Formularios con validación

Gestión de estado con Context API

🛠 Tecnologías utilizadas
React Native (v0.73+)

TypeScript

Expo Router (Sistema de navegación basado en archivos)

React Navigation (Drawer Navigation)

React Native Gesture Handler & Reanimated (Para animaciones y gestos)


📂 Estructura del proyecto

app/
├── _layout.tsx          # Layout principal de autenticación
├── login.tsx            # Pantalla de inicio de sesión
├── register.tsx         # Pantalla de registro
└── (tabs)/             # Rutas protegidas (requieren autenticación)
    ├── _layout.tsx      # Layout del drawer navigation
    ├── index.tsx        # Pantalla principal (Home)
    └── settings.tsx     # Pantalla de configuración

components/
└── AuthForm.tsx         # Componente reutilizable para formularios

context/
└── AuthContext.tsx      # Contexto para gestión de autenticación


////////////////////////////////////////////
✨ Características principales
Autenticación segura:

Validación de campos en cliente

Estados de carga durante las operaciones

Protección de rutas privadas

Interfaz intuitiva:

Diseño responsive

Feedback visual para errores

Menú lateral accesible

Arquitectura limpia:

Separación clara de responsabilidades

Componentes reutilizables

Tipado estático con TypeScript

🚀 Cómo ejecutar el proyecto
Prerrequisitos
Node.js (v18+)

npm o yarn

Expo CLI (opcional)

////////////////////////////////////////////
Instalar dependencias:npm install
# o
yarn install


Configurar entorno:npx expo install

Ejecución
Android:

bash
npm run android


Web (modo desarrollo):

bash
npm run web


/////////////////////////
📝 Licencia
Este proyecto está bajo la licencia MIT. Ver el archivo LICENSE para más detalles.

🤝 Contribuciones
Las contribuciones son bienvenidas. Por favor abre un issue o pull request para sugerencias o mejoras.

📬 Contacto
Para preguntas o soporte, contacta al desarrollador:

Email: rojas.rojas440@gmail.com

////////////////////////////////////////////

