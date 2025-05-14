// services/CPTService.ts
import { apiService } from "./ApiService";

interface CPT {
  idProducto: number;
  cantidad: number;
  idDiagnostico: number;
  codigo?: string;
  nombre?: string;
  precio?: number;
  total?: number;
  idOrden?: number;
  PDR?: string;
  labConfHIS?: string;
  labConfHIS2?: string;
  labConfHIS3?: string;
}
interface CPTResponse {
  IdProducto: number;
  CodigoNombre: string;
  Codigo: string;
  Nombre: string;
  PrecioUnitario: number;
  Activo: number;
  SeUsaSinPrecio: boolean;
}

class CPTService {
  async buscarCPT(input: string, idServicio: number, idTipoFinanciamiento = 16, limit = 30): Promise<CPTResponse[]> {
    try {
      const queryParams = [];
      
      if (input.trim()) {
        queryParams.push(`input=${encodeURIComponent(input.trim())}`);
      }
      
      queryParams.push(`IdServicio=${idServicio}`);
      queryParams.push(`idTipoFinanciamiento=${idTipoFinanciamiento}`);
      queryParams.push(`limit=${limit}`);
      
      const queryString = queryParams.join("&");
      const url = `/api/citas/buscar-cpt?${queryString}`;
      
      console.log(`Buscando CPTs: ${url}`);
      
      const { data, error } = await apiService.get(url);
      
      if (error) {
        throw new Error(error);
      }
      
      // Transformar datos si es necesario
      return data.map((item: any) => ({
        IdProducto: item.IdProducto,
        CodigoNombre: item.CodigoNombre,
        Codigo: item.CodigoNombre.split(' - ')[0].trim(),
        Nombre: item.CodigoNombre.split(' - ')[1]?.trim() || '',
        PrecioUnitario: item.PrecioUnitario,
        Activo: item.Activo,
        SeUsaSinPrecio: item.SeUsaSinPrecio
      }));
    } catch (error) {
      console.error("Error al buscar CPTs:", error);
      return [];
    }
  }
  
  // Actualiza el método para registrar CPTs
  async registrarCPTsPostAtencion(idAtencion: number, idCuentaAtencion: number, cpts: CPT[]) {
    try {
      // Log para depuración
      console.log("Datos enviados al endpoint:", {
        idAtencion,
        idCuentaAtencion,
        cpts
      });
      
      const { data, error } = await apiService.post('/api/citas/cpts/post-atencion', {
        idAtencion,
        idCuentaAtencion,
        cpts,
        // Incluir estos valores también a nivel global (por si acaso)
        PDR: "D", 
        labConfHIS: "",
        labConfHIS2: "",
        labConfHIS3: ""
      });
      
      if (error) {
        throw new Error(error);
      }
      
      return data;
    } catch (error) {
      console.error("Error al registrar CPTs:", error);
      throw error;
    }
  }

  // Obtener CPTs por atención
  async obtenerCPTsPorAtencion(idAtencion: number): Promise<CPT[]> {
    try {
      const { data, error } = await apiService.get(
        `/api/citas/cpts/por-atencion?idAtencion=${idAtencion}`
      );
      
      if (error) {
        throw new Error(error);
      }
      
      return data.cpts || [];
    } catch (error) {
      console.error("Error al obtener CPTs por atención:", error);
      return [];
    }
  }

  // Eliminar CPT
  async eliminarCPT(idOrden: number, idProducto: number) {
    try {
      const { data, error } = await apiService.delete(
        `/api/citas/cpts/${idOrden}/${idProducto}`
      );
      
      if (error) {
        throw new Error(error);
      }
      
      return data;
    } catch (error) {
      console.error("Error al eliminar CPT:", error);
      throw error;
    }
  }
}

export const cptService = new CPTService();