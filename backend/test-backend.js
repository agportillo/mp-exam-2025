import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

async function testEndpoints() {
  try {
    console.log('🧪 Probando endpoints del backend...\n');

    // Test health endpoint
    console.log('1. Probando /api/health...');
    const healthResponse = await axios.get(`${BASE_URL}/api/health`);
    console.log('✅ Health:', healthResponse.data);

    // Test servicios endpoint
    console.log('\n2. Probando /api/servicios-clave...');
    const serviciosResponse = await axios.get(`${BASE_URL}/api/servicios-clave`);
    console.log('✅ Servicios:', serviciosResponse.data.data.length, 'servicios encontrados');

    // Test informacion endpoint
    console.log('\n3. Probando /api/informacion-institucional...');
    const infoResponse = await axios.get(`${BASE_URL}/api/informacion-institucional`);
    console.log('✅ Información institucional cargada correctamente');

    // Test servicio individual
    console.log('\n4. Probando /api/servicios-clave/detalle/1...');
    const detalleResponse = await axios.get(`${BASE_URL}/api/servicios-clave/detalle/1`);
    console.log('✅ Detalle de servicio:', detalleResponse.data.data.nombre);

    console.log('\n🎉 ¡Todos los tests pasaron! El backend está funcionando correctamente.');

  } catch (error) {
    console.error('❌ Error en los tests:', error.message);
    console.log('\n💡 Solución: Asegúrate de que:');
    console.log('   - El backend esté ejecutándose (npm run dev)');
    console.log('   - El puerto 5000 esté disponible');
    console.log('   - No haya errores en la consola del backend');
  }
}

testEndpoints();