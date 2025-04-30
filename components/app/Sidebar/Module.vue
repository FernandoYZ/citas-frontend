<template>
  <div>
    <!-- Módulo con submódulos -->
    <div v-if="hasSubmodules" class="mb-2">
      <button
        :id="`${module.id}Toggle`"
        class="w-full flex items-center justify-between px-4 py-2.5 rounded-md transition-colors duration-150 relative"
        :class="{
          'decorador bg-blue-600 text-white hover:bg-blue-700': module.active,
          'text-slate-50/90 hover:bg-slate-700/50': !module.active,
        }"
        @click="toggleModule"
      >
        <div class="flex items-center">
          <div class="w-7 mr-3 flex justify-center items-center">
            <i
              class="fas"
              :class="[
                module.icon,
                {
                  'text-white': module.active,
                  'text-slate-400': !module.active,
                },
              ]"
            />
          </div>
          <span>{{ module.title }}</span>
        </div>
        <i
          :id="`${module.id}Chevron`"
          class="fas fa-chevron-down text-xs transition-transform duration-200"
          :style="{
            transform: module.expanded ? 'rotate(180deg)' : 'rotate(0)',
          }"
        />
      </button>
      <div
        :id="`${module.id}Submenu`"
        class="submenu pl-2 ml-1 border-l border-slate-700/40 mt-0.5 mb-1"
        :class="{ open: module.expanded }"
      >
        <AppSidebarSubmodule
          v-for="submodule in module.submodules"
          :key="submodule.id"
          :module-id="module.id"
          :submodule="submodule"
        />
      </div>
    </div>

    <!-- Módulo simple sin submódulos -->
    <NuxtLink
      v-else
      :to="module.route || '#'"
      class="flex items-center px-4 py-2.5 rounded-md transition-colors duration-150 mb-2"
      :class="{
        'decorador bg-blue-600 text-white hover:bg-blue-700': module.active,
        'text-slate-50/90 hover:bg-slate-700/50': !module.active,
      }"
      @click="navigate"
    >
      <div class="w-7 mr-3 flex justify-center items-center">
        <i
          class="fas"
          :class="[
            module.icon,
            { 'text-white': module.active, 'text-slate-400': !module.active },
          ]"
        />
      </div>
      <span>{{ module.title }}</span>
    </NuxtLink>
  </div>
</template>

<script setup>
import { useSidebarStore } from "~/stores/sidebar";
import { useRouter } from "vue-router";
import { computed } from "vue";

const props = defineProps({
  module: Object,
});

const sidebarStore = useSidebarStore();
const router = useRouter();

const hasSubmodules = computed(() => {
  return props.module.submodules && props.module.submodules.length > 0;
});

const toggleModule = () => {
  sidebarStore.toggleModule(props.module.id);
};

const navigate = (e) => {
  if (props.module.route) {
    sidebarStore.toggleModule(props.module.id);
  } else {
    e.preventDefault();
  }
};
</script>
