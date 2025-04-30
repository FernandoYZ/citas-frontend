<template>
    <div class="fixed z-50 bottom-0 right-0 p-4 flex flex-col space-y-2">
      <transition-group name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden flex"
          :class="[getToastBorderClass(toast.type)]"
        >
          <div 
            class="flex items-center justify-center w-12"
            :class="[getToastIconBgClass(toast.type)]"
          >
            <i :class="['fas', getToastIcon(toast.type), 'text-white']"></i>
          </div>
          <div class="flex-1 p-4">
            <div class="flex justify-between items-start">
              <p class="text-sm font-medium text-gray-900">{{ toast.message }}</p>
              <button
                v-if="toast.closable"
                @click="close(toast.id)"
                class="ml-4 text-gray-400 hover:text-gray-600"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </template>
  
  <script setup>
  import { useToast } from '~/composables/useToast';
  
  // Obtener el estado y métodos del sistema de notificaciones
  const { toasts, close } = useToast();
  
  // Funciones para estilos dinámicos
  const getToastIcon = (type) => {
    const icons = {
      success: 'fa-check',
      error: 'fa-exclamation-circle',
      warning: 'fa-exclamation-triangle',
      info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
  };
  
  const getToastIconBgClass = (type) => {
    const classes = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };
    return classes[type] || classes.info;
  };
  
  const getToastBorderClass = (type) => {
    const classes = {
      success: 'border-l-4 border-green-500',
      error: 'border-l-4 border-red-500',
      warning: 'border-l-4 border-yellow-500',
      info: 'border-l-4 border-blue-500'
    };
    return classes[type] || classes.info;
  };
  </script>
  
  <style scoped>
  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.3s ease;
  }
  .toast-enter-from {
    opacity: 0;
    transform: translateY(30px);
  }
  .toast-leave-to {
    opacity: 0;
    transform: translateX(100%);
  }
  </style>