// Shared Groups utilities for managing WhatsApp links per subject (materia)
// Replace GROUPS_API_URL with your deployed Apps Script Web App URL

const GROUPS_API_URL = 'https://script.google.com/macros/s/AKfycbzbT2XUsfzgOKSSNqz8RidUDsIE8wsvN1k0KFkqNurV1A63uOeAP81qiduzouW0ZP8W_Q/exec';

// Canonical list of materias (code and name) - Plan 17.14 (actual)
const MATERIAS_1714 = [
  { code: '11271', name: 'Introducción a la Programación' },
  { code: '13014', name: 'Matemática Básica' },
  { code: '21256', name: 'Introducción a los Sistemas de Información' },
  { code: '11274', name: 'Programación Estructurada' },
  { code: '11256', name: 'Sistemas de Información I' },
  { code: '41407', name: 'Organización de Computadoras' },
  { code: '13021', name: 'Álgebra Lineal y Geometría' },
  { code: '11275', name: 'Estructuras de Datos y Algoritmos I' },
  { code: '11258', name: 'Sistemas de Información II' },
  { code: '13022', name: 'Análisis Matemático I' },
  { code: '41426', name: 'Arquitectura de Computadoras' },
  { code: '11276', name: 'Programación Orientada a Objetos' },
  { code: '13923', name: 'Análisis Matemático II' },
  { code: '11259', name: 'Sistemas de Información III' },
  { code: '11410', name: 'Sistemas Operativos' },
  { code: '11083', name: 'Estadística y Probabilidad' },
  { code: '14027', name: 'Fundamentos de Redes de Datos' },
  { code: '11286', name: 'Programación en Ambiente Web' },
  { code: '11277', name: 'Bases de Datos Relacionales' },
  { code: '21279', name: 'Gestión de Soluciones Innovadoras' },
  { code: '11287', name: 'Seminario de Integración Profesional' },
  { code: '11278', name: 'Bases de Datos Distribuidas' },
  { code: '14028', name: 'Matemática Computacional' },
  { code: '14029', name: 'Administración de Redes' },
  { code: '14030', name: 'Estructuras de Datos y Algoritmos II' },
  { code: '14031', name: 'Teoría de la Computación' },
  { code: '11260', name: 'Sistemas de Información IV' },
  { code: '11288', name: 'Gestión de Datos Masivos' },
  { code: '14032', name: 'Diseño Avanzado de Software' },
  { code: '41429', name: 'Sistemas Distribuidos y Programación Paralela' },
  { code: '14034', name: 'Modelos de decisión y optimización' },
  { code: '11292', name: 'Seguridad Informática' },
  { code: '11289', name: 'Inteligencia Artificial' },
  { code: '14033', name: 'Bases de Datos Textuales' },
  { code: '21258', name: 'Gestión de Proyectos' },
  { code: '21257', name: 'Aspectos Profesionales y Sociales' },
  { code: '11091', name: 'Taller de Tesina' }
];

// Plan 17.13 (según UNLu)
const MATERIAS_1713 = [
  // I
  { code: '11071', name: 'Introducción a la Programación' },
  { code: '11072', name: 'Álgebra y Lógica Computacional' },
  { code: '21056', name: 'Introducción a los Sistemas de Información' },
  { code: '41407', name: 'Organización de Computadoras' },
  // II
  { code: '11073', name: 'Matemática Discreta' },
  { code: '11074', name: 'Programación I' },
  { code: '41406', name: 'Arquitectura de Computadoras' },
  { code: '31971', name: 'Inglés I' },
  // III
  { code: '11081', name: 'Análisis Matemático I' },
  { code: '11075', name: 'Programación II' },
  { code: '11056', name: 'Sistemas de Información I' },
  { code: '31972', name: 'Inglés II' },
  // IV
  { code: '11082', name: 'Análisis Matemático II' },
  { code: '11410', name: 'Sistemas Operativos' },
  { code: '11076', name: 'Programación Orientada a Objetos' },
  { code: '11077', name: 'Base de Datos I' },
  // V
  { code: '11058', name: 'Sistemas de Información II' },
  { code: '10040', name: 'Teleinformática y Redes' },
  { code: '11083', name: 'Estadística y Probabilidad' },
  { code: '11079', name: 'Programación Funcional y Lógica' },
  // VI
  { code: '11059', name: 'Sistemas de Información III' },
  { code: '11078', name: 'Base de Datos II' },
  { code: '21057', name: 'Aspectos Profesionales y Sociales' },
  { code: '11085', name: 'Administración y Gestión de Redes' },
  // VII
  { code: '41408', name: 'Modelos, Simulación y Teoría de la Decisión' },
  { code: '41409', name: 'Sistemas Distribuidos y Programación Paralela' },
  { code: '11086', name: 'Programación en Ambiente Web' },
  { code: '11087', name: 'Seminario de Integración Profesional' },
  // Ciclo Licenciatura
  { code: '11412', name: 'Teoría de la Computación I' },
  { code: '11088', name: 'Base de Datos Masivas (Gestión y Análisis)' },
  { code: '11060', name: 'Sistemas de Información IV' },
  { code: '11089', name: 'Sistemas Inteligentes' },
  { code: '11092', name: 'Seguridad de la Información' },
  { code: '11090', name: 'Recuperación de Información' },
  { code: '11091', name: 'Taller de Tesina' },
  { code: '11417', name: 'Teoría de la Computación II' },
  { code: '21058', name: 'Gestión de Proyectos' },
  { code: '41410', name: 'Calidad de los Sistemas de Información' },
  { code: '11095', name: 'Tesina de Grado' }
];

function getMateriasByPlan(plan) {
  return String(plan) === '1713' ? MATERIAS_1713 : MATERIAS_1714;
}

function getMateriaByCode(code, plan) {
  const list = getMateriasByPlan(plan || '1714');
  return list.find(m => m.code === code) || null;
}

async function fetchAllGroups(plan) {
  const url = `${GROUPS_API_URL}?action=list${plan ? `&plan=${encodeURIComponent(plan)}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo obtener la lista de grupos');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.rows || []);
}

async function fetchGroupByCode(code, plan) {
  const url = `${GROUPS_API_URL}?action=get&code=${encodeURIComponent(code)}${plan ? `&plan=${encodeURIComponent(plan)}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo obtener el grupo');
  return await res.json();
}

async function upsertGroupLink({ code, name, link, updatedBy, plan }) {
  const payload = { code, name, link, updatedBy, plan };
  // Apps Script Web App suele requerir no-cors para evitar preflight OPTIONS con application/json
  // Enviamos y asumimos éxito; luego se verifica con un GET
  await fetch(GROUPS_API_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return { result: 'sent' };
}

// Helper to apply theme from localStorage (in case this file is loaded alone)
(function applySavedTheme() {
  try {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
  } catch (e) {}
})();

// Expose in window
window.Groups = {
  GROUPS_API_URL,
  MATERIAS_1714,
  MATERIAS_1713,
  getMateriasByPlan,
  getMateriaByCode,
  fetchAllGroups,
  fetchGroupByCode,
  upsertGroupLink
};


