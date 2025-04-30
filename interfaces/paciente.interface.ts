export interface Paciente {
    id: number;
    apellidos: string;
    nombres: string;
    dni: string;
    historia: string;
    edad: number;
    fechaNacimiento: string;
    fechaIngreso: string;
    horaIngreso: string;
    horaSalida: string;
    ultimaAtencion: string;
    fechaUltimaAtencion: string;
    especialidad: string;
    tipo: "Nuevo" | "Reingreso" | "Continuador" | "Ausente";
    tipoClase: string;
  }