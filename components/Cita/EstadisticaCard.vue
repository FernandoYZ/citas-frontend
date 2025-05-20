<!-- components/Cita/EstadisticaCard.vue -->
<template>
  <div
    :class="[
      'bg-gradient-to-br rounded-lg border px-4 py-2 shadow-sm transition-all duration-300 cursor-pointer',
      isSelected ? 'ring-2 ring-offset-1' : 'hover:ring-2 hover:ring-offset-1',
      colorMap.bg,
      colorMap.border,
      isSelected ? colorMap.ringSelected : colorMap.ring,
    ]"
    role="button"
    :aria-label="label"
    :aria-pressed="isSelected.toString()"
    tabindex="0"
    @click="$emit('click', itemKey)"
    @keyup.enter="$emit('click', itemKey)"
  >
    <div class="flex items-center space-x-3">
      <div
        :class="[
          'h-10 w-10 flex items-center justify-center rounded-full text-white',
          colorMap.icon,
        ]"
      >
        <i :class="`fas ${icon}`" />
      </div>
      <div>
        <div class="text-xs text-gray-600 font-medium">{{ label }}</div>
        <div class="text-3xl font-extrabold leading-tight text-gray-800">
          {{ value.toLocaleString("es-PE") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  itemKey: { type: String, required: true },
  icon: { type: String, default: "" },
  label: { type: String, default: "" },
  value: { type: Number, default: 0 },
  color: { type: String, default: "" },
  loading: Boolean,
  isSelected: { type: Boolean, default: false },
});

defineEmits(["click"]);

const colorClasses = {
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-100",
    ring: "hover:ring-blue-200",
    ringSelected: "ring-blue-400",
    icon: "bg-blue-400",
  },
  amber: {
    bg: "bg-amber-50",
    border: "border-amber-100",
    ring: "hover:ring-amber-200",
    ringSelected: "ring-amber-400",
    icon: "bg-amber-400",
  },
  green: {
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    ring: "hover:ring-emerald-200",
    ringSelected: "ring-emerald-400",
    icon: "bg-emerald-400",
  },
  indigo: {
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    ring: "hover:ring-emerald-200",
    ringSelected: "ring-emerald-400",
    icon: "bg-emerald-400",
  },
  orange: {
    bg: "bg-yellow-50",
    border: "border-yellow-100",
    ring: "hover:ring-yellow-200",
    ringSelected: "ring-yellow-400",
    icon: "bg-yellow-400",
  },
  gray: {
    bg: "bg-slate-100",
    border: "border-slate-200",
    ring: "hover:ring-slate-300",
    ringSelected: "ring-slate-400",
    icon: "bg-slate-400",
  },
};

const colorMap = colorClasses[props.color] || colorClasses.blue;
</script>
