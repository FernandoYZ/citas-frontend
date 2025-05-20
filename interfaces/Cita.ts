export interface Cita {
  IdAtencion?: number;
  FechaCita?: string;
  HoraInicio?: string;
  HoraFin?: string;
  ApellidosPaciente?: string;
  NombresPaciente?: string;
  NroDocumento?: string;
  Especialidad?: string;
  Servicio?: string;
  NombreDoctor?: string;
  ApellidoDoctor?: string;
  Estado?: string;
  TriajeRegistrado?: boolean;
  Triaje?: unknown;
  Observaciones?: string;
  FechaAtencion?: string;
  [key: string]: unknown;
}

export interface Servicio {
  IdServicio: number;
  Nombre: string;
}

export interface MedicoResponse {
  IdMedico: number;
  Doctor: string;
}

export interface HorarioResponse {
  HoraInicioDisponible: string;
  HoraFinDisponible: string;
}

export interface Medico {
  idMedico: number;
  nombre: string;
}

export interface Horario {
  hora: string;
  horaFin: string;
}

export interface RegistroCitaRequest {
  NroDocumento: string;
  idServicio: number | string;
  idMedico: number | string;
  fechaIngreso: string;
  horaIngreso: string;
}

export interface PacienteResponse {
  success: boolean;
  message: string;
  existePaciente: boolean;
  tieneSHC: boolean;
  paciente?: Paciente;
}

export interface Paciente {
  idPaciente: number;
  tipoDocumento: string;
  nroDocumento: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  nroHistoriaClinica?: number;
}

// api/citas/citas-separadas
export interface CitaSeparada {
  IdPaciente: number;
  NroDocumento: string;
  IdAtencion: number;
  ApellidosPaciente: string;
  NombresPaciente: string;
  Edad: number;
  NroHistoriaClinica: number;
  Servicio: string;
  IdServicio: number;
  NombreDoctor: string;
  ApellidoDoctor: string;
  FechaCita: string;
  HoraInicio: string; 
  HoraFin: string;
  Estado: string;
  Triaje: string; 
}

// api/citas/cita/:idCita/:idPaciente
export interface DatosCitaResponse {
  idCita: string;
  idPaciente: string;
  datosPaciente: AntecedentesPaciente;
}

export interface AntecedentesPaciente {
  antecedentes: string | null;
  antecedAlergico: string | null;
  antecedObstetrico: string | null;
  antecedQuirurgico: string | null;
  antecedFamiliar: string | null;
  antecedPatologico: string | null;
}

// api/citas/servicios-fecha
export interface Servicio {
  IdServicio: number;
  Nombre: string;
}

// api/citas/horarios-select
export interface HorarioDisponible {
  HoraInicioDisponible: string;
  HoraFinDisponible: string;
}

// api/citas/verificar-triaje/:id
export interface VerificarTriajeResponse {
  success: boolean;
  tieneTriaje: boolean;
  data?: DatosTriaje;
}

export interface DatosTriaje {
  idAtencion: number;
  edad: string;
  presion: string;
  presionSistolica: string;
  presionDiastolica: string;
  talla: string;
  temperatura: string;
  peso: string;
  pulso: number;
  frecuenciaRespiratoria: number;
  frecuenciaCardiaca: number;
  saturacionOxigeno: number;
  perimetroAbdominal: number;
  perimetroEncefalico: number;
}

// api/citas/buscar-diagnosticos
export interface Diagnostico {
  IdDiagnostico: number;
  Diagnostico: string;
}


// api/citas/buscar-cpt
export interface CptItem {
  IdProducto: number;
  CodigoNombre: string;
  PrecioUnitario: number;
  Activo: boolean;
  idPuntoCarga: number;
  SeUsaSinPrecio: boolean;
}

// api/citas/clasificaciones-dx
export interface ClasificacionDiagnostico {
  IdSubclasificacionDx: number;
  Codigo: string;
  Descripcion: string;
  IdClasificacionDx: number;
  IdTipoServicio: number;
}

// api/citas/datos-consulta
export interface DatosConsultaResponse {
  success: boolean;
  consulta: Consulta;
  antecedentes: AntecedentesPaciente;
  diagnosticos: DiagnosticoConsulta[];
}

export interface Consulta {
  idAtencion: number;
  CitaMotivo: string;
  CitaExamenClinico: string;
  CitaTratamiento: string;
  CitaObservaciones: string | null;
  CitaAntecedente: string;
}

export interface DiagnosticoConsulta {
  IdAtencionDiagnostico: number;
  IdDiagnostico: number;
  IdSubclasificacionDx: number;
  IdClasificacionDx: number;
  labConfHIS: string;
  labConfHIS2: string;
  labConfHIS3: string;
  Codigo: string;
  Descripcion: string;
  TipoCodigo: string;
}

// api/citas/cpts/por-atencion
export interface CptsPorAtencionResponse {
  success: boolean;
  cpts: CptPorAtencion[];
}

export interface CptPorAtencion {
  IdProducto: number;
  idOrden: number;
  Cantidad: number;
  Precio: number;
  Total: number;
  idDiagnostico: number;
  Codigo: string;
  Nombre: string;
  PDR: string;
  labConfHIS: string;
  labConfHIS2: string;
  labConfHIS3: string;
  IdDiagnosticoAtenciones: number;
  CodigoDiagnostico: string;
  DescripcionDiagnostico: string;
}

