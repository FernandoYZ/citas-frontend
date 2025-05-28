// FarmaciaService.ts
import { apiService } from "./ApiService";

export interface Medicamento {
  IdProducto: number;
  Codigo: string;
  Nombre: string;
  CodigoNombre: string;
  Precio: number;
}

export interface RecetaDetalle {
  idProducto: number;
  cantidadPedida: number;
  observaciones?: string;
  idDosisRecetadas?: number;
  idViaAdministracion?: number;
  idDiagnostico: number;
}

export interface RecetaCompleta {
  idProducto: number;
  codigo: string;
  nombre: string;
  searchTerm: string;
  cantidadPedida: number;
  precio: number;
  total: number;
  saldoEnRegistro?: number;
  idDiagnostico: number;
  idDosisRecetadas: number;
  idViaAdministracion: number;
  observaciones?: string;
  idReceta?: number;
}

class FarmaciaService {
  // Buscar medicamentos
  async buscarMedicamentos(input = "", limit = 30): Promise<Medicamento[]> {
    try {
      const searchTerm = input.trim();
      const queryParams = [];

      if (searchTerm) {
        queryParams.push(`input=${encodeURIComponent(searchTerm)}`);
      }

      queryParams.push(`limit=${limit}`);

      const queryString = queryParams.join("&");
      const url = `/api/citas/buscar-medicamentos?${queryString}`;

      console.log(`Realizando consulta de medicamentos: ${url}`);

      const { data, error } = await apiService.get(url);

      if (error) {
        throw new Error(error);
      }

      return data;
    } catch (error) {
      console.error("Error al buscar medicamentos:", error);
      return [];
    }
  }

  // Registrar recetas después de la atención
  async registrarRecetasPostAtencion(
    idAtencion: number,
    idCuentaAtencion: number,
    recetas: RecetaDetalle[]
  ) {
    try {
      const datosRecetas = {
        idAtencion,
        idCuentaAtencion,
        recetas: recetas.map((receta) => ({
          idProducto: receta.idProducto,
          cantidadPedida: receta.cantidadPedida || 1,
          observaciones: receta.observaciones || "",
          idDosisRecetadas: receta.idDosisRecetadas || 1,
          idViaAdministracion: receta.idViaAdministracion || null, // Permitir NULL
          idDiagnostico: receta.idDiagnostico,
        })),
      };

      console.log("Enviando recetas al servidor:", datosRecetas);

      const { data, error } = await apiService.post(
        "/api/citas/recetas/post-atencion",
        datosRecetas
      );

      if (error) {
        throw new Error(error);
      }

      console.log("Respuesta del servidor:", data);
      return data;
    } catch (error) {
      console.error("Error al registrar recetas:", error);
      throw error;
    }
  }

  // Actualizar recetas después de la atención
  async actualizarRecetasPostAtencion(
    idAtencion: number,
    idReceta: number,
    recetas: RecetaDetalle[]
  ) {
    try {
      const datosRecetas = {
        idAtencion,
        idReceta,
        recetas: recetas.map((receta) => ({
          idProducto: receta.idProducto,
          cantidadPedida: receta.cantidadPedida || 1,
          observaciones: receta.observaciones || "",
          idDosisRecetadas: receta.idDosisRecetadas || 1,
          idViaAdministracion: receta.idViaAdministracion || null, // Permitir NULL
          idDiagnostico: receta.idDiagnostico,
        })),
      };

      console.log("Actualizando recetas en el servidor:", datosRecetas);

      const { data, error } = await apiService.put(
        "/api/citas/recetas/post-atencion",
        datosRecetas
      );

      if (error) {
        throw new Error(error);
      }

      console.log("Respuesta del servidor:", data);
      return data;
    } catch (error) {
      console.error("Error al actualizar recetas:", error);
      throw error;
    }
  }

  // Obtener recetas por atención
  async obtenerRecetasPorAtencion(idAtencion: number): Promise<RecetaCompleta[]> {
    try {
      const { data, error } = await apiService.get(
        `/api/citas/recetas/por-atencion?idAtencion=${idAtencion}`
      );

      if (error) {
        throw new Error(error);
      }

      if (!data.success) {
        throw new Error(data.message || "Error al obtener recetas");
      }

      return data.recetas || [];
    } catch (error) {
      console.error("Error al obtener recetas:", error);
      return [];
    }
  }

  // Eliminar medicamento de receta
  async eliminarMedicamento(idReceta: number, idProducto: number) {
    try {
      const { data, error } = await apiService.delete(
        `/api/citas/recetas/${idReceta}/${idProducto}`
      );

      if (error) {
        throw new Error(error);
      }

      return data;
    } catch (error) {
      console.error("Error al eliminar medicamento:", error);
      throw error;
    }
  }
}

export const farmaciaService = new FarmaciaService();