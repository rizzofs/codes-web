/**
 * Script para crear las hojas del Hackathon
 * Ejecutar una sola vez para crear la estructura inicial
 */

function crearHojasHackathon() {
  // Obtener o crear el spreadsheet
  let spreadsheet;
  try {
    // Si ya existe un spreadsheet con este nombre, lo abre
    const files = DriveApp.getFilesByName('Hackathon CODES++ - Inscripciones');
    if (files.hasNext()) {
      spreadsheet = SpreadsheetApp.open(files.next());
      console.log('Spreadsheet existente encontrado');
    } else {
      // Si no existe, crea uno nuevo
      spreadsheet = SpreadsheetApp.create('Hackathon CODES++ - Inscripciones');
      console.log('Nuevo spreadsheet creado');
    }
  } catch (error) {
    console.error('Error al crear/abrir spreadsheet:', error);
    return;
  }

  // Crear hoja "Equipos"
  crearHojaEquipos(spreadsheet);
  
  // Crear hoja "Individual"
  crearHojaIndividual(spreadsheet);
  
  // Configurar permisos
  configurarPermisos(spreadsheet);
  
  console.log('✅ Hojas creadas exitosamente');
  console.log('📊 URL del Spreadsheet:', spreadsheet.getUrl());
}

/**
 * Crear hoja para equipos
 */
function crearHojaEquipos(spreadsheet) {
  let sheet;
  
  // Verificar si la hoja ya existe
  try {
    sheet = spreadsheet.getSheetByName('Equipos');
    if (sheet) {
      console.log('Hoja "Equipos" ya existe');
      return sheet;
    }
  } catch (error) {
    // La hoja no existe, continuar con la creación
  }
  
  // Crear nueva hoja
  sheet = spreadsheet.insertSheet('Equipos');
  
  // Definir encabezados para equipos
  const headersEquipos = [
    'Timestamp',
    'Nombre del Equipo',
    'Integrante 1 - Nombre',
    'Integrante 1 - Apellido', 
    'Integrante 1 - Email',
    'Integrante 1 - Discord',
    'Integrante 2 - Nombre',
    'Integrante 2 - Apellido',
    'Integrante 2 - Email', 
    'Integrante 2 - Discord',
    'Integrante 3 - Nombre',
    'Integrante 3 - Apellido',
    'Integrante 3 - Email',
    'Integrante 3 - Discord',
    'Estado',
    'Observaciones'
  ];
  
  // Escribir encabezados
  sheet.getRange(1, 1, 1, headersEquipos.length).setValues([headersEquipos]);
  
  // Formatear encabezados
  const headerRange = sheet.getRange(1, 1, 1, headersEquipos.length);
  headerRange.setBackground('#00ff88');
  headerRange.setFontColor('#000000');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(11);
  
  // Ajustar ancho de columnas
  sheet.autoResizeColumns(1, headersEquipos.length);
  
  // Congelar primera fila
  sheet.setFrozenRows(1);
  
  console.log('✅ Hoja "Equipos" creada');
  return sheet;
}

/**
 * Crear hoja para participantes individuales
 */
function crearHojaIndividual(spreadsheet) {
  let sheet;
  
  // Verificar si la hoja ya existe
  try {
    sheet = spreadsheet.getSheetByName('Individual');
    if (sheet) {
      console.log('Hoja "Individual" ya existe');
      return sheet;
    }
  } catch (error) {
    // La hoja no existe, continuar con la creación
  }
  
  // Crear nueva hoja
  sheet = spreadsheet.insertSheet('Individual');
  
  // Definir encabezados para participantes individuales
  const headersIndividual = [
    'Timestamp',
    'Nombre',
    'Apellido',
    'Email',
    'Usuario Discord',
    'Estado',
    'Equipo Asignado',
    'Observaciones'
  ];
  
  // Escribir encabezados
  sheet.getRange(1, 1, 1, headersIndividual.length).setValues([headersIndividual]);
  
  // Formatear encabezados
  const headerRange = sheet.getRange(1, 1, 1, headersIndividual.length);
  headerRange.setBackground('#0088ff');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setFontSize(11);
  
  // Ajustar ancho de columnas
  sheet.autoResizeColumns(1, headersIndividual.length);
  
  // Congelar primera fila
  sheet.setFrozenRows(1);
  
  console.log('✅ Hoja "Individual" creada');
  return sheet;
}

/**
 * Configurar permisos del spreadsheet
 */
function configurarPermisos(spreadsheet) {
  try {
    // Hacer el spreadsheet accesible para cualquiera con el enlace
    const file = DriveApp.getFileById(spreadsheet.getId());
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.EDIT);
    
    console.log('✅ Permisos configurados');
  } catch (error) {
    console.error('Error al configurar permisos:', error);
  }
}

/**
 * Función auxiliar para agregar datos de equipo
 * (Para uso futuro con el formulario)
 */
function agregarEquipo(datosEquipo) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('Equipos');
  
  if (!sheet) {
    console.error('Hoja "Equipos" no encontrada');
    return false;
  }
  
  // Preparar datos para insertar
  const timestamp = new Date();
  const rowData = [
    timestamp,
    datosEquipo.teamName,
    datosEquipo.member1_name,
    datosEquipo.member1_surname,
    datosEquipo.member1_email,
    datosEquipo.member1_discord,
    datosEquipo.member2_name,
    datosEquipo.member2_surname,
    datosEquipo.member2_email,
    datosEquipo.member2_discord,
    datosEquipo.member3_name,
    datosEquipo.member3_surname,
    datosEquipo.member3_email,
    datosEquipo.member3_discord,
    'Pendiente',
    ''
  ];
  
  // Insertar datos
  sheet.appendRow(rowData);
  
  console.log('✅ Equipo agregado:', datosEquipo.teamName);
  return true;
}

/**
 * Función auxiliar para agregar participante individual
 * (Para uso futuro con el formulario)
 */
function agregarIndividual(datosIndividual) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName('Individual');
  
  if (!sheet) {
    console.error('Hoja "Individual" no encontrada');
    return false;
  }
  
  // Preparar datos para insertar
  const timestamp = new Date();
  const rowData = [
    timestamp,
    datosIndividual.name,
    datosIndividual.surname,
    datosIndividual.email,
    datosIndividual.discord,
    'Pendiente',
    '',
    ''
  ];
  
  // Insertar datos
  sheet.appendRow(rowData);
  
  console.log('✅ Participante individual agregado:', datosIndividual.name);
  return true;
}

/**
 * Función para obtener estadísticas
 */
function obtenerEstadisticas() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    const sheetEquipos = spreadsheet.getSheetByName('Equipos');
    const sheetIndividual = spreadsheet.getSheetByName('Individual');
    
    const equiposInscritos = sheetEquipos ? sheetEquipos.getLastRow() - 1 : 0;
    const individualesInscritos = sheetIndividual ? sheetIndividual.getLastRow() - 1 : 0;
    const totalParticipantes = (equiposInscritos * 3) + individualesInscritos;
    
    console.log('📊 ESTADÍSTICAS DEL HACKATHON:');
    console.log(`Equipos inscritos: ${equiposInscritos}`);
    console.log(`Participantes individuales: ${individualesInscritos}`);
    console.log(`Total participantes: ${totalParticipantes}`);
    
    return {
      equipos: equiposInscritos,
      individuales: individualesInscritos,
      total: totalParticipantes
    };
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return null;
  }
}
