<template>
  <q-form @submit="submitForm">
    <q-input
      v-if="tab == 'register'"
      class="q-mb-md"
      outlined
      v-model="formData.name"
      label="Name"
      autocomplte="name"
    />
    <q-input
      class="q-mb-md"
      outlined
      v-model="formData.email"
      type="email"
      label="Email"
      autocomplete="email"
    />
    <q-input
      class="q-mb-md"
      outlined
      v-model="formData.password"
      type="password"
      label="Password"
      :autocomplete="tab === 'login' ? 'current-password' : 'new-password'"
    />
    <div class="row">
      <q-btn
        class="full-width"
        color="primary"
        type="submit"
        :label="tab"
      ></q-btn>
    </div>
  </q-form>
</template>

<script>
import { mapActions } from "vuex";
export default {
  props: ["tab"],
  data() {
    return {
      formData: {
        name: "",
        email: "",
        password: "",
      },
    };
  },
  methods: {
    ...mapActions("store", ["registerUser", "loginUser"]),
    submitForm() {
      if (this.tab == "login") {
        this.loginUser(this.formData);
      } else {
        this.registerUser(this.formData);
      }
    },
  },
};
</script>
