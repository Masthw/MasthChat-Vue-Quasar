<template>
  <q-page class="flex q-pa-md">
    <q-card class="full-width">
      <q-tabs
        v-model="tab"
        dense
        class="bg-grey-2 text-grey-7"
        active-color="primary"
        indicator-color="primary"
        align="justify"
      >
        <q-tab name="login" label="Login" />
        <q-tab name="register" label="Register" />
      </q-tabs>

      <q-tab-panels v-model="tab" animated class="bg-white text-white">
        <q-tab-panel name="login">
          <login-register :tab="tab" @update:tab="tab = $event" />
        </q-tab-panel>

        <q-tab-panel name="register">
          <login-register :tab="tab" @update:tab="tab = $event" />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-page>
</template>

<script>
import LoginRegister from "components/LoginRegister.vue";

export default {
  data() {
    return {
      tab: "login",
    };
  },
  components: {
    LoginRegister,
  },
};
</script>

<style></style>
