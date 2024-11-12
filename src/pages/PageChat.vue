<template>
  <q-page class="flex column">
    <q-banner class="bg-grey-4 text-center"> User is offline </q-banner>
    <div class="q-pa-md column col justify-end">
      <q-chat-message
        v-for="message in messages"
        :key="message.text"
        :name="message.from"
        :text="[message.text]"
        :sent="message.from == 'me' ? true : false"
      />
    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form class="full-width">
          <q-input
            v-model="newMessage"
            bg-color="white"
            rounded
            outlined
            label="Message"
            dense
          >
            <template v-slot:after>
              <q-btn
                round
                dense
                flat
                @click="sendMessage"
                icon="send"
                color="white"
              />
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      newMessage: "",
      messages: [
        {
          text: "eai deboa",
          from: "me",
        },
        {
          text: "to suave doidao",
          from: "them",
        },
        {
          text: "pode cre",
          from: "me",
        },
      ],
    };
  },
  methods: {
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        this.messages.push({
          text: this.newMessage,
          from: "me",
        });
        this.newMessage = "";
      }
    },
  },
};
</script>

<style></style>
