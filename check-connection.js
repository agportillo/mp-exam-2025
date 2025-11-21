const axios = require('axios');

async function checkBackend() {
  try {
    console.log('🔍 Verificando conexión con el backend...');
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('✅ Backend funcionando:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Backend no disponible:', error.message);
    return false;
  }
}

async function checkFrontend() {
  try {
    console.log('🔍 Verificando conexión con el frontend...');
    const response = await axios.get('http://localhost:3000');
    console.log('✅ Frontend funcionando');
    return true;
  } catch (error) {
    console.log('❌ Frontend no disponible:', error.message);
    return false;
  }
}

async function main() {
  const backendOk = await checkBackend();
  const frontendOk = await checkFrontend();
  
  if (backendOk && frontendOk) {
    console.log('🎉 ¡Ambos servicios están funcionando correctamente!');
  } else {
    console.log('💡 Solución: Asegúrate de ejecutar:');
    console.log('   Terminal 1: cd backend && npm run dev');
    console.log('   Terminal 2: cd frontend && npm start');
  }
}

main();