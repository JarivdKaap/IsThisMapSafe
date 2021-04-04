<template>
  <div class="home">
    <b-container>
      <b-card>  
        <h1>Is this map safe?</h1>
      </b-card>

      <b-row>
        <b-col
          cols="12" md="6" xl="4"
          v-for="mapStatus in mapStatuses"
          :key="mapStatus._id"
        >
          <map-status-card
            :map-status="mapStatus"
          />
        </b-col>
      </b-row>

      <infinite-loading @infinite="infiniteHandler" />
    </b-container>
  </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import MapStatusCard from '../components/MapStatusCard.vue';
import MapStatusService from '../services/MapStatusService';

export default {
  name: 'Home',
  components: {
    InfiniteLoading,
    MapStatusCard
  },
  data() {
    return {
      page: 1,
      mapStatuses: []
    }
  },
  methods: {
    infiniteHandler($state) {
      MapStatusService.getMapStatuses(this.page)
        .then(data => {
          if (data.length) {
            this.page++;
            this.mapStatuses.push(...data)
            $state.loaded();
          } else {
            $state.complete();
          }
        })
        .catch(() => {
          $state.complete();
        })
    }
  }
};
</script>
