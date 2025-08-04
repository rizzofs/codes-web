/**
 * Script para agregar las columnas necesarias y actualizar datos existentes
 */

// Configuración
const SPREADSHEET_ID = '1rCNIwjzB--xtIyK4gMvqIxJGLETra4VqnF5aL8lRTMk';
const SHEET_NAME = 'Registros_Sorteo';

/**
 * Función principal para agregar columnas y actualizar datos
 */
function agregarColumnasYActualizar() {
  try {
    console.log('🔧 Iniciando proceso de actualización de estructura...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    if (!sheet) {
      console.error('❌ Hoja no encontrada:', SHEET_NAME);
      return;
    }
    
    console.log('✅ Hoja encontrada:', SHEET_NAME);
    
    // Obtener headers actuales
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers actuales:', headers);
    
    // Columnas que necesitamos agregar
    const columnasNecesarias = [
      'Estado Pago',
      'Session ID', 
      'Payment ID',
      'Fecha Confirmación'
    ];
    
    let columnaActual = headers.length + 1;
    let columnasAgregadas = 0;
    
    // Agregar columnas que faltan
    columnasNecesarias.forEach(columna => {
      if (headers.indexOf(columna) === -1) {
        console.log(`➕ Agregando columna: ${columna} en posición ${columnaActual}`);
        sheet.getRange(1, columnaActual).setValue(columna);
        columnaActual++;
        columnasAgregadas++;
      } else {
        console.log(`✅ Columna ya existe: ${columna}`);
      }
    });
    
    console.log(`📊 Total de columnas agregadas: ${columnasAgregadas}`);
    
    // Actualizar registros existentes con valores por defecto
    const ultimaFila = sheet.getLastRow();
    if (ultimaFila > 1) {
      console.log('🔄 Actualizando registros existentes...');
      
      // Obtener headers actualizados
      const headersActualizados = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      console.log('📋 Headers actualizados:', headersActualizados);
      
      // Buscar índices de las nuevas columnas
      const estadoPagoIndex = headersActualizados.indexOf('Estado Pago');
      const sessionIdIndex = headersActualizados.indexOf('Session ID');
      const paymentIdIndex = headersActualizados.indexOf('Payment ID');
      const pagoConfirmadoIndex = headersActualizados.indexOf('Pago Confirmado');
      
      console.log('🔍 Índices encontrados:', {
        estadoPago: estadoPagoIndex,
        sessionId: sessionIdIndex,
        paymentId: paymentIdIndex,
        pagoConfirmado: pagoConfirmadoIndex
      });
      
      // Actualizar registros existentes
      for (let fila = 2; fila <= ultimaFila; fila++) {
        console.log(`🔄 Actualizando fila ${fila}...`);
        
        // Estado Pago por defecto: PENDIENTE
        if (estadoPagoIndex !== -1) {
          const pagoConfirmado = sheet.getRange(fila, pagoConfirmadoIndex + 1).getValue();
          const estadoPago = pagoConfirmado === 'TRUE' ? 'CONFIRMADO' : 'PENDIENTE';
          sheet.getRange(fila, estadoPagoIndex + 1).setValue(estadoPago);
          console.log(`  ✅ Estado Pago: ${estadoPago}`);
        }
        
        // Session ID por defecto
        if (sessionIdIndex !== -1) {
          const sessionId = sheet.getRange(fila, sessionIdIndex + 1).getValue();
          if (!sessionId || sessionId === '') {
            const nuevoSessionId = 'SES_' + Date.now() + '_' + fila;
            sheet.getRange(fila, sessionIdIndex + 1).setValue(nuevoSessionId);
            console.log(`  ✅ Session ID: ${nuevoSessionId}`);
          }
        }
        
        // Payment ID por defecto
        if (paymentIdIndex !== -1) {
          const paymentId = sheet.getRange(fila, paymentIdIndex + 1).getValue();
          if (!paymentId || paymentId === '') {
            sheet.getRange(fila, paymentIdIndex + 1).setValue('N/A');
            console.log(`  ✅ Payment ID: N/A`);
          }
        }
      }
    }
    
    console.log('✅ Proceso de actualización completado');
    
    // Mostrar resumen final
    const headersFinales = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers finales:', headersFinales);
    
  } catch (error) {
    console.error('❌ Error en proceso de actualización:', error);
  }
}

/**
 * Función para verificar el estado actual
 */
function verificarEstadoActual() {
  try {
    console.log('🔍 Verificando estado actual...');
    
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME);
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    console.log('📋 Headers encontrados:', headers);
    console.log('📊 Total de filas:', data.length);
    
    // Verificar columnas importantes
    const columnasImportantes = ['Pago Confirmado', 'Estado Pago', 'Session ID', 'Payment ID'];
    
    columnasImportantes.forEach(columna => {
      const index = headers.indexOf(columna);
      console.log(`🔍 ${columna}: ${index !== -1 ? '✅ Encontrada' : '❌ No encontrada'} (índice: ${index})`);
    });
    
    // Mostrar algunos datos de ejemplo
    if (data.length > 1) {
      console.log('📊 Datos de ejemplo (fila 2):', data[1]);
    }
    
  } catch (error) {
    console.error('❌ Error verificando estado:', error);
  }
}

/**
 * Función para ejecutar todo el proceso
 */
function ejecutarTodo() {
  console.log('🚀 Iniciando proceso completo...');
  
  // Verificar estado actual
  verificarEstadoActual();
  
  // Agregar columnas y actualizar
  agregarColumnasYActualizar();
  
  // Verificar estado final
  verificarEstadoActual();
  
  console.log('✅ Proceso completo finalizado');
} 