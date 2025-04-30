<template>
  <NuxtLink
    :to="submodule.route"
    class="flex items-center px-4 py-2.5 rounded-md text-sm transition-colors duration-150 mb-0.5"
    :class="{
      'decorador/15 bg-blue-600/15 text-white hover:bg-slate-700/30':
        submodule.active,
      'text-slate-200/85 hover:bg-slate-700/30': !submodule.active,
    }"
    @click="activateSubmodule"
  >
    <i class="fas text-xs mr-3 w-4 text-center" :class="submodule.icon" />
    <span>{{ submodule.title }}</span>  
  </NuxtLink>
</template>

<script setup>
import { useSidebarStore } from "~/stores/sidebar";
import { useRouter } from "vue-router";

const props = defineProps({
  moduleId: String,
  submodule: Object,
});

const sidebarStore = useSidebarStore();
const router = useRouter();

const activateSubmodule = () => {
  sidebarStore.setActiveSubmodule(props.moduleId, props.submodule.id);
};
</script>
