<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '../components/HelloWorld.vue'
// import wmscoms from 'wms-pubilc-coms'
export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  created () {
  }
}
</script>
