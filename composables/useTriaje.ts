// composables/useTriaje.ts
import { ref, reactive } from 'vue';
import { triajeService } from '~/services/TriajeService';

export function useTriaje() {
  // Estados
  const isLoading = ref(false);
  const error = ref('');
  
  // Datos de la cuenta/atención
  const datosCuenta = reactive({
    idAtencion: 0,
    paciente: '',
    edad: '',
    servicio: ''
  });
  
  // Formulario de triaje
  const formData = reactive({
    pulso: '',
    frecuenciaRespiratoria: '',
    frecuenciaCardiaca: '',
    temperatura: '',
    presionSistolica: '',
    presionDiastolica: '',
    saturacionOxigeno: '',
    peso: '',
    talla: '',
    perimetroAbdominal: ''
  });
  
  const toast = useToast();
  
  // Cargar datos de la cuenta por ID de atención
  const cargarDatosCuenta = async (idAtencion: number) => {
    if (!idAtencion) {
      error.value = 'El ID de atención es requerido';
      return false;
    }
    
    isLoading.value = true;
    error.value = '';
    
    try {
      const data = await triajeService.obtenerDatosCuenta(idAtencion);
      
      // Actualizar datos reactivos
      Object.assign(datosCuenta, data);
      
      // Si hay edad en los datos, actualizar en el formulario
      if (data.edad) {
        formData.edad = data.edad;
      }
      
      return true;
    } catch (err) {
      console.error('Error al cargar datos de cuenta:', err);
      error.value = err instanceof Error ? err.message : 'Error al cargar datos';
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Validar formulario
  const validarFormulario = () => {
    // Campos obligatorios
    const camposObligatorios = ['temperatura', 'presionSistolica', 'presionDiastolica'];
    
    for (const campo of camposObligatorios) {
      if (!formData[campo]) {
        error.value = `El campo ${obtenerNombreCampo(campo)} es obligatorio`;
        toast.error(error.value);
        return false;
      }
    }
    
    return true;
  };
  
  // Registrar triaje
  const registrarTriaje = async () => {
    if (!validarFormulario()) {
      return false;
    }
    
    if (!datosCuenta.idAtencion) {
      error.value = 'No se ha cargado un paciente válido';
      toast.error(error.value);
      return false;
    }
    
    isLoading.value = true;
    error.value = '';
    
    try {
      const resultado = await triajeService.registrarTriaje({
        idAtencion: datosCuenta.idAtencion,
        paciente: datosCuenta.paciente,
        edad: formData.edad || datosCuenta.edad,
        presionSistolica: formData.presionSistolica,
        presionDiastolica: formData.presionDiastolica,
        talla: formData.talla,
        temperatura: formData.temperatura,
        peso: formData.peso,
        pulso: formData.pulso,
        frecuenciaRespiratoria: formData.frecuenciaRespiratoria,
        frecuenciaCardiaca: formData.frecuenciaCardiaca,
        saturacionOxigeno: formData.saturacionOxigeno,
        perimetroAbdominal: formData.perimetroAbdominal
      });
      
      if (resultado.success) {
        toast.success(resultado.message);
        resetearFormulario();
        return true;
      } else {
        throw new Error(resultado.message || 'Error al registrar el triaje');
      }
    } catch (err) {
      console.error('Error al registrar triaje:', err);
      error.value = err instanceof Error ? err.message : 'Error al registrar triaje';
      toast.error(error.value);
      return false;
    } finally {
      isLoading.value = false;
    }
  };
  
  // Resetear formulario
  const resetearFormulario = () => {
    Object.keys(formData).forEach(key => {
      formData[key] = '';
    });
  };
  
  // Obtener nombre legible del campo
  const obtenerNombreCampo = (campo: string): string => {
    const nombres: Record<string, string> = {
      pulso: 'Pulso',
      frecuenciaRespiratoria: 'Frecuencia Respiratoria',
      frecuenciaCardiaca: 'Frecuencia Cardíaca',
      temperatura: 'Temperatura',
      presionSistolica: 'Presión Arterial (Sistólica)',
      presionDiastolica: 'Presión Arterial (Diastólica)',
      saturacionOxigeno: 'Saturación de Oxígeno',
      peso: 'Peso',
      talla: 'Talla',
      perimetroAbdominal: 'Perímetro Abdominal',
    };
    
    return nombres[campo] || campo;
  };
  
  return {
    isLoading,
    error,
    datosCuenta,
    formData,
    cargarDatosCuenta,
    registrarTriaje,
    resetearFormulario,
    validarFormulario,
    obtenerNombreCampo
  };
}