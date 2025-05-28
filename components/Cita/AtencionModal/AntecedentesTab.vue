<template>
  <div class="p-4">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div
        v-for="(item, index) in antecedentesItems"
        :key="index"
        class="border border-gray-200 rounded-lg"
      >
        <div
          class="bg-gray-50 px-3 py-2 border-b border-gray-100 rounded-t-lg font-medium text-gray-700 text-sm flex items-center"
        >
          <i :class="item.icon + ' text-blue-500 mr-2'" />
          {{ item.label }}
        </div>
        <div class="p-3">
          <textarea
            v-model="localAntecedentes[item.model]"
            class="w-full h-20 px-3 py-2 rounded-lg focus:outline-none border border-gray-300 bg-white text-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            rows="2"
            :placeholder="item.placeholder"
            maxlength="1000"
            @input="updateAntecedentes"
          />
          <div class="flex justify-end text-[0.6rem] mt-1">
            <span :class="getCounterClass(localAntecedentes[item.model]?.length || 0)">
              {{ localAntecedentes[item.model]?.length || 0 }}/1000
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  antecedentes: {
    type: Object,
    default: () => ({
      quirurgico: "",
      patologico: "",
      obstetrico: "",
      alergico: "",
      familiar: "",
      otros: "",
    }),
  },
});

const emit = defineEmits(["update:antecedentes"]);

const localAntecedentes = ref({ ...props.antecedentes });

watch(
  () => props.antecedentes,
  (newVal) => {
    localAntecedentes.value = { ...newVal };
  }
);

const antecedentesItems = [
  {
    label: "Quirúrgicos",
    model: "quirurgico",
    icon: "fas fa-user-md",
    placeholder: "Antecedentes quirúrgicos",
  },
  {
    label: "Patológicos",
    model: "patologico",
    icon: "fas fa-heartbeat",
    placeholder: "Antecedentes patológicos",
  },
  {
    label: "Obstétricos",
    model: "obstetrico",
    icon: "fas fa-baby",
    placeholder: "Antecedentes obstétricos",
  },
  {
    label: "Alergias",
    model: "alergico",
    icon: "fas fa-allergies",
    placeholder: "Alergias conocidas",
  },
  {
    label: "Familiares",
    model: "familiar",
    icon: "fas fa-users",
    placeholder: "Antecedentes familiares",
  },
  {
    label: "Otros",
    model: "otros",
    icon: "fas fa-notes-medical",
    placeholder: "Otros antecedentes relevantes",
  },
];

const getCounterClass = (length) => {
  if (length > 900) {
    return 'text-red-500 font-medium';
  } else if (length > 750) {
    return 'text-amber-500';
  } else {
    return 'text-gray-500';
  }
};

const updateAntecedentes = () => {
  emit("update:antecedentes", { ...localAntecedentes.value });
};
</script>
