<template>
  <router-view />
</template>

<script>
import { mapActions } from "vuex";
import { useRouter } from "vue-router";

export default {
  methods: {
    ...mapActions("store", ["handleAuthStateChanged", "logoutUser"]),
  },
  mounted() {
    const router = useRouter();
    this.handleAuthStateChanged(router);
    window.addEventListener("beforeunload", this.handleBeforeUnload);
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.handleBeforeUnload);
  },
};
</script>
