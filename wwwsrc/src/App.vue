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
      // this.$store.dispatch('getPhoto')
      // this.$store.dispatch('getQuote')
      this.$store.commit('randoms')

    }
  }
</script>

<style>
  .bg-grey-2{
    background-color: rgba(255, 255, 255, .8) !important;
  }
</style>