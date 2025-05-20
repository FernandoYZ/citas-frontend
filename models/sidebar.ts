// models/sidebar
import type { Section } from "~/interfaces/sidebar.interface";

export const sidebarData: Section[] = [
  {
    id: "main",
    title: "Módulos Principales",
    modules: [
      {
        id: "hospitalizacion",
        title: "Citas Estrategia",
        icon: "fa-clipboard-list",
        route: "/citas",
        expanded: false,
        active: false,
      },
    ],
  },
];
