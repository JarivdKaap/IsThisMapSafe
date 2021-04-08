<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-6 py-lg-7 pt-lg-8">
      <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="6" lg="7" md="8" class="px-4 pt-md-5 pt-lg-0">
              <h1 class="text-white" v-if="!queueData">Loading queue.</h1>
              <h1 class="text-white" v-if="queueData && queueData.validating">Currently validating</h1>
              <h1 class="text-white" v-if="queueData && !queueData.validating">The queue is completely empty and nothing is being validated!</h1>
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

    <b-container class="mt--9 pb-5" v-if="queueData && queueData.validating">
      <b-row class="justify-content-center">
        <b-col lg="5" md="7">
          <map-status-card
            :mapStatus="queueData.validating"
          />
        </b-col>
      </b-row>
      <div class="header-body text-center mt-4">
        <b-row class="justify-content-center" v-if="queueData">
          <b-col xl="6" lg="7" md="8" class="px-4 pt-md-5 pt-lg-0">
            <h1 class="text-white" v-if="queueData.queue">Items currently in the queue:</h1>
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

    <div v-if="!queueData || queueData.queue.length == 0" class="mt-5"></div>
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
      queueData: null,
    }
  },
  created() {
    MapStatusService.getMapsQueue()
      .then(queueData => {
        this.queueData = queueData
      })
  }
}
</script>
