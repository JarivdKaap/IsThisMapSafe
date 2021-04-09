<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-5 py-lg-6 pt-lg-7" style="height: 400px">
      <b-container>
        <div class="header-body text-center mb-9">
          <b-row class="justify-content-center">
            
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

    <b-container class="pb-5" style="margin-top: -300px;">
      <div class="header-body text-center">
        <b-row class="justify-content-center">
          <b-col lg="5" md="6">
            <div>
              <h1 class="text-white">Request A Map!</h1>
              <p class="text-lead text-white">There's a big chance you are looking for an item we don't have in our database. Give the URL and we'll add it to the queue.</p>
            </div>
          </b-col>
          <b-col lg="5" md="6" align-self="center" class="d-none d-sm-none d-md-block">
            <div>
              <h1 class="text-white" v-if="!queueData">Loading queue.</h1>
              <h1 class="text-white" v-if="queueData && queueData.validating">Currently validating:</h1>
            </div>
          </b-col>
        </b-row>
      </div>
      <b-row class="justify-content-center">
        <b-col lg="5" md="6">
          <b-card no-body class="bg-secondary border-0 mb-0">
            <b-card-header class="bg-transparent"  >
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
                    <base-button type="primary" native-type="submit" :disabled="!formValid">Request Item</base-button>
                  </div>
                </b-form>
              </validation-observer>
            </b-card-header>
          </b-card>
          <map-status-card
            v-if="mapStatus"
            class="mt-3"
            :mapStatus="mapStatus"
          />
        </b-col>
        
        <b-col lg="5" md="6">
          <div class="header-body text-center d-block d-sm-block d-md-none mt-3">
            <h1 class="text-white" v-if="!queueData">Loading queue.</h1>
            <h1 class="text-white" v-if="queueData && queueData.validating">Currently validating:</h1>
          </div>
          <h2 class="text-white text-center" v-if="queueData && !queueData.validating">The queue is completely empty and nothing is being validated!</h2>
          <map-status-card
            v-if="queueData && queueData.validating"
            class="mt-md-0 mt-sm-3"
            :mapStatus="queueData.validating"
          />
        </b-col>
      </b-row>

      <div class="header-body text-center mt-4" v-if="queueData && queueData.validating">
        <b-row class="justify-content-center" v-if="queueData">
          <b-col xl="6" lg="7" md="8" class="px-4 pt-md-5 pt-lg-0">
            <h1 class="text-white" v-if="queueData.queue.length > 0">Item {{ queueData.queue.length > 1 ? 's' : '' }} currently in the queue:</h1>
            <h1 class="text-white" v-else>The queue is empty!</h1>
          </b-col>
        </b-row>
      </div>
    </b-container>

    <map-status-list
      v-if="queueData"
      class="pt-7"
      disable-infinite-load
      :mapStatuses="queueData.queue"
    />
  </div>
</template>

<script>
import MapStatusList from '../../components/IsThisMapSafe/MapStatusList.vue'
import MapStatusService from '../../services/MapStatusService'
import MapStatusCard from '../../components/IsThisMapSafe/MapStatusCard.vue'
import MapValidatedToast from '../../components/IsThisMapSafe/MapValidatedToast.vue'

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
      queueData: null,
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
  created() {
    this.fetchQueue();
  },
  mounted() {
    this.$socket.client.on('refresh-queue', this.fetchQueue);
  },
  beforeDestroy() {
    this.$socket.client.off('refresh-queue', this.fetchQueue);
  },
  methods: {
    fetchQueue() {
      MapStatusService.getMapsQueue()
        .then(queueData => {
          this.queueData = queueData
        })
    },
    getSteamIdFromUrl() {
      if (!this.steamUrl.includes('/filedetails/') || !this.steamUrl.includes('id=')) {
        return null;
      }

      const idIndex = this.steamUrl.indexOf('id=') + 3;
      let steamId = this.steamUrl.substring(idIndex);
      if (steamId.includes('&')) {
        steamId = steamId.substring(0, steamId.indexOf('&'))
      }

      return steamId;
    },
    showValidatedNotification(mapStatus) {
      this.$socket.client.off(`item-validated-${mapStatus.steamid}`, this.showValidatedNotification);

      const h = this.$createElement

      const toastBody = h(
        MapValidatedToast,
        {
          props: {
            mapStatus,
          }
        },
      )

      this.$bvToast.toast([toastBody], {
        id: `validated-toast-${mapStatus.steamid}`,
        title: `Workshop item validated!`,
        autoHideDelay: 10000,
      })
    },
    onSubmit() {
      this.validatingCall = true;

      const steamId = this.getSteamIdFromUrl()

      if (!steamId) {
        this.validatingCall = false;
        return;
      }

      MapStatusService.createMapStatusRequest(steamId)
        .then(() => {
          this.successMessage = '<strong>Success!</strong> Added item to the queue!'
          MapStatusService.getMapsQueue()
            .then(queueData => {
              this.queueData = queueData
            })
          this.$socket.client.on(`item-validated-${steamId}`, this.showValidatedNotification);
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
