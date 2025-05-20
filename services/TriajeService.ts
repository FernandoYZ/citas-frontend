// services/TriajeService.ts
import { apiService } from "./ApiService";

interface TriajeData {
  idAtencion: number;
  paciente?: string;
  edad?: string;
  presionSistolica: string | null;
  presionDiastolica: string | null;
  talla?: string | null;
  temperatura: string | null;
  peso?: string | null;
  pulso?: number | null;
  frecuenciaRespiratoria?: string | null;
  frecuenciaCardiaca?: string | null;
  saturacionOxigeno?: string | null;
  perimetroAbdominal?: string | null;
  perimetroEncefalico?: string | null;
  editMode?: boolean;
}

interface ResumenTriaje {
  totalCitas: number;
  citasPendientes: number;
  citasAtendidas: number;
  triajesCompletados: number;
  triajesPendientes: number;
  triajesNoAplica: number;
}

class TriajeService {

  async verificarTriaje(idAtencion: number): Promise<{ tieneTriaje: boolean; data: TriajeData | null }> {
    const { data, error } = await apiService.get<{
      success: boolean;
      tieneTriaje: boolean;
      data: TriajeData | null;
    }>(`/api/citas/verificar-triaje/${idAtencion}`);

    if (error) {
      throw new Error(error);
    }

    if (!data || !data.success) {
      throw new Error("No se pudo verificar el estado del triaje");
    }

    return {
      tieneTriaje: data.tieneTriaje,
      data: data.data
    };
  }

  async registrarTriaje(triajeData: TriajeData): Promise<{ success: boolean; message: string }> {
    const { data, error } = await apiService.post<{ success: boolean; message: string }>(
      "/api/citas/triaje",
      triajeData
    );

    if (error) {
      throw new Error(error);
    }

    if (!data || !data.success) {
      throw new Error(data?.message || "Error al registrar el triaje");
    }

    return data;
  }
  
  async obtenerResumenTriaje(): Promise<ResumenTriaje> {
    const { data, error } = await apiService.get<{
      success: boolean;
      data: ResumenTriaje;
    }>("/api/citas/resumen-triaje");

    if (error) {
      throw new Error(error);
    }

    if (!data || !data.success) {
      throw new Error("No se pudo obtener el resumen del triaje");
    }

    return data.data;
  }

}

export const triajeService = new TriajeService();