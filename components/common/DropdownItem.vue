<!-- common/DropdownItem.vue -->
<template>
  <div
    data-dropdown-item
    :class="[
      'block px-4 py-2 text-sm',
      disabled
        ? 'text-gray-400 cursor-not-allowed'
        : 'text-gray-700 hover:bg-gray-100 cursor-pointer',
      iconLeft || iconRight ? 'flex items-center' : '',
    ]"
    @click="!disabled && $emit('click', $event)"
  >
    <i v-if="iconLeft" :class="['fas', iconLeft, 'mr-2 text-gray-500']"/>
    <slot>{{ label }}</slot>
    <i v-if="iconRight" :class="['fas', iconRight, 'ml-2 text-gray-500']"/>
  </div>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    default: "",
  },
  iconLeft: {
    type: String,
    default: "",
  },
  iconRight: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["click"]);
</script>
