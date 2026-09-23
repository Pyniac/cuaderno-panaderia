// Persistencia en localStorage
const STORAGE_KEY = 'cuaderno_admin_estado';

const Storage = {
  guardar(estado) {
    try {
      // Convertir Sets a arrays antes de serializar (localStorage no serializa Sets)
      const estadoSerializable = {
        ...estado,
        cambios: {
          nuevas: Array.from(estado.cambios?.nuevas || []),
          modificadas: Array.from(estado.cambios?.modificadas || []),
          borradas: Array.from(estado.cambios?.borradas || [])
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(estadoSerializable));
      return true;
    } catch (e) {
      console.error('No se pudo guardar en localStorage:', e);
      return false;
    }
  },

  cargar() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('No se pudo leer localStorage:', e);
      return null;
    }
  },

  limpiar() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
