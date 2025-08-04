// Script para verificar manualmente el estado de un pago
// Ejecutar en Google Apps Script

const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-5908100961878781-080320-3d4cf3e45d4723bffa7e302677cce571-2142366374';
const COLLECTOR_ID = 2142366374;

/**
 * Verificar pagos recientes para un email específico
 */
function verificarPagoPorEmail(email) {
  try {
    console.log(`🔍 Verificando pagos para email: ${email}`);
    
    const url = `https://api.mercadopago.com/v1/payments/search?limit=200`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const searchData = JSON.parse(response.getContentText());
    
    console.log(`📊 Total de pagos encontrados: ${searchData.results.length}`);
    
    // Filtrar por collector_id y buscar por email
    const pagosRecibidos = searchData.results.filter(payment => 
      payment.collector_id === COLLECTOR_ID
    );
    
    console.log(`📊 Pagos recibidos por collector_id ${COLLECTOR_ID}: ${pagosRecibidos.length}`);
    
    // Buscar pagos que coincidan con el email o fecha
    const pagosCoincidentes = pagosRecibidos.filter(payment => {
      // Verificar si el pago tiene información del pagador
      if (payment.payer && payment.payer.email) {
        return payment.payer.email.toLowerCase() === email.toLowerCase();
      }
      return false;
    });
    
    console.log(`📊 Pagos coincidentes para ${email}: ${pagosCoincidentes.length}`);
    
    // Mostrar detalles de cada pago encontrado
    pagosCoincidentes.forEach((payment, index) => {
      console.log(`\n📋 Pago ${index + 1}:`);
      console.log(`   ID: ${payment.id}`);
      console.log(`   Estado: ${payment.status}`);
      console.log(`   Monto: $${payment.transaction_amount}`);
      console.log(`   Fecha: ${payment.date_created}`);
      console.log(`   Email: ${payment.payer.email}`);
      console.log(`   Referencia externa: ${payment.external_reference || 'N/A'}`);
    });
    
    return pagosCoincidentes;
    
  } catch (error) {
    console.error('❌ Error verificando pago:', error);
    return [];
  }
}

/**
 * Verificar pagos por fecha específica
 */
function verificarPagoPorFecha(fecha) {
  try {
    console.log(`🔍 Verificando pagos para fecha: ${fecha}`);
    
    const url = `https://api.mercadopago.com/v1/payments/search?limit=200`;
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const searchData = JSON.parse(response.getContentText());
    
    // Filtrar por collector_id y fecha
    const pagosRecibidos = searchData.results.filter(payment => 
      payment.collector_id === COLLECTOR_ID
    );
    
    // Buscar pagos de la fecha específica
    const pagosCoincidentes = pagosRecibidos.filter(payment => {
      const paymentDate = new Date(payment.date_created);
      const targetDate = new Date(fecha);
      
      return paymentDate.toDateString() === targetDate.toDateString();
    });
    
    console.log(`📊 Pagos encontrados para ${fecha}: ${pagosCoincidentes.length}`);
    
    // Mostrar detalles
    pagosCoincidentes.forEach((payment, index) => {
      console.log(`\n📋 Pago ${index + 1}:`);
      console.log(`   ID: ${payment.id}`);
      console.log(`   Estado: ${payment.status}`);
      console.log(`   Monto: $${payment.transaction_amount}`);
      console.log(`   Fecha: ${payment.date_created}`);
      console.log(`   Email: ${payment.payer?.email || 'N/A'}`);
      console.log(`   Referencia externa: ${payment.external_reference || 'N/A'}`);
    });
    
    return pagosCoincidentes;
    
  } catch (error) {
    console.error('❌ Error verificando pago por fecha:', error);
    return [];
  }
}

// Ejecutar verificación
function verificarPagoRizzo() {
  console.log('🔍 Iniciando verificación de pago para Rizzo...');
  
  // Verificar por email
  const pagosPorEmail = verificarPagoPorEmail('rizzofs@gmail.com');
  
  // Verificar por fecha
  const pagosPorFecha = verificarPagoPorFecha('2025-08-04');
  
  console.log('\n📊 RESUMEN:');
  console.log(`Pagos encontrados por email: ${pagosPorEmail.length}`);
  console.log(`Pagos encontrados por fecha: ${pagosPorFecha.length}`);
  
  if (pagosPorEmail.length === 0 && pagosPorFecha.length === 0) {
    console.log('❌ No se encontraron pagos coincidentes');
    console.log('💡 Posibles causas:');
    console.log('   - El pago aún no se procesó en MercadoPago');
    console.log('   - El email no coincide exactamente');
    console.log('   - El pago fue rechazado o cancelado');
  }
} 