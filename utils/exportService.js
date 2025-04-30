// utils/exportService.js
/**
 * Servicio para exportar datos en diferentes formatos
 */

/**
 * Exporta datos a formato CSV
 * @param {Array} data - Datos a exportar
 * @param {Array} columns - Configuración de columnas
 * @param {String} filename - Nombre del archivo
 */
export const exportToCSV = (data, columns, filename = "export") => {
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
    downloadBlob(blob, `${filename}.csv`);

    return true;
  } catch (error) {
    console.error("Error al exportar a CSV:", error);
    return false;
  }
};

/**
 * Exporta datos a formato Excel (XLSX)
 * @param {Array} data - Datos a exportar
 * @param {Array} columns - Configuración de columnas
 * @param {String} filename - Nombre del archivo
 * @param {String} sheetName - Nombre de la hoja
 */
// export const exportToExcel = async (
//   data,
//   columns,
//   filename = "export",
//   sheetName = "Datos"
// ) => {
//   try {
//     // Importar xlsx dinámicamente si está disponible en el entorno cliente
//     let XLSX;
//     try {
//       // En entorno cliente
//       if (import.meta.client) {
//         XLSX = await import("xlsx").then((module) => module.default);
//       } else {
//         throw new Error("Exportación a Excel solo disponible en el cliente");
//       }
//     } catch (e) {
//       console.error("No se pudo cargar la librería xlsx:", e);
//       alert("No se pudo exportar a Excel. La librería no está disponible.");
//       return false;
//     }

//     // Preparar datos para XLSX
//     const excelData = data.map((item) => {
//       const row = {};
//       columns.forEach((column) => {
//         let value = item[column.key];

//         // Si hay un formateador, aplicarlo
//         if (column.formatter && typeof column.formatter === "function") {
//           value = column.formatter(value, item);
//         }

//         row[column.label || column.key] = value;
//       });
//       return row;
//     });

//     // Crear libro y hoja
//     const workbook = XLSX.utils.book_new();
//     const worksheet = XLSX.utils.json_to_sheet(excelData);

//     // Añadir hoja al libro
//     XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

//     // Exportar
//     XLSX.writeFile(workbook, `${filename}.xlsx`);

//     return true;
//   } catch (error) {
//     console.error("Error al exportar a Excel:", error);
//     return false;
//   }
// };

/**
 * Exporta datos a formato PDF
 * @param {Array} data - Datos a exportar
 * @param {Array} columns - Configuración de columnas
 * @param {String} filename - Nombre del archivo
 * @param {Object} options - Opciones adicionales para PDF
 */
// export const exportToPDF = async (
//   data,
//   columns,
//   filename = "export",
//   options = {}
// ) => {
//   try {
//     // Importar jspdf y jspdf-autotable dinámicamente
//     let jsPDF, autoTable;
//     try {
//       if (import.meta.client) {
//         jsPDF = (await import("jspdf")).default;
//         autoTable = (await import("jspdf-autotable")).default;
//       } else {
//         throw new Error("Exportación a PDF solo disponible en el cliente");
//       }
//     } catch (e) {
//       console.error("No se pudieron cargar las librerías para PDF:", e);
//       alert("No se pudo exportar a PDF. Las librerías no están disponibles.");
//       return false;
//     }

//     // Configurar documento
//     const doc = new jsPDF({
//       orientation: options.orientation || "portrait",
//       unit: "mm",
//       format: options.format || "a4",
//     });

//     // Título del documento (opcional)
//     if (options.title) {
//       doc.setFontSize(18);
//       doc.text(options.title, 14, 22);
//       doc.setFontSize(11);
//       doc.setTextColor(100);
//     }

//     // Preparar datos para la tabla
//     const headers = columns.map((col) => col.label || col.key);
//     const rows = data.map((item) => {
//       return columns.map((column) => {
//         let value = item[column.key];

//         // Si hay un formateador, aplicarlo
//         if (column.formatter && typeof column.formatter === "function") {
//           value = column.formatter(value, item);
//         }

//         return value;
//       });
//     });

//     // Crear tabla
//     autoTable(doc, {
//       head: [headers],
//       body: rows,
//       startY: options.title ? 30 : 10,
//       styles: { fontSize: 10, cellPadding: 3 },
//       headStyles: { fillColor: [41, 128, 185], textColor: 255 },
//       alternateRowStyles: { fillColor: [245, 245, 245] },
//     });

//     // Guardar PDF
//     doc.save(`${filename}.pdf`);

//     return true;
//   } catch (error) {
//     console.error("Error al exportar a PDF:", error);
//     return false;
//   }
// };

/**
 * Función auxiliar para descargar un Blob
 * @param {Blob} blob - Objeto Blob para descargar
 * @param {String} filename - Nombre del archivo
 */
const downloadBlob = (blob, filename) => {
  if (typeof window === "undefined") return; // Check for client-side

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

/**
 * Función general para exportar datos en el formato especificado
 * @param {Array} data - Datos a exportar
 * @param {Array} columns - Configuración de columnas
 * @param {String} format - Formato (csv, excel, pdf)
 * @param {String} filename - Nombre base del archivo
 * @param {Object} options - Opciones adicionales
 */
export const exportData = async (
  data,
  columns,
  format,
  filename = "export",
  options = {}
) => {
  // Asegurar que tenemos datos y columnas
  if (!data || !columns || !Array.isArray(data) || !Array.isArray(columns)) {
    console.error("Datos o columnas no válidos para exportación");
    return false;
  }

  // Determinar formato y realizar la exportación
  switch (format.toLowerCase()) {
    case "csv":
      return exportToCSV(data, columns, filename);
    case "excel":
    case "xlsx":
      return exportToExcel(data, columns, filename, options.sheetName);
    case "pdf":
      return exportToPDF(data, columns, filename, options);
    default:
      console.error(`Formato de exportación no soportado: ${format}`);
      return false;
  }
};
