<template>
  <b-container class="b-container">
    <header cl>
      <h1>Is this map safe?</h1>
    </header>

    <transition name="fade">
      <router-view />
    </transition>
  </b-container>
</template>

<style>
body {
  background-color: #1b1b1b;
}

header {
  background-image: url('~@/assets/images/header_background.jpeg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  height: 100px;
  opacity: 0.4;
  filter: alpha(opacity=40); /* msie */
  background-color: #000;
}

h1 {
 color: white;
}

.b-container {
  background-color: #2b2b2b;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
