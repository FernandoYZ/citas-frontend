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
