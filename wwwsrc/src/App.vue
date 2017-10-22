<template>
  <!-- Don't drop "q-app" class -->
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
  /*
   * Root component
   */
  export default {

    mounted() {
      this.$store.dispatch('getAuth')
      this.$store.dispatch('getPhoto')
    }
  }
</script>

<style></style>