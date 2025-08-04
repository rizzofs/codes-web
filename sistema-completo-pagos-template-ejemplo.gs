// ===========================================
// SISTEMA COMPLETO DE PAGOS - PLANTILLA
// ===========================================
// IMPORTANTE: Este es un archivo de ejemplo - NO contiene datos reales

// CONFIGURACIÓN DE MERCADOPAGO
const MERCADOPAGO_ACCESS_TOKEN = 'TU_MERCADOPAGO_ACCESS_TOKEN_AQUI';
const GOOGLE_SHEET_ID = 'TU_GOOGLE_SHEET_ID_AQUI';
const GOOGLE_SHEET_NAME = 'TU_NOMBRE_DE_HOJA';

// CONFIGURACIÓN DE COLECTOR
const COLLECTOR_ID = 123456789; // Tu ID de colector en MercadoPago
const COLLECTOR_EMAIL = 'tu-email@ejemplo.com'; // Tu email de MercadoPago

// ===========================================
// FUNCIÓN DE INICIALIZACIÓN AUTOMÁTICA
// ===========================================

/**
 * Función que se ejecuta automáticamente al abrir el script
 * Verifica y agrega la columna "Email Enviado" si no existe
 */
function onOpen() {
  try {
    console.log('🚀 Inicializando sistema...');
    verificarYAgregarColumnaEmailEnviado();
    console.log('✅ Sistema inicializado correctamente');
  } catch (error) {
    console.error('❌ Error en inicialización:', error);
  }
}

// ===========================================
// FUNCIONES PRINCIPALES
// ===========================================

/**
 * Función manual para verificar y agregar la columna "Email Enviado"
 * Puedes ejecutar esta función desde el editor de Apps Script
 */
function verificarYAgregarColumnaEmailEnviado() {
  try {
    console.log('🔍 Verificando si existe la columna "Email Enviado"...');
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers actuales
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers actuales:', headers);
    
    // Verificar si ya existe la columna "Email Enviado"
    const emailEnviadoIndex = headers.indexOf('Email Enviado');
    
    if (emailEnviadoIndex === -1) {
      console.log('➕ Agregando columna "Email Enviado"...');
      
      // Agregar la nueva columna al final
      const nuevaColumna = sheet.getLastColumn() + 1;
      sheet.getRange(1, nuevaColumna).setValue('Email Enviado');
      
      // Rellenar todas las filas existentes con 'FALSE'
      const ultimaFila = sheet.getLastRow();
      if (ultimaFila > 1) {
        const rangoRellenar = sheet.getRange(2, nuevaColumna, ultimaFila - 1, 1);
        rangoRellenar.setValue('FALSE');
      }
      
      console.log('✅ Columna "Email Enviado" agregada correctamente');
      return true;
    } else {
      console.log('✅ La columna "Email Enviado" ya existe');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error verificando/agregando columna Email Enviado:', error);
    return false;
  }
}

/**
 * Función para verificar el estado de la columna "Email Enviado"
 * Ejecuta esta función desde el editor de Apps Script para ver el estado
 */
function verificarEstadoColumnaEmailEnviado() {
  try {
    console.log('🔍 Verificando estado de la columna "Email Enviado"...');
    
    const sheet = SpreadsheetApp.openById(GOOGLE_SHEET_ID).getSheetByName(GOOGLE_SHEET_NAME);
    if (!sheet) {
      throw new Error('No se encontró la hoja especificada');
    }
    
    // Obtener los headers actuales
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    console.log('📋 Headers actuales:', headers);
    
    // Verificar si existe la columna "Email Enviado"
    const emailEnviadoIndex = headers.indexOf('Email Enviado');
    
    if (emailEnviadoIndex === -1) {
      console.log('❌ La columna "Email Enviado" NO existe');
      console.log('💡 Ejecuta la función verificarYAgregarColumnaEmailEnviado() para agregarla');
      return false;
    } else {
      console.log('✅ La columna "Email Enviado" existe en la posición:', emailEnviadoIndex + 1);
      
      // Contar cuántos emails han sido enviados
      const ultimaFila = sheet.getLastRow();
      if (ultimaFila > 1) {
        const valoresEmailEnviado = sheet.getRange(2, emailEnviadoIndex + 1, ultimaFila - 1, 1).getValues();
        const emailsEnviados = valoresEmailEnviado.filter(valor => valor[0] === 'TRUE').length;
        const emailsNoEnviados = valoresEmailEnviado.filter(valor => valor[0] === 'FALSE').length;
        
        console.log(`📊 Estado de emails:`);
        console.log(`   - Enviados: ${emailsEnviados}`);
        console.log(`   - No enviados: ${emailsNoEnviados}`);
        console.log(`   - Total registros: ${ultimaFila - 1}`);
      }
      
      return true;
    }
    
  } catch (error) {
    console.error('❌ Error verificando estado de columna Email Enviado:', error);
    return false;
  }
}

// NOTA: El resto del código se copia del archivo principal
// pero sin los datos sensibles de configuración 