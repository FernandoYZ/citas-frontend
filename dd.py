import json
from faker import Faker
import random
from datetime import datetime, timedelta

class PatientDataGenerator:
    def __init__(self):
        self.fake = Faker('es')  # Using Peruvian Spanish locale for more relevant data
        self.specialties = [
            'TARGA', 'MEDICINA', 'CARDIOLOGÍA', 'GINECOLOGÍA', 
            'PEDIATRÍA', 'NEUROLOGÍA', 'ONCOLOGÍA', 'TRAUMATOLOGÍA'
        ]
        self.patient_types = ['RCRUZ', 'ADMIN' ]
        self.tipo_estado=['Separado', 'Vencido']
        self.type_classes = ['green', 'purple', 'blue', 'red']
        self.tipo_finan = ['ESTRATEGIA', 'Estrategia']

    def generate_patient(self, start_id):
        # Generate birth date
        birth_date = self.fake.date_of_birth(minimum_age=18, maximum_age=75)
        
        # Calculate age
        today = datetime.now()
        age = today.year - birth_date.year - ((today.month, today.day) < (birth_date.month, birth_date.day))
        
        # Generate admission date (within last 30 days)
        admission_date = self.fake.date_between(start_date='-20d', end_date='today')
        
        # Generate admission time
        admission_time = self.fake.time(pattern='%H:%M')
        
        # Determine exit time and status
        exit_status = random.choice(['En proceso', 'No asistió'] + 
                                     [f'{random.randint(10, 18):02d}:{random.randint(0, 59):02d}'])
        
        # Select specialty and corresponding patient type
        specialty = random.choice(self.specialties)
        patient_type = random.choice(self.patient_types)
        type_class = random.choice(self.type_classes)
        tipo_estado = random.choice(self.tipo_estado)
        tipo_finan = random.choice(self.tipo_finan)
        
        # Generate last attention date (can be same as admission or earlier)
        last_attention_date = self.fake.date_between(
            start_date=admission_date - timedelta(days=60), 
            end_date=admission_date
        )
        
        return {
            'NroDocumento': f'{random.randint(10000000, 99999999)}',
            'ApellidosPaciente': self.fake.last_name(),
            'NombresPaciente': self.fake.first_name(),
            'Servicio': specialty,
            'Especialidad': specialty,
            'Departamento': specialty,
            'NombreDoctor': self.fake.last_name(),
            'FechaCita': admission_date.strftime('%d/%m/%Y'),
            'HoraInicio': admission_time,
            'FechaSolicitud': admission_date.strftime('%d/%m/%Y'),
            'FuenteFinanciamiento': tipo_finan,
            'Usuario': patient_type,
            'Estado': tipo_estado,
        }

    def generate_patients(self, num_patients, start_id=1):
        return [self.generate_patient(start_id + i) for i in range(num_patients)]

def main():
    # Create generator
    generator = PatientDataGenerator()
    
    # Generate 3000 additional patient records
    additional_patients = generator.generate_patients(1000)
    
    # Save to JSON file
    with open('citas.json', 'w', encoding='utf-8') as f:
        json.dump(additional_patients, f, ensure_ascii=False, indent=2)
    
    print(f"Generated {len(additional_patients)} patient records.")
    print("Guardado to citas.json")

if __name__ == '__main__':
    main()



{
    "NroDocumento": "31028596",
    "ApellidosPaciente": "CARRION AVALOS",
    "NombresPaciente": "JESUSA",
    "Servicio": "PLANIFICACIÓN FAMILIAR ",
    "Especialidad": "PLANIFICACION FAMILIAR",
    "Departamento": "Servicios No Medicos",
    "NombreDoctor": "NELIDA GASPAR HUARI",
    "FechaCita": "2025-04-08",
    "HoraInicio": "11:15",
    "FechaSolicitud": "2025-04-08",
    "Usuario": "RCRUZ",
    "FuenteFinanciamiento": "ESTRATEGIA",
    "Estado": "Separada"
}

