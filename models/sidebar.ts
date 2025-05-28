import type { Section } from "~/interfaces/sidebar.interface"

export const sidebarData: Section[] = [
    {
      id: "main",
      title: "Módulos Principales",
      modules: [
        {
          id: "consulta",
          title: "Consulta Externa",
          icon: "fa-hospital-user",
          route: null,
          expanded: true,
          active: false,
          submodules: [
            {
              id: "paciente",
              title: "Pacientes",
              icon: "fa-user-alt",
              route: "/consulta/pacientes",
              active: false,
            },
            {
              id: "citas",
              title: "Citas y Admisión",
              icon: "fa-clipboard-list",
              route: "/consulta/citas",
              active: false,
            },
            {
              id: "triaje",
              title: "Registro de Triaje",
              icon: "fa-id-card",
              route: "/consulta/triaje",
              active: false,
            },
            {
              id: "atenciones",
              title: "Registro de Atenciones",
              icon: "fa-notes-medical",
              route: "/consulta/atenciones",
              active: false,
            },
          ],
        },
        {
          id: "cita-estrategia",
          title: "Cita Estratégica",
          icon: "fa-clipboard-list",
          route: "/citas",
          expanded: false,
          active: true,
        },
      ],
    },
    {
      id: "admin",
      title: "Administración",
      modules: [
        {
          id: "programacion",
          title: "Programación",
          icon: "fa-calendar-alt",
          route: "/programacion",
          expanded: false,
          active: false,
        },
        {
          id: "mas-modulos",
          title: "Más Módulos",
          icon: "fa-ellipsis-h",
          route: null,
          expanded: false,
          active: false,
          submodules: [
            {
              id: "caja",
              title: "Caja",
              icon: "fa-cash-register",
              route: "/caja",
              active: false,
            },
            {
              id: "farmacia",
              title: "Farmacia",
              icon: "fa-prescription-bottle-alt",
              route: "/farmacia",
              active: false,
            },
            {
              id: "facturacion",
              title: "Facturación",
              icon: "fa-file-invoice-dollar",
              route: "/facturacion",
              active: false,
            },
            {
              id: "configuracion",
              title: "Configuración",
              icon: "fa-cogs",
              route: "/configuracion",
              active: false,
            },
          ],
        },
      ],
    },
  ];