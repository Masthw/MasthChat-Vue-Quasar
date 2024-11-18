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

        <q-toolbar-title class="absolute-center">
          {{ title }}
        </q-toolbar-title>

        <q-btn
          v-if="!userDetails.userId"
          to="/auth"
          class="absolute-right q-pr-sm"
          icon="account_circle"
          no-caps
          flat
          dense
          label="Login"
        />
        <q-btn
          v-else
          @click="logoutUser"
          class="absolute-right q-pr-sm"
          icon="account_circle"
          no-caps
          flat
          dense
        >
          Logout<br />
          {{ userDetails.name }}
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  computed: {
    ...mapState("store", ["userDetails"]),
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
    ...mapActions("store", ["logoutUser", "firebaseStopGettingMessages"]),
    logoutUser() {
      this.$store.dispatch("store/logoutUser").then(() => {
        this.$router.replace("/auth");
      });
    },
    goBack() {
      this.$store
        .dispatch("store/firebaseStopGettingMessages")
        .then(() => {
          if (window.history.length > 1) {
            this.$router.back();
          } else {
            this.$router.push("/");
          }
        })
        .catch((error) => {
          console.error("Erro ao parar de obter mensagens:", error);
        });
    },
  },
};
</script>

<style lang="stylus">
.q-toolbar
  .q-btn
    line-height: 1.2
</style>
