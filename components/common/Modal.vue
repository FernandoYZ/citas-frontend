<!-- components/common/Modal -->
<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-10 overflow-y-auto"
      @click="closeOnBackdrop ? $emit('update:modelValue', false) : null"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">

        <!-- Backdrop con transición de opacidad solamente -->
        <Transition
          enter-active-class="transition-opacity ease-out duration-300"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition-opacity ease-in duration-200"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div v-if="modelValue" class="fixed inset-0 bg-black/60 z-0" aria-hidden="true" />
        </Transition>

        <!-- Modal con transición independiente -->
        <Transition
          enter-active-class="transition ease-out duration-200"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition ease-in duration-150"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-4"
        >
          <div
            v-if="modelValue"
            class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle z-40"
            :class="[fullWidth ? 'sm:w-full sm:max-w-5xl' : size, roundedSize]"
            @click.stop
          >
            <!-- Modal header -->
            <div 
              v-if="showHeader" 
              class="bg-blue-50 flex justify-between items-center px-5 py-3"
              :class="{ 'border-b border-gray-200': showHeaderBorder }"
            >
              <h3 class="text-lg font-semibold text-blue-600 flex items-center" :class="titleClass">
                <i v-if="icon" :class="`${iconPrefix} ${icon} mr-2`" />
                {{ title }}
              </h3>
              <button
                v-if="showCloseButton"
                aria-label="Close"
                class="text-gray-400 hover:text-gray-600 focus:outline-none"
                @click="close"
              >
                <i :class="`${iconPrefix} fa-times`"/>
              </button>
            </div>

            <!-- Modal content -->
            <div :class="contentClass">
              <slot />
            </div>

            <!-- Modal footer -->
            <div
              v-if="$slots.footer || primaryButton || secondaryButton"
              class="border-t border-gray-200 px-5 py-3 flex justify-between"
              :class="footerClass"
            >
              <slot name="footer">
                <button
                  v-if="secondaryButton"
                  type="button"
                  class="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50"
                  :class="secondaryButtonClass"
                  @click="$emit('secondary-click')"
                >
                  <i v-if="secondaryButtonIcon" :class="`${iconPrefix} ${secondaryButtonIcon} mr-1`" />
                  {{ secondaryButton }}
                </button>
                <button
                  v-if="primaryButton"
                  type="button"
                  class="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 flex items-center"
                  :class="primaryButtonClass"
                  @click="$emit('primary-click')"
                >
                  <i v-if="primaryButtonIcon" :class="`${iconPrefix} ${primaryButtonIcon} mr-1.5`" />
                  {{ primaryButton }}
                </button>
              </slot>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </Teleport>
</template>


<script setup>
import { onMounted, onBeforeUnmount, watch } from "vue";

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
    default: false
  },
  title: {
    type: String,
    default: ""
  },
  icon: {
    type: String,
    default: ""
  },
  iconPrefix: {
    type: String,
    default: "fas"
  },
  iconClass: {
    type: String,
    default: ""
  },
  titleClass: {
    type: String,
    default: ""
  },
  primaryButton: {
    type: String,
    default: ""
  },
  primaryButtonIcon: {
    type: String,
    default: ""
  },
  primaryButtonClass: {
    type: String,
    default: ""
  },
  secondaryButton: {
    type: String,
    default: ""
  },
  secondaryButtonIcon: {
    type: String,
    default: ""
  },
  secondaryButtonClass: {
    type: String,
    default: ""
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  showHeaderBorder: {
    type: Boolean,
    default: false
  },
  showCloseButton: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  closeOnEsc: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: "sm:max-w-3xl",
    validator: (value) =>
      [
        "sm:max-w-sm",
        "sm:max-w-md",
        "sm:max-w-lg",
        "sm:max-w-xl",
        "sm:max-w-2xl",
        "sm:max-w-3xl",
        "sm:max-w-4xl",
        "sm:max-w-5xl",
        "sm:max-w-6xl",
        "sm:max-w-7xl",
      ].includes(value)
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  contentClass: {
    type: String,
    default: "p-5"
  },
  footerClass: {
    type: String,
    default: ""
  },
  roundedSize: {
    type: String,
    default: "rounded-xl"
  },
  maxHeight: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits([
  "update:modelValue",
  "primary-click",
  "secondary-click",
  "close"
]);

// Función para cerrar el modal
const close = () => {
  emit("update:modelValue", false);
  emit("close");
};

// Cerrar con tecla Escape
const handleKeyDown = (e) => {
  if (e.key === "Escape" && props.closeOnEsc && props.modelValue) {
    close();
  }
};

// Guardar el valor de overflow original
let originalOverflow;

// Función para controlar el scroll
const toggleBodyScroll = (freeze) => {
  if (freeze) {
    // Guardar el valor actual y deshabilitar scroll
    originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  } else {
    // Restaurar el scroll
    document.body.style.overflow = originalOverflow || "";
  }
};

onMounted(() => {
  if (props.closeOnEsc) {
    document.addEventListener("keydown", handleKeyDown);
  }

  // Congelar scroll si el modal está abierto inicialmente
  if (props.modelValue) {
    toggleBodyScroll(true);
  }
});

onBeforeUnmount(() => {
  document.removeEventListener("keydown", handleKeyDown);

  // Asegurarse de restaurar el scroll al desmontar
  toggleBodyScroll(false);
});

// Observar cambios en la visibilidad del modal
watch(
  () => props.modelValue,
  (newValue) => {
    toggleBodyScroll(newValue);
  }
);
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap");

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease forwards;
}
</style>