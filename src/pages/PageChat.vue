<template>
  <q-page ref="pageChat" class="flex column">
    <q-banner v-if="!otherUser.online" class="bg-grey-4 text-center">
      {{ otherUser.name }} is offline
    </q-banner>
    <div
      :class="{ invisible: !showMessages }"
      class="q-pa-md column col justify-end"
    >
      <q-chat-message
        v-for="message in messages"
        :key="message.timestamp"
        :name="message.from == 'me' ? userDetails.name : otherUser.name"
        :text="[message.text]"
        :sent="message.from == 'me' ? true : false"
      />
    </div>
    <q-footer elevated>
      <q-toolbar>
        <q-form class="full-width" @submit.prevent="sendMessage">
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
import mixinOtherUserDetails from "src/mixins/mixinOtherUserDetails";

export default {
  mixins: [mixinOtherUserDetails],
  data() {
    return {
      newMessage: "",
      showMessages: false,
    };
  },
  computed: {
    ...mapState("store", ["messages", "userDetails", "users"]),
  },
  methods: {
    ...mapActions("store", [
      "firebaseGetMessages",
      "firebaseStopGettingMessages",
      "firebaseSendMessage",
    ]),
    sendMessage() {
      this.firebaseSendMessage({
        message: {
          text: this.newMessage,
          from: "me",
        },
        otherUserId: this.$route.params.otherUserId,
      });
      this.newMessage = "";
      this.$nextTick(() => {
        this.scrollToBottom();
      });
    },
    scrollToBottom() {
      const pageChat = this.$refs.pageChat.$el;
      setTimeout(() => {
        window.scrollTo(0, pageChat.scrollHeight);
      }, 20);
    },
  },
  watch: {
    messages: function (val) {
      if (Object.keys(val).length) {
        this.$nextTick(() => {
          this.scrollToBottom();
        });
        setTimeout(() => {
          this.showMessages = true;
        }, 100);
      }
    },
  },
  mounted() {
    this.firebaseGetMessages(this.$route.params.otherUserId);
  },
};
</script>

<style></style>
