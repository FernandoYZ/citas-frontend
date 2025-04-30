// AtencionesService.ts - Versión actualizada
import { apiService } from "./ApiService";

export interface Diagnostico {
  IdAtencionDiagnostico?: number;
  IdDiagnostico: number;
  IdSubclasificacionDx: number;
  IdClasificacionDx: number;
  IdAtencion?: number;
  labConfHIS?: string | null;
  labConfHIS2?: string | null;
  labConfHIS3?: string | null;
  Codigo?: string;
  Descripcion?: string;
  TipoCodigo?: string;
}

export interface ConsultaMedica {
  idAtencion: number;
  idPaciente?: number;
  nroHistoriaClinica?: number;
  citaMedico?: string;
  citaIdServicio?: number;
  citaServicio?: string;
  motivoConsulta?: string;
  examenClinico?: string;
  diagnosticos?: Diagnostico[];
  tratamiento?: string;
  observaciones?: string;
  antecedentes?: string;
  idUsuario?: number;
}

// Interfaz específica para el endpoint atencion-ce
export interface AtencionCE {
  idAtencion: number;
  idPaciente: number;
  idUsuario?: number;

  // Campos para la atención médica
  motivoConsulta?: string;
  examenClinico?: string;
  tratamiento?: string;
  observaciones?: string;

  // Antecedentes
  antecedentes?: string;
  antecedQuirurgico?: string;
  antecedPatologico?: string;
  antecedObstetrico?: string;
  antecedAlergico?: string;
  antecedFamiliar?: string;

  // Diagnósticos
  diagnosticos?: Array<{
    IdDiagnostico: number;
    IdAtencionDiagnostico?: number;
    IdSubclasificacionDx: number;
    IdClasificacionDx: number;
    labConfHIS?: string | null;
    labConfHIS2?: string | null;
    labConfHIS3?: string | null;
  }>;

  // Campos adicionales opcionales
  fechaEgreso?: string;
  horaEgreso?: string;
  idDestinoAtencion?: number;
  idCondicionMaterna?: number;
  idTipoCondicionALEstab?: number;
}

export interface LabValor {
  valor: string;
  indice?: number;
}

export interface ClasificacionDx {
  IdSubclasificacionDx: number;
  Codigo: string;
  Descripcion: string;
  IdClasificacionDx: number;
  IdTipoServicio: number;
}

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

  // Buscar diagnósticos por código o descripción
  async buscarDiagnosticos(codigo = "", descripcion = "", limit = 30) {
    try {
      // Construir la URL adecuadamente para evitar el símbolo & al final
      const queryParams = [];

      if (codigo) {
        queryParams.push(`codigo=${encodeURIComponent(codigo.trim())}`);
      }

      if (descripcion) {
        queryParams.push(
          `descripcion=${encodeURIComponent(descripcion.trim())}`
        );
      }

      queryParams.push(`limit=${limit}`);

      const queryString = queryParams.join("&");
      const url = `/api/citas/buscar-diagnosticos?${queryString}`;

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
        ...data,
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
