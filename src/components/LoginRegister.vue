<template>
  <q-form @submit="submitForm">
    <q-input
      v-if="tab == 'register'"
      v-model="formData.name"
      class="q-mb-md"
      outlined
      label="Name"
      autocomplete="name"
    />
    <q-input
      v-model="formData.email"
      class="q-mb-md"
      outlined
      type="email"
      label="Email"
      autocomplete="email"
    />
    <q-input
      v-model="formData.password"
      class="q-mb-md"
      outlined
      type="password"
      label="Password"
      :autocomplete="tab === 'login' ? 'current-password' : 'new-password'"
    />
    <div class="row">
      <q-space />
      <q-btn color="primary" type="submit" :label="tab" />
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
      this.formData.name = "";
      this.formData.email = "";
      this.formData.password = "";
      this.$emit("update:tab", "login");
    },
  },
};
</script>
