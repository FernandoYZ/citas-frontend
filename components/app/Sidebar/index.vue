<template>
  <aside
    class="w-64 bg-gradient-to-b from-slate-800 to-slate-900 fixed inset-y-0 left-0 z-20 shadow-lg border-r border-slate-700/20 transition-all duration-300 ease-in-out"
    :class="{
      'translate-x-0': sidebarStore.mobileOpen,
      '-translate-x-full lg:translate-x-0': !sidebarStore.mobileOpen,
    }"
  >
    <AppSidebarHeader />
    <AppSidebarContent />
    <AppSidebarFooter />
  </aside>
  <div
    v-if="sidebarStore.mobileOpen"
    class="lg:hidden fixed inset-0 bg-black/20 bg-opacity-50 z-10"
    @click="sidebarStore.closeMobileSidebar"
  />
</template>

<script setup>
import { useSidebarStore } from "~/stores/sidebar";

const sidebarStore = useSidebarStore();
</script>
