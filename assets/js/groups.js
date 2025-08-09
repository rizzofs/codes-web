// Shared Groups utilities for managing WhatsApp links per subject (materia)
// Replace GROUPS_API_URL with your deployed Apps Script Web App URL

const GROUPS_API_URL = 'https://script.google.com/macros/s/AKfycbwsOQYXKo4Wq3zUsSFtniSBzsUNGGS4gSukrObYEUsXPOsIY6IKBm_Gmu8OOW7-Vjjppg/exec';

// Canonical list of materias (code and name)
const MATERIAS = [
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

function getMateriaByCode(code) {
  return MATERIAS.find(m => m.code === code) || null;
}

async function fetchAllGroups() {
  const url = `${GROUPS_API_URL}?action=list`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo obtener la lista de grupos');
  const data = await res.json();
  return Array.isArray(data) ? data : (data.rows || []);
}

async function fetchGroupByCode(code) {
  const url = `${GROUPS_API_URL}?action=get&code=${encodeURIComponent(code)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('No se pudo obtener el grupo');
  return await res.json();
}

async function upsertGroupLink({ code, name, link, updatedBy }) {
  const payload = { code, name, link, updatedBy };
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
  MATERIAS,
  getMateriaByCode,
  fetchAllGroups,
  fetchGroupByCode,
  upsertGroupLink
};


