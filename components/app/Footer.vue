<template>
  <footer
    class="bg-white py-2 px-4 border-t border-gray-200 text-xs text-gray-500"
  >
    <div class="flex flex-wrap justify-between items-center gap-2">
      <div>HOSPITAL REGIONAL DE CAÑETE-REZOLA</div>
      <div class="flex items-center">
        <div
          class="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full mr-2"
        >
          SIS-GalenPLUS: v.6.3.0
        </div>
        <span>© {{ currentYear }} MINSA</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear();
</script>
