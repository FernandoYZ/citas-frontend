<template>
  <div
    class="absolute bottom-0 w-full bg-slate-900 text-slate-50/50 py-3 px-4 border-t border-slate-700"
  >
    <button
      class="w-full flex items-center gap-3 bg-slate-800/10 text-center px-4 py-2.5 rounded-lg transition-all duration-300 ease-in-out
             hover:bg-red-600/20 hover:text-red-400/70 
             active:ring-2 active:ring-red-500 active:border-red-500
             focus:outline-none focus:ring-2 focus:ring-red-400/70 focus:border-red-400/50
             border border-transparent cursor-pointer group"
      @click="handleLogout"
    >
      <i class="fas fa-sign-out-alt" />
      <span
        class="transition-transform duration-300 ease-in-out group-hover:translate-x-1"
      >
        Cerrar sesión
      </span>
    </button>
  </div>
</template>

<script setup>
import { useAuth } from "~/composables/useAuth";
import { useRouter } from 'vue-router';

const { logout } = useAuth();
const router = useRouter();

const handleLogout = () => {
  logout();
  router.push('/login');
};
</script>
