<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title class="absolute-center"> {{ title }} </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  computed: {
    title() {
      let currentPath = this.$route.fullPath;
      switch (currentPath) {
        case "/":
          return "Chat M";
        case "/chat":
          return "Chat";
        case "/auth":
          return "Login";
        default:
          return "Chat M";
      }
    },
  },
};
</script>
