/**
 * Diagnóstico de pagos existentes
 */

const SPREADSHEET_ID = '1rCNIwjzB--xtIyK4gMvqIxJGLETra4VqnF5aL8lRTMk';
const SHEET_NAME = 'Registros_Sorteo';
const MERCADOPAGO_ACCESS_TOKEN = 'APP_USR-5908100961878781-080320-3d4cf3e45d4723bffa7e302677cce571-2142366374';

function diagnosticarPagosExistentes() {
  try {
    console.log('🔍 Iniciando diagnóstico de pagos existentes...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    console.log('📋 Headers encontrados:', headers);
    console.log('📊 Total de filas:', data.length);
    
    // Buscar índices de columnas importantes
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const sessionIdIndex = headers.indexOf('Session ID');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const nombreIndex = headers.indexOf('Nombre');
    const emailIndex = headers.indexOf('Email');
    
    console.log('🔍 Índices encontrados:', {
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      sessionId: sessionIdIndex,
      paymentId: paymentIdIndex,
      nombre: nombreIndex,
      email: emailIndex
    });
    
    // Analizar cada fila de datos
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const nombre = row[nombreIndex] || 'Sin nombre';
      const email = row[emailIndex] || 'Sin email';
      const pagoConfirmado = row[pagoConfirmadoIndex];
      const estadoPago = row[estadoPagoIndex];
      const sessionId = row[sessionIdIndex] || 'N/A';
      const paymentId = row[paymentIdIndex] || 'N/A';
      
      console.log(`\n📊 Fila ${i + 1}:`);
      console.log(`  👤 Nombre: ${nombre}`);
      console.log(`  📧 Email: ${email}`);
      console.log(`  💳 Pago Confirmado: ${pagoConfirmado}`);
      console.log(`  📋 Estado Pago: ${estadoPago}`);
      console.log(`  🔑 Session ID: ${sessionId}`);
      console.log(`  🆔 Payment ID: ${paymentId}`);
      
      // Verificar si es un pago que debería confirmarse
      if (pagoConfirmado === 'TRUE') {
        console.log(`  ✅ PAGO YA CONFIRMADO`);
      } else if (pagoConfirmado === 'FALSE' && estadoPago === 'PENDIENTE') {
        console.log(`  ⏳ PAGO PENDIENTE - Buscando en MercadoPago...`);
        
        // Intentar buscar el pago en MercadoPago
        const pagoEncontrado = buscarPagoEnMercadoPago(sessionId, paymentId, nombre, email);
        
        if (pagoEncontrado) {
          console.log(`  ✅ PAGO ENCONTRADO EN MERCADOPAGO`);
        } else {
          console.log(`  ❌ PAGO NO ENCONTRADO EN MERCADOPAGO`);
        }
      } else {
        console.log(`  ❓ ESTADO DESCONOCIDO`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error en diagnóstico:', error);
  }
}

function buscarPagoEnMercadoPago(sessionId, paymentId, nombre, email) {
  try {
    console.log(`    🔍 Buscando pago para: ${nombre} (${email})`);
    
    // Si tenemos paymentId válido, buscarlo directamente
    if (paymentId && paymentId !== 'N/A' && paymentId !== '') {
      console.log(`    🔍 Buscando por Payment ID: ${paymentId}`);
      
      const url = `https://api.mercadopago.com/v1/payments/${paymentId}`;
      const response = UrlFetchApp.fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.getResponseCode() === 200) {
        const paymentData = JSON.parse(response.getContentText());
        console.log(`    ✅ Pago encontrado por Payment ID`);
        console.log(`    📊 Estado: ${paymentData.status}`);
        console.log(`    💰 Monto: ${paymentData.transaction_amount}`);
        return true;
      } else {
        console.log(`    ❌ Payment ID no válido: ${response.getResponseCode()}`);
      }
    }
    
    // Si no tenemos paymentId, buscar por external_reference (sessionId)
    if (sessionId && sessionId !== 'N/A' && sessionId !== '') {
      console.log(`    🔍 Buscando por Session ID: ${sessionId}`);
      
      const url = `https://api.mercadopago.com/v1/payments/search?external_reference=${sessionId}`;
      const response = UrlFetchApp.fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.getResponseCode() === 200) {
        const searchData = JSON.parse(response.getContentText());
        
        if (searchData.results && searchData.results.length > 0) {
          const payment = searchData.results[0];
          console.log(`    ✅ Pago encontrado por Session ID`);
          console.log(`    📊 Estado: ${payment.status}`);
          console.log(`    💰 Monto: ${payment.transaction_amount}`);
          return true;
        } else {
          console.log(`    ❌ No se encontraron pagos para Session ID`);
        }
      } else {
        console.log(`    ❌ Error buscando por Session ID: ${response.getResponseCode()}`);
      }
    }
    
    // Buscar por email (si es posible)
    console.log(`    🔍 Buscando por email: ${email}`);
    const url = `https://api.mercadopago.com/v1/payments/search?payer.email=${email}`;
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.getResponseCode() === 200) {
      const searchData = JSON.parse(response.getContentText());
      
      if (searchData.results && searchData.results.length > 0) {
        console.log(`    ✅ Pago encontrado por email`);
        console.log(`    📊 Total de pagos: ${searchData.results.length}`);
        
        searchData.results.forEach((payment, index) => {
          console.log(`    📊 Pago ${index + 1}:`);
          console.log(`      🆔 ID: ${payment.id}`);
          console.log(`      📊 Estado: ${payment.status}`);
          console.log(`      💰 Monto: ${payment.transaction_amount}`);
          console.log(`      📅 Fecha: ${payment.date_created}`);
        });
        
        return true;
      } else {
        console.log(`    ❌ No se encontraron pagos para el email`);
      }
    } else {
      console.log(`    ❌ Error buscando por email: ${response.getResponseCode()}`);
    }
    
    return false;
    
  } catch (error) {
    console.error(`    ❌ Error buscando pago:`, error);
    return false;
  }
}

function buscarTodosLosPagos() {
  try {
    console.log('🔍 Buscando todos los pagos en MercadoPago...');
    
    // Buscar pagos recientes (últimos 30 días)
    const fechaDesde = new Date();
    fechaDesde.setDate(fechaDesde.getDate() - 30);
    
    const url = `https://api.mercadopago.com/v1/payments/search?date_created=from=${fechaDesde.toISOString()}&limit=50`;
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.getResponseCode() === 200) {
      const searchData = JSON.parse(response.getContentText());
      
      console.log(`📊 Total de pagos encontrados: ${searchData.results.length}`);
      
      searchData.results.forEach((payment, index) => {
        console.log(`\n📊 Pago ${index + 1}:`);
        console.log(`  🆔 ID: ${payment.id}`);
        console.log(`  📊 Estado: ${payment.status}`);
        console.log(`  💰 Monto: ${payment.transaction_amount}`);
        console.log(`  📅 Fecha: ${payment.date_created}`);
        console.log(`  📧 Email: ${payment.payer?.email || 'N/A'}`);
        console.log(`  🔑 External Reference: ${payment.external_reference || 'N/A'}`);
      });
      
    } else {
      console.error('❌ Error buscando pagos:', response.getResponseCode());
    }
    
  } catch (error) {
    console.error('❌ Error buscando pagos:', error);
  }
} 