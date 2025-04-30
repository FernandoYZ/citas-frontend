import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Patient, SearchCriteria } from '~/models/patient';

export const usePatientStore = defineStore('patients', () => {
  // Estado
  const patients = ref<Patient[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  // Datos de ejemplo (en un entorno real, estos datos vendrían de una API)
  const mockPatients: Patient[] = [
    {
      id: '1',
      firstName: 'FERNANDO CESAR',
      lastName: 'YOVERA ZAVALA',
      historyNumber: '62962727',
      birthDate: '2002-11-08',
      age: 22,
      gender: 'Masculino',
      bloodType: 'O+',
      admissionDate: '2025-03-31',
      entryTime: '09:15',
      exitTime: '10:42',
      lastService: 'TARGA - CE',
      lastServiceDate: '2025-03-31',
      especialidad: '',
      type: 'Nuevo',
      status: 'Activo'
    },
    {
      id: '2',
      firstName: 'MARIA ELENA',
      lastName: 'CARDENAS MONTES',
      historyNumber: '72514689',
      birthDate: '1995-04-15',
      age: 29,
      gender: 'Femenino',
      bloodType: 'A+',
      admissionDate: '2025-03-29',
      entryTime: '11:30',
      exitTime: '12:45',
      lastService: 'MEDICINA',
      lastServiceDate: '2025-03-29',
      triageStatus: 'Completado',
      type: 'Reingreso',
      status: 'Activo'
    },
    {
      id: '3',
      firstName: 'JUAN CARLOS',
      lastName: 'RAMIREZ TORRES',
      historyNumber: '56984231',
      birthDate: '1988-06-22',
      age: 36,
      gender: 'Masculino',
      bloodType: 'B+',
      admissionDate: '2025-03-28',
      entryTime: '14:05',
      exitTime: null,
      lastService: 'CARDIOLOGÍA',
      lastServiceDate: '2025-03-28',
      triageStatus: 'Pendiente',
      type: 'Continuador',
      status: 'Activo'
    },
    {
      id: '4',
      firstName: 'PATRICIA ANA',
      lastName: 'LOPEZ MORALES',
      historyNumber: '45123789',
      birthDate: '1980-02-14',
      age: 45,
      gender: 'Femenino',
      bloodType: 'AB-',
      admissionDate: '2025-03-28',
      entryTime: '15:20',
      exitTime: null,
      lastService: 'GINECOLOGÍA',
      lastServiceDate: '2025-02-12',
      triageStatus: 'No aplica',
      type: 'Ausente',
      status: 'Activo'
    }
  ];

  // Getters
  const totalPatients = computed(() => patients.value.length);
  
  const paginatedPatients = computed(() => {
    return (page: number, pageSize: number) => {
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      return patients.value.slice(start, end);
    };
  });

  // Acciones
  function fetchPatients() {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Simulación de llamada a API
      setTimeout(() => {
        patients.value = [...mockPatients];
        isLoading.value = false;
      }, 300);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error desconocido';
      isLoading.value = false;
    }
  }
  
  function searchPatients(criteria: SearchCriteria) {
    isLoading.value = true;
    error.value = null;
    
    try {
      // Simulación de búsqueda
      setTimeout(() => {
        let results = [...mockPatients];
        
        if (criteria.name) {
          const nameLower = criteria.name.toLowerCase();
          results = results.filter(
            p => p.firstName.toLowerCase().includes(nameLower) || 
                 p.lastName.toLowerCase().includes(nameLower)
          );
        }
        
        if (criteria.dni) {
          results = results.filter(p => p.historyNumber.includes(criteria.dni));
        }
        
        if (criteria.historia) {
          results = results.filter(p => p.historyNumber.includes(criteria.historia));
        }
        
        if (criteria.service) {
          results = results.filter(p => p.lastService.toLowerCase().includes(criteria.service.toLowerCase()));
        }
        
        patients.value = results;
        isLoading.value = false;
      }, 300);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Error desconocido';
      isLoading.value = false;
    }
  }
  
  function resetSearch() {
    fetchPatients();
  }
  
  function getPatientById(id: string): Patient | undefined {
    return patients.value.find(p => p.id === id);
  }

  // Inicializar datos al cargar el store
  if (import.meta.client) {
    fetchPatients();
  }

  return {
    // Estado
    patients,
    isLoading,
    error,
    
    // Getters
    totalPatients,
    paginatedPatients,
    
    // Acciones
    fetchPatients,
    searchPatients,
    resetSearch,
    getPatientById
  };
});