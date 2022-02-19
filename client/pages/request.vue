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
                  <b-input-group size="md" class="mb-3">
                    <b-input-group-prepend is-text>
                      <font-awesome-icon icon="link"/>
                    </b-input-group-prepend>
                    <b-form-input alternative
                      name="Steam link"
                      :rules="{required: true}"
                      prepend-icon="fa fa-link"
                      placeholder="Steam link"
                      :disabled="validatingCall"
                      v-model.lazy="steamUrl">
                    </b-form-input>
                   </b-input-group>
                  <b-alert show variant="success" v-if="successMessage">
                    <span class="alert-icon"><i class="ni ni-like-2"></i></span>
                    <span class="alert-text" v-html="successMessage"></span>
                  </b-alert>
                  <b-alert show variant="danger" v-if="error">
                    <span class="alert-icon"><i class="fa fa-exclamation"></i></span>
                    <span class="alert-text"><strong>Error!</strong> {{error}}</span>
                  </b-alert>
                  <div class="text-center w-100">
                    <b-button variant="primary" class="w-100" type="submit" :disabled="!formValid">
                      Request Item
                    </b-button>
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
            <h1 class="text-white" v-if="queueData.queue.length > 0">Item{{ queueData.queue.length > 1 ? 's' : '' }} currently in the queue:</h1>
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


<script lang="ts">
import { ValidationObserver, ValidationProvider } from "vee-validate";
import { Component, Vue, Watch } from "nuxt-property-decorator";

@Component({
  layout: 'default',
  components: {
    ValidationObserver: ValidationObserver,
    ValidationProvider: ValidationProvider
  }
})
export default class Home extends Vue {
  private steamUrl: string = '';
  private successMessage: string = '';
  private error: string = '';
  private urlValid: boolean = false;
  private validatingCall: boolean = false;
  private mapStatus: object|null = null;
  private queueData: object|null = null;

  // @ts-ignore
  async asyncData ( { $axios } ) {
    const queueData = await $axios.$get(`/api/mapstatuses/queue`)
    return {
      steamUrl: '',
      successMessage: '',
      error: '',
      urlValid: false,
      validatingCall: false,
      mapStatus: null,
      queueData: queueData,
    }
  }

  get formValid() {
    if (!this.steamUrl || !this.urlValid)
      return false
    return true;
  }

   @Watch('steamUrl')
   onSteamUrlChanged() {
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

      this.$axios.$get(`/api/mapstatuses/steamid/${steamId}`)
        .then((mapStatus: any) => {
          if (mapStatus) {
            this.successMessage = '<strong>Success!</strong> This item already exists!'
            this.mapStatus = mapStatus;
          }
          else
            this.urlValid = true;
          this.validatingCall = false;
        })
        .catch((err: any) => {
          this.validatingCall = false;
        })
    }

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
    }

    onSubmit() {
      this.validatingCall = true;

      const steamId = this.getSteamIdFromUrl()

      if (!steamId) {
        this.validatingCall = false;
        return;
      }

      this.$axios.$post('/api/mapstatuses', { steamid: steamId })
        .then(() => {
          this.successMessage = '<strong>Success!</strong> Added item to the queue!'
          this.$axios.$get(`/api/mapstatuses/queue`)
            .then(queueData => {
              this.queueData = queueData
            })
          //this.$socket.client.on(`item-validated-${steamId}`, this.showValidatedNotification);
          this.validatingCall = false;
        })
        .catch((err: any) => {
          this.error = err.response.data.message;
          this.validatingCall = false;
        })
    }
}
</script>
