<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          v-if="$route.fullPath.includes('/chat')"
          @click="goBack"
          icon="arrow_back"
          flat
          dense
          label="Back"
        />
        <q-toolbar-title class="absolute-center"> {{ title }} </q-toolbar-title>

        <q-btn
          class="absolute-right q-pr-sm"
          @click="goLoginPage"
          no-caps
          icon="account_circle"
          flat
          dense
          label="Login"
        />
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
          return "MyChats";
        case "/chat":
          return "Chat";
        case "/auth":
          return "Login";
        default:
          return "MyChat";
      }
    },
  },
  methods: {
    goBack() {
      if (window.history.length > 1) {
        this.$router.back();
      } else {
        this.$router.push("/");
      }
    },
    goLoginPage() {
      this.$router.push("/auth");
    },
  },
};
</script>
