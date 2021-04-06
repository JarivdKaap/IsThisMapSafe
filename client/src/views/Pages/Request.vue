<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-5 py-lg-6 pt-lg-7">
      <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="6" lg="7" md="8" class="px-4">
              <h1 class="text-white">Request A Map!</h1>
              <p class="text-lead text-white">There's a big chance you are looking for an item we don't have in our database. Give the URL and we'll add it to the queue.</p>
            </b-col>
          </b-row>
        </div>
      </b-container>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>

    <b-container class="mt--6 pb-5">
      <b-row class="justify-content-center">
        <b-col lg="5" md="7">
          <b-card no-body class="bg-secondary border-0 mb-0">
            <b-card-header class="bg-transparent pb-5"  >
              <div class="text-center mt-2 mb-3">Give the link of the workshop item page.</div>
              <validation-observer v-slot="{handleSubmit}" ref="formValidator">
                <b-form role="form" @submit.prevent="handleSubmit(onSubmit)">
                  <base-input alternative
                    class="mb-3"
                    name="Steam link"
                    :rules="{required: true}"
                    prepend-icon="fa fa-link"
                    placeholder="Steam link"
                    :disabled="validatingCall"
                    v-model.lazy="steamUrl">
                  </base-input>
                  <b-alert show variant="success" v-if="successMessage">
                    <span class="alert-icon"><i class="ni ni-like-2"></i></span>
                    <span class="alert-text" v-html="successMessage"></span>
                  </b-alert>
                  <b-alert show dismissible variant="danger" v-if="error">
                    <span class="alert-icon"><i class="fa fa-exclamation"></i></span>
                    <span class="alert-text"><strong>Error!</strong> {{error}}</span>
                  </b-alert>
                  <div class="text-center">
                    <base-button type="primary" native-type="submit" class="my-4" :disabled="!formValid">Request Item</base-button>
                  </div>
                </b-form>
              </validation-observer>
            </b-card-header>
          </b-card>
          <map-status-card
            class="mt-3"
            v-if="mapStatus"
            :mapStatus="mapStatus"
          />
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import MapStatusList from '../../components/IsThisMapSafe/MapStatusList.vue'
import MapStatusService from '../../services/MapStatusService'
import MapStatusCard from '../../components/IsThisMapSafe/MapStatusCard.vue'

export default {
  components: {
    MapStatusList,
    MapStatusCard,
  },
  data() {
    return {
      steamUrl: '',
      successMessage: '',
      error: '',
      urlValid: false,
      validatingCall: false,
      mapStatus: null,
    }
  },
  computed: {
    formValid() {
      if (!this.steamUrl || !this.urlValid)
        return false
      return true;
    }
  },
  watch: {
    steamUrl() {
      this.urlValid = false;
      this.mapStatus = null;
      this.validatingCall = true;
      this.successMessage = '';
      this.error = '';

      const steamId = this.getSteamIdFromUrl()

      if (!steamId) {
        this.validatingCall = false;
        return;
      }

      MapStatusService.getMapStatus(steamId)
        .then(mapStatus => {
          if (mapStatus) {
            this.successMessage = '<strong>Success!</strong> This item already exists!'
            this.mapStatus = mapStatus;
          }
          else
            this.urlValid = true;
          this.validatingCall = false;
        })
        .catch(err => {
          this.validatingCall = false;
        })
    }
  },
  methods: {
    getSteamIdFromUrl() {
      if (!this.steamUrl.includes('steamcommunity.com/sharedfiles/filedetails/?') || !this.steamUrl.includes('id=')) {
        return null;
      }

      const idIndex = this.steamUrl.indexOf('id=') + 3;
      let steamId = this.steamUrl.substring(idIndex);
      if (steamId.includes('&')) {
        steamId = steamId.substring(0, steamId.indexOf('&'))
      }

      return steamId;
    },
    onSubmit() {
      this.validatingCall = true;

      const steamId = this.getSteamIdFromUrl()

      if (!steamId) {
        this.validatingCall = false;
        return;
      }

      MapStatusService.createMapStatusRequest(steamId)
        .then(mapStatus => {
          this.mapStatus = mapStatus;
          this.successMessage = '<strong>Success!</strong> Added item to the queue!'
          this.validatingCall = false;
        })
        .catch(err => {
          this.error = err.response.data.error.message;
          this.validatingCall = false;
        })
    }
  }
}
</script>
