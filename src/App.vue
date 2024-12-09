<template>
  <login />
</template>

<script>
import login from "./components/login.vue";

export default {
  name: "App",
  components: {
    login,
  },
};
</script>

<style>
#app {
  margin-top: 5%;
}
</style>
