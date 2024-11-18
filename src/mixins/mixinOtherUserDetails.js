export default {
  computed: {
    otherUserId() {
      return this.$route.params.otherUserId;
    },
    otherUser() {
      if (this.users && this.users[this.otherUserId]) {
        return this.users[this.otherUserId];
      } else {
        return {};
      }
    },
  },
};
