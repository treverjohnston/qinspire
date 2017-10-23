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
      this.$store.dispatch('getQuote')
    }
  }
</script>

<style>
  .bg-grey-2{
    background-color: rgba(255, 255, 255, .2) !important;
  }
</style>