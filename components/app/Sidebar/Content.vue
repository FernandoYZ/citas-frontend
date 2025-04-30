<template>
  <div class="overflow-y-auto h-full pb-16 px-2">
    <div
      v-for="section in sidebarStore.sections"
      :key="section.id"
      class="mb-6"
    >
      <AppSidebarTag :tag="section.title" :with-border="section.id !== 'main'" />
      <div v-for="module in section.modules" :key="module.id">
        <AppSidebarModule :module="module" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSidebarStore } from "~/stores/sidebar";

const sidebarStore = useSidebarStore();
</script>
