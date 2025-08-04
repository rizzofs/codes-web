// ===========================================
// SISTEMA COMPLETO DE PAGOS - TEMPLATE
// ===========================================
// IMPORTANTE: Reemplaza los valores de configuración con tus datos reales
// NO subas este archivo con tokens reales al repositorio

// CONFIGURACIÓN DE MERCADOPAGO
const MERCADOPAGO_ACCESS_TOKEN = 'TU_ACCESS_TOKEN_AQUI'; // Reemplaza con tu token real
const GOOGLE_SHEET_ID = 'TU_SHEET_ID_AQUI'; // Reemplaza con tu ID de Google Sheet
const GOOGLE_SHEET_NAME = 'TU_NOMBRE_DE_HOJA_AQUI'; // Reemplaza con el nombre de tu hoja

// CONFIGURACIÓN DE COLECTOR
const COLLECTOR_ID = 2142366374; // Tu ID de colector en MercadoPago
const COLLECTOR_EMAIL = 'rizzofs.eu@gmail.com'; // Tu email de MercadoPago

// ===========================================
// FUNCIONES PRINCIPALES
// ===========================================

/**
 * Función principal para recibir datos del formulario
 */
function doPost(e) {
  try {
    console.log('📥 Datos recibidos:', e.postData.contents);
    const data = JSON.parse(e.postData.contents);
    
    // Verificar si es una verificación de pago
    if (data.action === 'verificarPago') {
      console.log('🔍 Verificando pago...');
      const result = verificarPagoPorDatos(data);
      
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Verificar si es una verificación automática
    if (data.action === 'ejecutarVerificacionAutomatica') {
      console.log('🤖 Ejecutando verificación automática...');
      const result = verificarPagosAutomaticamente();
      
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Verificar si es para completar datos faltantes
    if (data.action === 'completarDatosFaltantes') {
      console.log('🔧 Completando datos faltantes...');
      const result = completarDatosFaltantes();
      
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Verificar si es una actualización de pago existente
    if (data.sessionId && !data.nombre && !data.apellido && !data.email) {
      console.log('🔄 Actualizando pago existente...');
      const result = actualizarPagoExistente(data);
      
      if (result.success) {
        return ContentService
          .createTextOutput(JSON.stringify({ success: true, message: 'Pago actualizado correctamente' }))
          .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService
          .createTextOutput(JSON.stringify({ success: false, error: result.error }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Validar datos requeridos para nuevo registro
    if (!data.nombre || !data.apellido || !data.email || !data.telefono || !data.cantidadChances) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: 'Faltan datos requeridos' 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Guardar en Google Sheets
    const result = guardarEnGoogleSheets(data);
    
    if (result.success) {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: true, 
          message: 'Datos guardados correctamente',
          sessionId: data.sessionId 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    } else {
      return ContentService
        .createTextOutput(JSON.stringify({ 
          success: false, 
          error: result.error 
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    console.error('❌ Error en doPost:', error);
    return ContentService
      .createTextOutput(JSON.stringify({ 
        success: false, 
        error: error.message 
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Guarda los datos del formulario en Google Sheets
 */
function guardarEnGoogleSheets(data) {
  try {
    console.log('💾 Guardando datos en Google Sheets...');
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers de la hoja para mapear correctamente
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers encontrados:', headers);
    
    // Crear array de datos basado en los headers exactos
    const rowData = [];
    
    // Mapear cada header con su valor correspondiente
    headers.forEach(header => {
      switch(header) {
        case 'Timestamp':
          rowData.push(new Date());
          break;
        case 'Nombre':
          rowData.push(data.nombre || '');
          break;
        case 'Apellido':
          rowData.push(data.apellido || '');
          break;
        case 'Email':
          rowData.push(data.email || '');
          break;
        case 'DNI':
          rowData.push(data.dni || '');
          break;
        case 'Teléfono':
          rowData.push(data.telefono || '');
          break;
        case 'Cantidad de Chances':
          rowData.push(data.cantidadChances || '');
          break;
        case 'Pago Confirmado':
          rowData.push(data.pagoConfirmado ? 'TRUE' : 'FALSE');
          break;
        case 'Fecha de Registro':
          rowData.push(data.fechaRegistro || new Date().toISOString());
          break;
        case 'Observaciones':
          rowData.push(data.observaciones || '');
          break;
        case 'Estado Pago':
          rowData.push(data.estadoPago || 'PENDIENTE');
          break;
        case 'Session ID':
          rowData.push(data.sessionId || '');
          break;
        case 'Payment ID':
          rowData.push(data.paymentId || 'N/A');
          break;
        case 'Fecha Confirmación':
          rowData.push(data.fechaConfirmacion || '');
          break;
        default:
          rowData.push(''); // Para headers no reconocidos
      }
    });
    
    console.log('📊 Datos a guardar:', rowData);
    sheet.appendRow(rowData);
    console.log('✅ Datos guardados correctamente');
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error guardando datos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualiza un pago existente en Google Sheets
 */
function actualizarPagoExistente(data) {
  try {
    console.log('🔄 Actualizando pago existente con sessionId:', data.sessionId);
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers para encontrar las columnas correctas
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers encontrados:', headers);
    
    // Encontrar los índices de las columnas
    const sessionIdIndex = headers.indexOf('Session ID');
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaConfirmacionIndex = headers.indexOf('Fecha Confirmación');
    
    console.log('🔍 Índices encontrados:', {
      sessionId: sessionIdIndex,
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      paymentId: paymentIdIndex,
      fechaConfirmacion: fechaConfirmacionIndex
    });
    
    if (sessionIdIndex === -1) {
      throw new Error('No se encontró la columna Session ID');
    }
    
    // Buscar la fila por Session ID
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let rowIndex = -1;
    for (let i = 1; i < values.length; i++) { // Empezar desde la fila 2 (después del header)
      if (values[i][sessionIdIndex] === data.sessionId) {
        rowIndex = i + 1; // +1 porque getValues() devuelve índices basados en 0
        break;
      }
    }
    
    if (rowIndex === -1) {
      throw new Error('No se encontró el Session ID en la hoja');
    }
    
    console.log('✅ Fila encontrada:', rowIndex);
    
    // Actualizar solo las columnas de pago
    if (pagoConfirmadoIndex !== -1) {
      sheet.getRange(rowIndex, pagoConfirmadoIndex + 1).setValue('TRUE');
    }
    if (estadoPagoIndex !== -1) {
      sheet.getRange(rowIndex, estadoPagoIndex + 1).setValue('CONFIRMADO');
    }
    if (paymentIdIndex !== -1 && data.paymentId && data.paymentId !== 'N/A' && data.paymentId !== null) {
      sheet.getRange(rowIndex, paymentIdIndex + 1).setValue(data.paymentId);
    }
    if (fechaConfirmacionIndex !== -1) {
      sheet.getRange(rowIndex, fechaConfirmacionIndex + 1).setValue(new Date().toISOString());
    }
    
    console.log('✅ Pago actualizado correctamente en fila:', rowIndex);
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error actualizando pago:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verifica pagos pendientes en Google Sheets
 */
function verificarPagosPendientes() {
  try {
    console.log('🔍 Verificando pagos pendientes...');
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers para encontrar las columnas correctas
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers encontrados:', headers);
    
    // Encontrar los índices de las columnas
    const sessionIdIndex = headers.indexOf('Session ID');
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaConfirmacionIndex = headers.indexOf('Fecha Confirmación');
    const emailIndex = headers.indexOf('Email');
    
    console.log('🔍 Índices encontrados:', {
      sessionId: sessionIdIndex,
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      paymentId: paymentIdIndex,
      fechaConfirmacion: fechaConfirmacionIndex,
      email: emailIndex
    });
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let pagosActualizados = 0;
    
    // Empezar desde la fila 2 (después del header)
    for (let i = 1; i < values.length; i++) {
      const estadoPago = values[i][estadoPagoIndex];
      const pagoConfirmado = values[i][pagoConfirmadoIndex];
      const sessionId = values[i][sessionIdIndex];
      
      if (estadoPago === 'PENDIENTE' && pagoConfirmado === 'FALSE' && sessionId) {
        console.log(`🔍 Verificando pago para sessionId: ${sessionId}`);
        
        const resultado = verificarPagoEnMercadoPago(sessionId);
        
        if (resultado.confirmado) {
          // Actualizar la fila
          const rowIndex = i + 1;
          if (pagoConfirmadoIndex !== -1) {
            sheet.getRange(rowIndex, pagoConfirmadoIndex + 1).setValue('TRUE');
          }
          if (estadoPagoIndex !== -1) {
            sheet.getRange(rowIndex, estadoPagoIndex + 1).setValue('CONFIRMADO');
          }
          if (paymentIdIndex !== -1) {
            sheet.getRange(rowIndex, paymentIdIndex + 1).setValue(resultado.paymentId);
          }
          if (fechaConfirmacionIndex !== -1) {
            sheet.getRange(rowIndex, fechaConfirmacionIndex + 1).setValue(new Date().toISOString());
          }
          
          console.log(`✅ Pago confirmado para sessionId: ${sessionId}`);
          pagosActualizados++;
          
          // Enviar email de confirmación
          const email = values[i][emailIndex];
          if (email) {
            enviarEmailConfirmacion(email, sessionId, resultado.paymentId);
          }
        }
      }
    }
    
    console.log(`📊 Total de pagos actualizados: ${pagosActualizados}`);
    return { success: true, pagosActualizados };
    
  } catch (error) {
    console.error('❌ Error verificando pagos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Verifica un pago específico en MercadoPago
 */
function verificarPagoEnMercadoPago(sessionId) {
  try {
    console.log(`🔍 Verificando pago en MercadoPago para sessionId: ${sessionId}`);
    
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
    
    // Filtrar por collector_id
    const collectorId = 2142366374;
    const pagosRecibidos = searchData.results.filter(payment => 
      payment.collector_id === collectorId
    );
    
    console.log(`📊 Pagos recibidos por collector_id ${collectorId}: ${pagosRecibidos.length}`);
    
    // Buscar pago que coincida con el sessionId
    for (const payment of pagosRecibidos) {
      if (payment.external_reference === sessionId && payment.status === 'approved') {
        console.log(`✅ Pago confirmado encontrado: ${payment.id}`);
        return {
          confirmado: true,
          paymentId: payment.id,
          amount: payment.transaction_amount,
          status: payment.status
        };
      }
    }
    
    console.log(`❌ No se encontró pago confirmado para sessionId: ${sessionId}`);
    return { confirmado: false };
    
  } catch (error) {
    console.error('❌ Error verificando pago en MercadoPago:', error);
    return { confirmado: false, error: error.message };
  }
}

/**
 * Verifica un pago específico usando datos del usuario
 */
function verificarPagoPorDatos(data) {
  try {
    console.log('🔍 Verificando pago por datos:', data);
    
    if (!data.email || !data.fechaRegistro) {
      return { success: false, error: 'Email y fecha de registro son requeridos' };
    }
    
    // Configurar fecha de búsqueda con tolerancia de ±1 día
    const fechaRegistro = new Date(data.fechaRegistro);
    const fechaInicio = new Date(fechaRegistro.getTime() - 24 * 60 * 60 * 1000); // -1 día
    const fechaFin = new Date(fechaRegistro.getTime() + 24 * 60 * 60 * 1000); // +1 día
    
    console.log('📅 Rango de fechas para búsqueda:', {
      fechaRegistro: fechaRegistro.toISOString(),
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString()
    });
    
    // Buscar pagos en MercadoPago
    const url = `https://api.mercadopago.com/v1/payments/search`;
    const params = {
      'collector.id': COLLECTOR_ID,
      'date_created.from': fechaInicio.toISOString(),
      'date_created.to': fechaFin.toISOString(),
      'status': 'approved'
    };
    
    console.log('🔗 URL de búsqueda:', url);
    console.log('📋 Parámetros:', params);
    
    const response = UrlFetchApp.fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + MERCADOPAGO_ACCESS_TOKEN,
        'Content-Type': 'application/json'
      },
      muteHttpExceptions: true
    });
    
    console.log('📥 Respuesta de MercadoPago:', response.getResponseCode());
    
    if (response.getResponseCode() !== 200) {
      console.error('❌ Error en respuesta de MercadoPago:', response.getContentText());
      return { success: false, error: 'Error comunicándose con MercadoPago' };
    }
    
    const responseData = JSON.parse(response.getContentText());
    console.log('📊 Pagos encontrados:', responseData.results?.length || 0);
    
    if (!responseData.results || responseData.results.length === 0) {
      return { success: false, error: 'No se encontraron pagos aprobados para este período' };
    }
    
    // Buscar pago que coincida con el email
    let pagoEncontrado = null;
    for (const pago of responseData.results) {
      console.log('🔍 Revisando pago:', {
        id: pago.id,
        external_reference: pago.external_reference,
        payer_email: pago.payer?.email,
        status: pago.status,
        amount: pago.transaction_amount
      });
      
      // Verificar si el email coincide
      if (pago.payer && pago.payer.email && pago.payer.email.toLowerCase() === data.email.toLowerCase()) {
        console.log('✅ Pago encontrado por email:', pago.id);
        pagoEncontrado = pago;
        break;
      }
    }
    
    if (!pagoEncontrado) {
      return { success: false, error: 'No se encontró un pago aprobado para este email' };
    }
    
    // Generar sessionId si no existe
    let sessionId = data.sessionId;
    if (!sessionId) {
      sessionId = 'SES_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      console.log('🆔 Session ID generado:', sessionId);
    }
    
    // Preparar datos para actualizar Google Sheets
    const datosActualizados = {
      sessionId: sessionId,
      paymentId: pagoEncontrado.id.toString(),
      estadoPago: 'CONFIRMADO',
      pagoConfirmado: true,
      fechaConfirmacion: new Date().toISOString(),
      collectionStatus: 'approved',
      status: pagoEncontrado.status,
      // Datos adicionales del pago
      paymentMethod: pagoEncontrado.payment_method?.type || 'N/A',
      installments: pagoEncontrado.installments || 1,
      currency: pagoEncontrado.currency_id || 'ARS',
      amount: pagoEncontrado.transaction_amount || 0,
      // Datos del usuario para búsqueda
      email: data.email,
      nombre: data.nombre,
      apellido: data.apellido
    };
    
    console.log('📊 Datos actualizados para Google Sheets:', datosActualizados);
    
    // Actualizar Google Sheets
    const result = actualizarPagoEnGoogleSheets(datosActualizados);
    
    if (result.success) {
      console.log('✅ Pago verificado y actualizado exitosamente');
      return {
        success: true,
        message: 'Pago verificado y actualizado',
        data: datosActualizados
      };
    } else {
      console.error('❌ Error actualizando Google Sheets:', result.error);
      return { success: false, error: result.error };
    }
    
  } catch (error) {
    console.error('❌ Error en verificarPagoPorDatos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Actualiza un pago en Google Sheets usando sessionId o email
 */
function actualizarPagoEnGoogleSheets(datos) {
  try {
    console.log('📝 Actualizando pago en Google Sheets:', datos);
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener headers
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers encontrados:', headers);
    
    // Encontrar índices de columnas
    const sessionIdIndex = headers.indexOf('Session ID');
    const emailIndex = headers.indexOf('Email');
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaConfirmacionIndex = headers.indexOf('Fecha Confirmación');
    
    console.log('🔍 Índices encontrados:', {
      sessionId: sessionIdIndex,
      email: emailIndex,
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      paymentId: paymentIdIndex,
      fechaConfirmacion: fechaConfirmacionIndex
    });
    
    // Buscar fila por sessionId o email
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let rowIndex = -1;
    let searchMethod = '';
    
    // Primero buscar por sessionId si existe
    if (datos.sessionId && sessionIdIndex !== -1) {
      for (let i = 1; i < values.length; i++) {
        if (values[i][sessionIdIndex] === datos.sessionId) {
          rowIndex = i + 1;
          searchMethod = 'sessionId';
          break;
        }
      }
    }
    
    // Si no se encontró por sessionId, buscar por email
    if (rowIndex === -1 && datos.email && emailIndex !== -1) {
      for (let i = 1; i < values.length; i++) {
        if (values[i][emailIndex] && values[i][emailIndex].toLowerCase() === datos.email.toLowerCase()) {
          rowIndex = i + 1;
          searchMethod = 'email';
          break;
        }
      }
    }
    
    if (rowIndex === -1) {
      throw new Error('No se encontró el registro en la hoja');
    }
    
    console.log('✅ Fila encontrada:', rowIndex, 'por método:', searchMethod);
    
    // Actualizar columnas
    if (pagoConfirmadoIndex !== -1) {
      sheet.getRange(rowIndex, pagoConfirmadoIndex + 1).setValue('TRUE');
    }
    if (estadoPagoIndex !== -1) {
      sheet.getRange(rowIndex, estadoPagoIndex + 1).setValue('CONFIRMADO');
    }
    if (paymentIdIndex !== -1 && datos.paymentId) {
      sheet.getRange(rowIndex, paymentIdIndex + 1).setValue(datos.paymentId);
    }
    if (fechaConfirmacionIndex !== -1) {
      sheet.getRange(rowIndex, fechaConfirmacionIndex + 1).setValue(new Date().toISOString());
    }
    if (sessionIdIndex !== -1 && datos.sessionId) {
      sheet.getRange(rowIndex, sessionIdIndex + 1).setValue(datos.sessionId);
    }
    
    console.log('✅ Pago actualizado correctamente en fila:', rowIndex);
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error actualizando pago en Google Sheets:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Función para verificación automática de pagos (ejecutar manualmente o con trigger)
 */
function verificarPagosAutomaticamente() {
  try {
    console.log('🤖 Iniciando verificación automática de pagos...');
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers para encontrar las columnas correctas
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Encontrar los índices de las columnas
    const emailIndex = headers.indexOf('Email');
    const nombreIndex = headers.indexOf('Nombre');
    const apellidoIndex = headers.indexOf('Apellido');
    const fechaRegistroIndex = headers.indexOf('Fecha de Registro');
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaConfirmacionIndex = headers.indexOf('Fecha Confirmación');
    const sessionIdIndex = headers.indexOf('Session ID');
    
    console.log('🔍 Índices encontrados:', {
      email: emailIndex,
      nombre: nombreIndex,
      apellido: apellidoIndex,
      fechaRegistro: fechaRegistroIndex,
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      paymentId: paymentIdIndex,
      fechaConfirmacion: fechaConfirmacionIndex,
      sessionId: sessionIdIndex
    });
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let pagosVerificados = 0;
    let pagosConfirmados = 0;
    
    // Empezar desde la fila 2 (después del header)
    for (let i = 1; i < values.length; i++) {
      const email = values[i][emailIndex];
      const nombre = values[i][nombreIndex];
      const apellido = values[i][apellidoIndex];
      const fechaRegistro = values[i][fechaRegistroIndex];
      const pagoConfirmado = values[i][pagoConfirmadoIndex];
      const estadoPago = values[i][estadoPagoIndex];
      const sessionId = values[i][sessionIdIndex];
      
      // Solo verificar pagos que no estén confirmados
      if (pagoConfirmado !== 'TRUE' && email && fechaRegistro) {
        console.log(`🔍 Verificando pago para: ${email} - ${fechaRegistro}`);
        
        const resultado = verificarPagoPorDatos({
          email: email,
          nombre: nombre,
          apellido: apellido,
          fechaRegistro: fechaRegistro,
          sessionId: sessionId
        });
        
        if (resultado.success) {
          console.log(`✅ Pago confirmado para: ${email}`);
          console.log(`   - Payment ID: ${resultado.data.paymentId}`);
          console.log(`   - Session ID: ${resultado.data.sessionId}`);
          console.log(`   - Status: ${resultado.data.status}`);
          console.log(`   - Amount: $${resultado.data.amount}`);
          
          pagosConfirmados++;
          
          // Enviar email de confirmación si está disponible
          if (typeof enviarEmailConfirmacion === 'function') {
            enviarEmailConfirmacion(email, resultado.data.sessionId, resultado.data.paymentId);
          }
        } else {
          console.log(`❌ No se pudo verificar pago para: ${email} - ${resultado.error}`);
        }
        
        pagosVerificados++;
      }
    }
    
    console.log(`📊 Resumen de verificación automática:`);
    console.log(`   - Pagos verificados: ${pagosVerificados}`);
    console.log(`   - Pagos confirmados: ${pagosConfirmados}`);
    
    return { 
      success: true, 
      pagosVerificados, 
      pagosConfirmados 
    };
    
  } catch (error) {
    console.error('❌ Error en verificación automática:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * Completa datos faltantes en registros existentes
 */
function completarDatosFaltantes() {
  try {
    console.log('🔧 Completando datos faltantes en registros existentes...');
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers para encontrar las columnas correctas
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    
    // Encontrar los índices de las columnas
    const emailIndex = headers.indexOf('Email');
    const fechaRegistroIndex = headers.indexOf('Fecha de Registro');
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaConfirmacionIndex = headers.indexOf('Fecha Confirmación');
    const sessionIdIndex = headers.indexOf('Session ID');
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let registrosCompletados = 0;
    
    // Empezar desde la fila 2 (después del header)
    for (let i = 1; i < values.length; i++) {
      const email = values[i][emailIndex];
      const fechaRegistro = values[i][fechaRegistroIndex];
      const pagoConfirmado = values[i][pagoConfirmadoIndex];
      const estadoPago = values[i][estadoPagoIndex];
      const sessionId = values[i][sessionIdIndex];
      const paymentId = values[i][paymentIdIndex];
      
      // Buscar registros con Pago Confirmado = TRUE pero datos faltantes
      if (pagoConfirmado === 'TRUE' && 
          (!sessionId || sessionId === '' || sessionId === 'N/A' || 
           !paymentId || paymentId === '' || paymentId === 'N/A')) {
        
        console.log(`🔍 Completando datos para: ${email}`);
        
        const resultado = verificarPagoPorDatos({
          email: email,
          fechaRegistro: fechaRegistro.split('T')[0]
        });
        
        if (resultado.success && resultado.pagoEncontrado) {
          const rowIndex = i + 1;
          
          // Completar Session ID si está vacío
          if (sessionIdIndex !== -1 && (!sessionId || sessionId === '' || sessionId === 'N/A')) {
            sheet.getRange(rowIndex, sessionIdIndex + 1).setValue(resultado.sessionId);
            console.log(`📝 Session ID completado: ${resultado.sessionId}`);
          }
          
          // Completar Payment ID si está vacío
          if (paymentIdIndex !== -1 && (!paymentId || paymentId === '' || paymentId === 'N/A')) {
            sheet.getRange(rowIndex, paymentIdIndex + 1).setValue(resultado.paymentId);
            console.log(`📝 Payment ID completado: ${resultado.paymentId}`);
          }
          
          registrosCompletados++;
        }
      }
    }
    
    console.log(`📊 Registros completados: ${registrosCompletados}`);
    return { 
      success: true, 
      registrosCompletados 
    };
    
  } catch (error) {
    console.error('❌ Error completando datos:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

/**
 * Configura el trigger automático para verificación de pagos
 */
function configurarTriggerAutomatico() {
  try {
    console.log('⚙️ Configurando trigger automático...');
    
    // Eliminar triggers existentes
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'verificarPagosAutomaticamente') {
        ScriptApp.deleteTrigger(trigger);
        console.log('🗑️ Trigger anterior eliminado');
      }
    });
    
    // Crear nuevo trigger que se ejecute cada hora
    ScriptApp.newTrigger('verificarPagosAutomaticamente')
      .timeBased()
      .everyHours(1)
      .create();
    
    console.log('✅ Trigger automático configurado (cada hora)');
    return { success: true, message: 'Trigger configurado correctamente' };
    
  } catch (error) {
    console.error('❌ Error configurando trigger:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Ejecuta verificación manual (para testing)
 */
function ejecutarVerificacionManual() {
  console.log('🔧 Ejecutando verificación manual...');
  const resultado = verificarPagosAutomaticamente();
  console.log('📊 Resultado de verificación manual:', resultado);
  return resultado;
}

/**
 * Envía email de confirmación
 */
function enviarEmailConfirmacion(email, sessionId, paymentId) {
  try {
    console.log(`📧 Enviando email de confirmación a: ${email}`);
    
    const subject = '🎉 ¡Tu participación en el sorteo ha sido confirmada!';
    const body = `
¡Gracias por participar en nuestro sorteo! 🎉

✅ Tu pago ha sido confirmado con éxito.
🧾 ID de pago: ${paymentId}

🎁 Estás participando por una Tablet.
📅 El sorteo se realizará el 30/09/2025.
Te notificaremos por este medio en cuanto tengamos los resultados.

🙏 Gracias por apoyar nuestro viaje al CACIC 2025.
¡Tu ayuda nos acerca un paso más!

Saludos cordiales,
Codes++
    `;
    
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: body
    });
    
    console.log('✅ Email de confirmación enviado');
    
  } catch (error) {
    console.error('❌ Error enviando email:', error);
  }
}

/**
 * Busca pagos del usuario en MercadoPago
 */
function buscarPagosUsuario() {
  try {
    console.log('🔍 Buscando pagos recibidos...');
    
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
    
    console.log(`📊 Total de pagos disponibles: ${searchData.results.length}`);
    
    // Filtrar por collector_id
    const collectorId = 2142366374;
    const pagosRecibidos = searchData.results.filter(payment => 
      payment.collector_id === collectorId
    );
    
    console.log(`📊 Pagos recibidos por collector_id ${collectorId}: ${pagosRecibidos.length}`);
    
    // Mostrar información de los primeros 10 pagos
    for (let i = 0; i < Math.min(pagosRecibidos.length, 10); i++) {
      const payment = pagosRecibidos[i];
      console.log(`📊 Pago ${i + 1}:`);
      console.log(`   ID: ${payment.id}`);
      console.log(`   Estado: ${payment.status}`);
      console.log(`   Monto: $${payment.transaction_amount}`);
      console.log(`   Fecha: ${payment.date_created}`);
      console.log(`   External Reference: ${payment.external_reference}`);
      console.log(`   Payer Email: ${payment.payer?.email || 'N/A'}`);
      console.log('   ---');
    }
    
    return { success: true, totalPagos: pagosRecibidos.length };
    
  } catch (error) {
    console.error('❌ Error buscando pagos:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Función de prueba para verificar el mapeo de columnas
 */
function probarMapeoColumnas() {
  try {
    console.log('🧪 Probando mapeo de columnas...');
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers encontrados:', headers);
    
    // Encontrar los índices de las columnas importantes
    const sessionIdIndex = headers.indexOf('Session ID');
    const pagoConfirmadoIndex = headers.indexOf('Pago Confirmado');
    const estadoPagoIndex = headers.indexOf('Estado Pago');
    const paymentIdIndex = headers.indexOf('Payment ID');
    const fechaConfirmacionIndex = headers.indexOf('Fecha Confirmación');
    
    console.log('🔍 Índices encontrados:', {
      sessionId: sessionIdIndex,
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      paymentId: paymentIdIndex,
      fechaConfirmacion: fechaConfirmacionIndex
    });
    
    // Verificar que todas las columnas necesarias existen
    const columnasRequeridas = ['Session ID', 'Pago Confirmado', 'Estado Pago', 'Payment ID', 'Fecha Confirmación'];
    const columnasFaltantes = columnasRequeridas.filter(col => headers.indexOf(col) === -1);
    
    if (columnasFaltantes.length > 0) {
      console.log('❌ Columnas faltantes:', columnasFaltantes);
      return { success: false, error: 'Columnas faltantes: ' + columnasFaltantes.join(', ') };
    }
    
    console.log('✅ Todas las columnas requeridas están presentes');
    return { success: true, headers, indices: {
      sessionId: sessionIdIndex,
      pagoConfirmado: pagoConfirmadoIndex,
      estadoPago: estadoPagoIndex,
      paymentId: paymentIdIndex,
      fechaConfirmacion: fechaConfirmacionIndex
    }};
    
  } catch (error) {
    console.error('❌ Error probando mapeo:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Prueba la conexión con MercadoPago
 */
function probarMercadoPago() {
  try {
    console.log('🔍 Probando API de MercadoPago...');
    
    const url = 'https://api.mercadopago.com/v1/payments/search?limit=1';
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${MERCADOPAGO_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    const response = UrlFetchApp.fetch(url, options);
    const data = JSON.parse(response.getContentText());
    
    console.log('✅ Conexión a MercadoPago exitosa');
    console.log(`📊 Total de pagos disponibles: ${data.paging.total}`);
    
    return { success: true, totalPagos: data.paging.total };
    
  } catch (error) {
    console.error('❌ Error probando MercadoPago:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Configura el trigger para verificación automática
 */
function configurarTrigger() {
  try {
    console.log('⏰ Configurando trigger automático...');
    
    // Eliminar triggers existentes
    const triggers = ScriptApp.getProjectTriggers();
    triggers.forEach(trigger => {
      if (trigger.getHandlerFunction() === 'verificarPagosPendientes') {
        ScriptApp.deleteTrigger(trigger);
      }
    });
    
    // Crear nuevo trigger (cada hora)
    ScriptApp.newTrigger('verificarPagosPendientes')
      .timeBased()
      .everyHours(1)
      .create();
    
    console.log('✅ Trigger configurado correctamente');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Error configurando trigger:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Función para ejecutar el sistema completo
 */
function ejecutarSistema() {
  try {
    console.log('🚀 Ejecutando sistema completo...');
    
    // Probar conexión
    const pruebaConexion = probarMercadoPago();
    if (!pruebaConexion.success) {
      throw new Error('Error en conexión con MercadoPago');
    }
    
    // Verificar pagos pendientes
    const verificacion = verificarPagosPendientes();
    if (!verificacion.success) {
      throw new Error('Error verificando pagos pendientes');
    }
    
    console.log('✅ Sistema ejecutado correctamente');
    return { success: true, verificacion };
    
  } catch (error) {
    console.error('❌ Error ejecutando sistema:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Función para probar el flujo completo con datos simulados
 */
function probarFlujoCompleto() {
  try {
    console.log('🧪 Probando flujo completo con datos simulados...');
    
    // Simular datos iniciales (PENDIENTE)
    const datosIniciales = {
      nombre: 'Federico Sebastián',
      apellido: 'Rizzo',
      email: 'rizzofs@gmail.com',
      dni: '31608123',
      telefono: '234652913',
      cantidadChances: '1',
      estadoPago: 'PENDIENTE',
      pagoConfirmado: false,
      fechaRegistro: new Date().toISOString(),
      sessionId: 'TEST_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      paymentId: 'N/A'
    };
    
    console.log('📊 Datos iniciales:', datosIniciales);
    
    // Guardar datos iniciales
    const resultadoInicial = guardarEnGoogleSheets(datosIniciales);
    if (!resultadoInicial.success) {
      throw new Error('Error guardando datos iniciales: ' + resultadoInicial.error);
    }
    
    console.log('✅ Datos iniciales guardados correctamente');
    
    // Simular datos de confirmación
    const datosConfirmacion = {
      sessionId: datosIniciales.sessionId,
      estadoPago: 'CONFIRMADO',
      pagoConfirmado: true,
      paymentId: 'TEST_PAY_' + Date.now(),
      fechaConfirmacion: new Date().toISOString()
    };
    
    console.log('📊 Datos de confirmación:', datosConfirmacion);
    
    // Actualizar datos
    const resultadoConfirmacion = actualizarPagoExistente(datosConfirmacion);
    if (!resultadoConfirmacion.success) {
      throw new Error('Error actualizando datos: ' + resultadoConfirmacion.error);
    }
    
    console.log('✅ Datos de confirmación actualizados correctamente');
    
    return { 
      success: true, 
      sessionId: datosIniciales.sessionId,
      message: 'Flujo completo probado exitosamente' 
    };
    
  } catch (error) {
    console.error('❌ Error probando flujo completo:', error);
    return { success: false, error: error.message };
  }
}

// ===========================================
// INSTRUCCIONES DE CONFIGURACIÓN
// ===========================================
/*
1. Reemplaza TU_ACCESS_TOKEN_AQUI con tu token real de MercadoPago
2. Reemplaza TU_SHEET_ID_AQUI con el ID de tu Google Sheet
3. Reemplaza TU_NOMBRE_DE_HOJA_AQUI con el nombre de la hoja donde guardar los datos
4. Copia este archivo a Google Apps Script
5. Ejecuta las siguientes funciones en orden para verificar el sistema:

   A. probarMapeoColumnas() - Verifica que las columnas estén correctamente mapeadas
   B. probarMercadoPago() - Verifica la conexión con MercadoPago
   C. probarFlujoCompleto() - Prueba el flujo completo con datos simulados
   D. configurarTrigger() - Configura la verificación automática (una sola vez)
   E. buscarPagosUsuario() - Para ver los pagos recibidos

6. Si hay errores, revisa los logs para identificar el problema específico
7. Para depurar pagos reales, ejecuta verificarPagosPendientes() después de un pago real
*/ 