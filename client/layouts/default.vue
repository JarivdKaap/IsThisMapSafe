<template>
  <div>
    <base-nav
      v-model="showMenu"
      :transparent="true"
      menu-classes="justify-content-end"
      class="navbar-horizontal navbar-main navbar-top navbar-dark"
      expand="md"
    >
      <div slot="brand" class="navbar-wrapper ml-3">
        <b-navbar-brand to="/">
          <img
            alt="Icon of IsThisMapSafe"
            style="height: 50px"

                  height="50px"
                  width="50px"
            :src="require('@/assets/images/icons/IsThisMapSafeIcon.png')"
          />
          <div
            class="h3 mb-0 text-white text-uppercase d-none d-lg-inline-block"
          >
            ITMS
          </div>
        </b-navbar-brand>
      </div>

      <template>
        <div class="navbar-collapse-header">
          <b-row>
            <b-col cols="6" class="collapse-brand">
              <NuxtLink to="/">
                <img
                  style="height: 50px"
                  height="50px"
                  width="50px"
                  alt="Icon of IsThisMapSafe"
                  :src="require('@/assets/images/icons/IsThisMapSafeIcon.png')"
                />
              </NuxtLink>
            </b-col>
            <b-col cols="6" class="collapse-close">
              <button
                type="button"
                class="navbar-toggler"
                @click="showMenu = false"
              >
                <span></span>
                <span></span>
              </button>
            </b-col>
          </b-row>
        </div>
        <b-navbar-nav class="align-items-lg-center ml-lg-auto">
          <li class="nav-item pt-md-2 pt-lg-0">
            <NuxtLink class="nav-link" exact to="/">
              <font-awesome-icon :icon="['fas', 'home']"/>
              <span class="nav-link-inner--text">Home</span>
            </NuxtLink>
          </li>
          <li class="nav-item pt-md-2 pt-lg-0">
            <NuxtLink class="nav-link" to="/request">
              <font-awesome-icon :icon="['fas', 'envelope']"/>
              <span class="nav-link-inner--text">Request</span>
            </NuxtLink>
          </li>
          <li class="nav-item pt-md-2 pt-lg-0">
            <NuxtLink class="nav-link" to="/faq">
              <font-awesome-icon :icon="['fas', 'question']"/>
              <span class="nav-link-inner--text">FAQ</span>
            </NuxtLink>
          </li>
          <b-nav-item class="d-none d-sm-none d-md-block">
            <b-form
              class="navbar-search form-inline mr-sm-3 navbar-search-dark"
              role="form"
              @submit.prevent="onSearchSubmit"
              id="navbar-search-main"
            >
              <b-form-group class="mb-0">
                <b-input-group
                  class="input-group-alternative input-group-merge"
                >
                  <b-form-input
                    placeholder="Search"
                    v-model="search"
                    type="text"
                  >
                  </b-form-input>

                  <div class="input-group-append" @click="onSearchSubmit">
                    <span class="input-group-text mr-1"
                      ><font-awesome-icon :icon="['fas', 'search']"/></span>
                  </div>
                </b-input-group>
              </b-form-group>
            </b-form>
          </b-nav-item>
          <b-nav-item class="d-block d-sm-block d-md-none">
            <b-form
              class="navbar-search form-inline mr-sm-3 navbar-search-light mt-2"
              role="form"
              @submit.prevent="onSearchSubmit"
              id="navbar-search-main"
            >
              <b-form-group class="mb-0">
                <b-input-group
                  class="input-group-alternative input-group-merge"
                >
                  <b-form-input
                    placeholder="Search"
                    v-model="search"
                    type="text"
                  >
                  </b-form-input>

                  <div class="input-group-append" @click="onSearchSubmit">
                    <span class="input-group-text"
                      ><font-awesome-icon :icon="['fas', 'search']"/></span>
                  </div>
                </b-input-group>
              </b-form-group>
            </b-form>
          </b-nav-item>
        </b-navbar-nav>
      </template>
    </base-nav>

    <div class="main-content">
      <zoom-center-transition :duration="pageTransitionDuration" mode="out-in">
        <Nuxt />
      </zoom-center-transition>
    </div>

    <footer class="py-5" id="footer-main">
      <b-container>
        <b-row align-v="center" class="justify-content-xl-between">
          <b-col xl="6">
            <div class="copyright text-center text-xl-left text-muted">
              © {{ year }}
              <a
                href="https://www.jarivdkaap.com"
                rel="noreferrer"
                class="font-weight-bold ml-1"
                target="_blank"
                >Jari van der Kaap</a
              >
            </div>
          </b-col>
        </b-row>
      </b-container>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import { ZoomCenterTransition } from 'vue2-transitions'

export default Vue.extend({
  components: {
    ZoomCenterTransition,
  },
  props: {
    backgroundColor: {
      type: String,
      default: 'black',
    },
  },
  data() {
    return {
      search: '',
      showMenu: false,
      menuTransitionDuration: 250,
      pageTransitionDuration: 200,
      year: new Date().getFullYear(),
      pageClass: 'login-page',
    }
  },
  methods: {
    toggleNavbar() {
      document.body.classList.toggle('nav-open')
      this.showMenu = !this.showMenu
    },
    closeMenu() {
      document.body.classList.remove('nav-open')
      this.showMenu = false
    },
    setBackgroundColor() {
      document.body.classList.add('bg-default')
    },
    removeBackgroundColor() {
      document.body.classList.remove('bg-default')
    },
    updateBackground() {
      // @ts-ignore
      if (!this.$route.meta.noBodyBackground) {
        this.setBackgroundColor()
      } else {
        this.removeBackgroundColor()
      }
    },
    onSearchSubmit() {
      if (
        (this.$route.name == 'search' &&
          this.$route.params.value === this.search) ||
        !this.search
      )
        return
      this.$router.push({ name: 'search', params: { value: this.search } })
    },
  },
  beforeDestroy() {
    this.removeBackgroundColor()
  },
  beforeRouteUpdate(to, from, next) {
    // Close the mobile menu first then transition to next page
    if (this.showMenu) {
      this.closeMenu()
      setTimeout(() => {
        next()
      }, this.menuTransitionDuration)
    } else {
      next()
    }
  },
})
</script>

<style lang="scss">
body {
  background-color: #212121 !important;
}
$scaleSize: 0.8;
@keyframes zoomIn8 {
  from {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
  100% {
    opacity: 1;
  }
}

.main-content .zoomIn {
  animation-name: zoomIn8;
}

@keyframes zoomOut8 {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    transform: scale3d($scaleSize, $scaleSize, $scaleSize);
  }
}

.main-content .zoomOut {
  animation-name: zoomOut8;
}

.main-content {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  z-index: 1;
  background-color: transparent;
  padding-left: 0 !important;
  padding-right: 0 !important;
}
</style>
