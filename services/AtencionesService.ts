// AtencionesService.ts
import { apiService } from "./ApiService";
import type { Diagnostico, ClasificacionDx, AtencionCE, ConsultaMedica } from "../interfaces/Atenciones";

class AtencionesService {
  // Obtener diagnósticos de una atención
  async getAtencionesDiagnosticos(IdAtencion: number) {
    const { data, error } = await apiService.get(
      `/api/citas/atender?IdAtencion=${IdAtencion}`
    );
    if (error) {
      throw new Error(error);
    }

    if (!Array.isArray(data)) {
      return [];
    }

    return data;
  }

  // Registrar un nuevo diagnóstico
  async registrarDiagnostico(diagnostico: Diagnostico) {
    const { data, error } = await apiService.post(
      "/api/citas/atenciones-diagnosticos-agregar",
      diagnostico
    );
    if (error) {
      throw new Error(error);
    }
    return data;
  }

  // Actualizar un diagnóstico existente
  async actualizarDiagnostico(diagnostico: Diagnostico) {
    const { data, error } = await apiService.put(
      "/api/citas/atenciones-diagnosticos-actualizar",
      diagnostico
    );
    if (error) {
      throw new Error(error);
    }
    return data;
  }

  // Eliminar un diagnóstico
  async eliminarDiagnostico(IdAtencionDiagnostico: number) {
    const { data, error } = await apiService.delete(
      `/api/citas/atenciones-diagnosticos-eliminar/${IdAtencionDiagnostico}`
    );
    if (error) throw new Error(error);
    return data;
  }

  // AtencionesService.ts - Método buscarDiagnosticos actualizado
  async buscarDiagnosticos(input = "", limit = 30) {
    try {
      // Sanitizar la entrada
      const searchTerm = input.trim();
  
      // Construir los parámetros de consulta
      const queryParams = [];
  
      if (searchTerm) {
        queryParams.push(`input=${encodeURIComponent(searchTerm)}`);
      }
  
      queryParams.push(`limit=${limit}`);
  
      const queryString = queryParams.join("&");
      // Actualiza la URL para que coincida con la nueva ruta del backend
      const url = `/api/citas/buscar-diagnosticos?${queryString}`;
  
      console.log(`Realizando consulta: ${url}`);
  
      const { data, error } = await apiService.get(url);
  
      if (error) {
        throw new Error(error);
      }
 
      return data;
    } catch (error) {
      console.error("Error al buscar diagnósticos:", error);
      return [];
    }
  }

  // Obtener clasificaciones de diagnósticos
  async getClasificacionesDx() {
    const { data, error } = await apiService.get(
      "/api/citas/clasificaciones-dx"
    );
    if (error) {
      throw new Error(error);
    }
    return data as ClasificacionDx[];
  }

  // Registrar consulta médica completa (método original)
  async registrarConsultaMedica(consulta: ConsultaMedica) {
    const { data, error } = await apiService.post(
      "/api/citas/consulta-medica",
      consulta
    );
    if (error) {
      throw new Error(error);
    }
    return data;
  }

  // Método mejorado para registrarAtencionCE en AtencionesService.ts
  async registrarAtencionCE(atencion: AtencionCE) {
    try {
      // Verificar que los campos obligatorios estén presentes
      if (!atencion.idAtencion) {
        console.error("Campo obligatorio faltante: idAtencion");
        return {
          success: false,
          message: "El campo idAtencion es obligatorio",
        };
      }

      if (!atencion.idPaciente) {
        console.error("Campo obligatorio faltante: idPaciente");
        return {
          success: false,
          message: "El campo idPaciente es obligatorio",
        };
      }

      // Asegurar que los IDs sean números (no strings)
      const datosProcesados = {
        ...atencion,
        idAtencion: Number(atencion.idAtencion),
        idPaciente: Number(atencion.idPaciente),
        idUsuario: Number(atencion.idUsuario || 3752),
      };

      console.log("Enviando datos a la API:", datosProcesados);

      const { data, error } = await apiService.post(
        "/api/citas/atencion-ce",
        datosProcesados
      );

      if (error) {
        console.error("Error al registrar atención CE:", error);
        throw new Error(error);
      }

      console.log("Respuesta recibida de la API:", data);

      return {
        success: true,
        message: "Atención registrada correctamente",
        ...(data && typeof data === 'object' ? data : {}),
      };
    } catch (error) {
      console.error("Error en registrarAtencionCE:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Error desconocido",
        error,
      };
    }
  }

  // Obtener datos de una consulta
  async getDatosConsulta(IdAtencion: number) {
    const { data, error } = await apiService.get(
      `/api/citas/datos-consulta?IdAtencion=${IdAtencion}`
    );
    if (error) {
      throw new Error(error);
    }
    return data;
  }
}

export const atencionesService = new AtencionesService();
