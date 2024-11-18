<template>
  <q-page class="flex column">
    <q-banner class="bg-grey-4 text-center"> User is offline </q-banner>
    <div class="q-pa-md column col justify-end">
      <q-chat-message
        v-for="message in messages"
        :key="message.timestamp"
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
import { mapActions, mapState } from "vuex";
export default {
  data() {
    return {
      newMessage: "",
    };
  },
  computed: {
    ...mapState("store", ["messages", "userDetails", "users"]),
    otherUserId() {
      return this.$route.params.otherUserId;
    },
    isOnline() {
      return this.users[this.otherUserId]?.online || false;
    },
  },
  methods: {
    ...mapActions("store", [
      "firebaseGetMessages",
      "firebaseStopGettingMessages",
    ]),
    sendMessage() {
      if (this.newMessage.trim() !== "") {
        const message = {
          text: this.newMessage,
          from: this.userDetails.userId,
          timestamp: Date.now(),
        };

        const chatRef = ref(
          this.$store.state.store.db,
          `chats/${this.userDetails.userId}/${this.otherUserId}`
        );
        const newMessageRef = push(chatRef);

        set(newMessageRef, message)
          .then(() => {
            this.newMessage = "";
          })
          .catch((error) => {
            console.error("Erro ao enviar mensagem:", error);
          });
      }
    },
  },
  mounted() {
    this.firebaseGetMessages(this.$route.params.otherUserId);
  },
};
</script>

<style></style>
