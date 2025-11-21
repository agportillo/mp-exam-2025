import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuración CORS para desarrollo
const corsOptions = {
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());

// Middleware de logging para debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Datos de servicios clave
const serviciosClave = [
  {
    id: 1,
    nombre: "Atención a Víctimas",
    descripcion: "Brindamos atención integral y acompañamiento a víctimas del delito durante el proceso penal.",
    icono: "🛡️",
    contacto: "victimas@mp.gob.gt"
  },
  {
    id: 2,
    nombre: "Fiscalía de la Mujer",
    descripcion: "Especializada en delitos contra mujeres, violencia intrafamiliar y violencia de género.",
    icono: "👩‍⚖️",
    contacto: "fiscaliamujer@mp.gob.gt"
  },
  {
    id: 3,
    nombre: "Fiscalía de Niñez y Adolescencia",
    descripcion: "Protección de los derechos de niñas, niños y adolescentes frente a delitos.",
    icono: "👧",
    contacto: "ninezyadolescencia@mp.gob.gt"
  },
  {
    id: 4,
    nombre: "Fiscalía contra la Corrupción",
    descripcion: "Investigación y persecución penal de delitos de corrupción pública y privada.",
    icono: "🔍",
    contacto: "anticorrupcion@mp.gob.gt"
  },
  {
    id: 5,
    nombre: "Fiscalía de Delitos Electrónicos",
    descripcion: "Combate a la ciberdelincuencia y delitos cometidos mediante tecnologías de información.",
    icono: "💻",
    contacto: "delitoselectronicos@mp.gob.gt"
  }
];

// Información sobre el Ministerio Público
const infoMinisterio = {
  mision: "Ejercer la acción penal pública en representación de la sociedad, dirigiendo la investigación de los delitos de acción pública y velando por el estricto cumplimiento de las leyes del país.",
  vision: "Ser una institución eficiente, transparente y confiable, que garantice el acceso a la justicia y contribuya a la seguridad jurídica en Guatemala.",
  valores: ["Integridad", "Transparencia", "Imparcialidad", "Ética", "Compromiso"],
  funciones: [
    "Investigar los delitos de acción pública",
    "Ejercer la acción penal",
    "Proteger a las víctimas y testigos",
    "Velar por el respeto de los derechos humanos"
  ]
};

// Rutas de la API - CORREGIDAS
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Backend del Ministerio Público funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/servicios-clave', (req, res) => {
  res.json({
    success: true,
    data: serviciosClave,
    total: serviciosClave.length
  });
});

app.get('/api/informacion-institucional', (req, res) => {
  res.json({
    success: true,
    data: infoMinisterio
  });
});

// Ruta corregida para servicio individual - SIN parámetros problemáticos
app.get('/api/servicios-clave/detalle/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const servicio = serviciosClave.find(s => s.id === id);
  
  if (!servicio) {
    return res.status(404).json({
      success: false,
      message: 'Servicio no encontrado'
    });
  }
  
  res.json({
    success: true,
    data: servicio
  });
});

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: 'API del Ministerio Público de Guatemala',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      servicios: '/api/servicios-clave',
      informacion: '/api/informacion-institucional'
    }
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Ruta no encontrada
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor del Ministerio Público corriendo en http://localhost:${PORT}`);
  console.log(`📊 Endpoints disponibles:`);
  console.log(`   GET /api/health`);
  console.log(`   GET /api/servicios-clave`);
  console.log(`   GET /api/informacion-institucional`);
  console.log(`   GET /api/servicios-clave/detalle/:id`);
});