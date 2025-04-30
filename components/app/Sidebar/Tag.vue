<!-- AppSidebarTag -->
<template>
  <div
    class="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-slate-400 mb-2"
    :class="{ 'border-t border-slate-700/50 pt-4': withBorder }"
  >
    {{ tag }}
  </div>
</template>

<script setup>
defineProps({
  tag: {
    type: String,
    required: true,
  },
  withBorder: {
    type: Boolean,
    default: false,
  },
});
</script>
