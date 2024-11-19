<template>
  <q-page ref="pageChat" class="page-chat flex column">
    <q-banner v-if="!otherUser.online" class="bg-grey-4 text-center fixed-top">
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
        :bg-color="message.from == 'me' ? 'white' : 'light-green-2'"
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

<style lang="stylus">
.page-chat
  background #e2dfd5
  &:after
    content ''
    display block
    position fixed
    left 0
    right 0
    top 0
    bottom 0
    z-index 0
    opacity 0.1
    background-image radial-gradient(circle at 100% 150%, silver 24%, white 25%, white 28%, silver 29%, silver 36%, white 36%, white 40%, transparent 40%, transparent), radial-gradient(circle at 0    150%, silver 24%, white 25%, white 28%, silver 29%, silver 36%, white 36%, white 40%, transparent 40%, transparent), radial-gradient(circle at 50%  100%, white 10%, silver 11%, silver 23%, white 24%, white 30%, silver 31%, silver 43%, white 44%, white 50%, silver 51%, silver 63%, white 64%, white 71%, transparent 71%, transparent), radial-gradient(circle at 100% 50%, white 5%, silver 6%, silver 15%, white 16%, white 20%, silver 21%, silver 30%, white 31%, white 35%, silver 36%, silver 45%, white 46%, white 49%, transparent 50%, transparent), radial-gradient(circle at 0    50%, white 5%, silver 6%, silver 15%, white 16%, white 20%, silver 21%, silver 30%, white 31%, white 35%, silver 36%, silver 45%, white 46%, white 49%, transparent 50%, transparent)
    background-size 100px 50px
.q-banner
  top 50px
  z-index 2
  opacity: 0.8
.q-message
  z-index 1
</style>
