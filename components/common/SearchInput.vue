<!-- common/SearInput -->
<template>
  <div class="relative">
    <div
      class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
    >
      <i class="fas fa-search text-gray-400 text-sm"/>
    </div>
    <input
      :type="type"
      :value="modelValue"
      class="pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 w-full"
      :placeholder="placeholder"
      :disabled="disabled"
      :class="{ 'bg-gray-100': disabled }"
      @input="$emit('update:modelValue', $event.target.value)"
    >
    <div
      v-if="modelValue"
      class="absolute inset-y-0 right-0 pr-3 flex items-center"
    >
      <button
        type="button"
        class="text-gray-400 hover:text-gray-600"
        @click="clearInput"
      >
        <i class="fas fa-times"/>
      </button>
    </div>
  </div>
</template>

<script setup>
props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "Buscar...",
  },
  type: {
    type: String,
    default: "text",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "clear"]);

const clearInput = () => {
  emit("update:modelValue", "");
  emit("clear");
};
</script>
