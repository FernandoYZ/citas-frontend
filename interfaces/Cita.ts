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
  Triaje?: any;
  Observaciones?: string;
  FechaAtencion?: string;
  [key: string]: any;
}

export interface Servicio {
  IdServicio: number;
  Nombre: string;
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
  paciente?: {
    idPaciente: number;
    tipoDocumento: string;
    nroDocumento: string;
    nombre: string;
    apellidos: string;
    fechaNacimiento: string;
    nroHistoriaClinica?: number;
  };
}