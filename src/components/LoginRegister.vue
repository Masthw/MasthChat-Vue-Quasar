<template>
  <q-form @submit="submitForm">
    <q-input
      v-if="tab == 'register'"
      class="q-mb-md"
      outlined
      v-model="formData.name"
      label="Name"
    />
    <q-input
      class="q-mb-md"
      outlined
      v-model="formData.email"
      type="email"
      label="Email"
    />
    <q-input
      class="q-mb-md"
      outlined
      v-model="formData.password"
      type="password"
      label="Password"
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
    submitForm() {
      if (this.tab == "login") {
        console.log("login the user");
      } else {
        console.log("register the user");
      }
    },
  },
};
</script>
