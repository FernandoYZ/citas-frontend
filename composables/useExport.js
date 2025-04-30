// composables/useExport.js
import { ref } from 'vue';

/**
 * Composable para gestionar la exportación de datos a diferentes formatos
 */
export function useExport() {
  const isExporting = ref(false);
  const exportError = ref(null);

  /**
   * Exporta datos a formato CSV
   * @param {Array} data - Datos a exportar
   * @param {Array} columns - Configuración de columnas
   * @param {String} filename - Nombre del archivo
   * @returns {Promise<boolean>} - Resultado de la operación
   */
  const exportToCSV = async (data, columns, filename = "export.csv") => {
    isExporting.value = true;
    exportError.value = null;
    
    try {
      // Crear encabezados
      const headers = columns.map((col) => col.label || col.key);

      // Preparar filas
      const rows = data.map((item) => {
        return columns
          .map((column) => {
            // Obtener el valor de cada celda basado en la clave de la columna
            let value = item[column.key];

            // Si hay un formateador, aplicarlo
            if (column.formatter && typeof column.formatter === "function") {
              value = column.formatter(value, item);
            }

            // Convertir a string y escapar comillas dobles
            return `"${String(value || "").replace(/"/g, '""')}"`;
          })
          .join(",");
      });

      // Unir encabezados y filas
      const csv = [headers.join(","), ...rows].join("\n");

      // Crear blob y descargar
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      downloadBlob(blob, filename);

      isExporting.value = false;
      return true;
    } catch (error) {
      console.error("Error al exportar a CSV:", error);
      exportError.value = error;
      isExporting.value = false;
      return false;
    }
  };

  /**
   * Exporta datos según el formato especificado
   * @param {Object} options - Opciones de exportación
   * @returns {Promise<boolean>} - Resultado de la operación
   */
  const exportData = async ({ data, columns, format, fileName = "export", options = {} }) => {
    // Validar datos
    if (!data || !columns || !Array.isArray(data) || !Array.isArray(columns)) {
      exportError.value = new Error("Datos o columnas no válidos para exportación");
      return false;
    }

    // Normalizar nombre de archivo
    let finalFileName = fileName
      .toLowerCase()
      .replace(/[^\w\s]/gi, '') // Eliminar caracteres especiales
      .replace(/\s+/g, '_'); // Reemplazar espacios con guiones bajos
    
    // Asegurar que tiene extensión
    if (!finalFileName.includes('.')) {
      finalFileName += `.${format.toLowerCase()}`;
    }

    // Por ahora, solo soportamos CSV nativo
    switch (format.toLowerCase()) {
      case "csv":
        return await exportToCSV(data, columns, finalFileName);
      case "excel":
        // Implementación de Excel sería aquí con una librería externa
        console.log("Exportación a Excel no implementada de forma nativa");
        return false;
      case "pdf":
        // Implementación de PDF sería aquí con una librería externa
        console.log("Exportación a PDF no implementada de forma nativa");
        return false;
      default:
        exportError.value = new Error(`Formato de exportación no soportado: ${format}`);
        return false;
    }
  };

  /**
   * Función auxiliar para descargar un Blob
   * @param {Blob} blob - Objeto Blob para descargar
   * @param {String} filename - Nombre del archivo
   */
  const downloadBlob = (blob, filename) => {
    if (typeof window === "undefined") return;

    // Crear URL para el blob
    const url = window.URL.createObjectURL(blob);

    // Crear elemento de enlace
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = filename;

    // Añadir a documento, simular clic y limpiar
    document.body.appendChild(a);
    a.click();

    // Limpiar
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return {
    isExporting,
    exportError,
    exportToCSV,
    exportData,
  };
}