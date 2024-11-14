<template>
  <router-view />
</template>

<script>
import { mapActions } from "vuex";

export default {
  methods: {
    ...mapActions("store", ["handleAuthStateChanged"]),
  },
  mounted() {},
};
</script>
