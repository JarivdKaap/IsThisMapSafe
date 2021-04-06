<template>
  <div>
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1"
             xmlns="http://www.w3.org/2000/svg">
          <polygon class="fill-default" points="2560 0 2560 100 0 100"></polygon>
        </svg>
      </div>
    </div>

    <map-status-list
      :mapStatuses="mapStatuses"
      @load-page="loadPage"
      ref="map-status-list"
    />

    <div v-if="loadComplete && mapStatuses.length == 0" class="text-center">
      <b-container class="mt-3 pb-5">
        <b-row class="justify-content-center">
          <b-col lg="5" md="7">
            <b-card no-body class="bg-secondary border-0 mb-0">
              <h3 class="my-3">No items found with your search criteria.</h3>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script>
import MapStatusList from '../../components/IsThisMapSafe/MapStatusList.vue'
import MapStatusService from '../../services/MapStatusService'
export default {
  components: {
    MapStatusList,
  },
  data() {
    return {
      page: 1,
      mapStatuses: [],
      loadComplete: false,
    }
  },
  methods: {
    loadPage(state) {
      MapStatusService.getMapStatusesPageSearch(this.page, this.$route.params.value)
        .then((data) => {
          if (data.length) {
            this.page++;
            this.mapStatuses.push(...data);
            state.loaded();
          } else {
            this.loadComplete = true;
            state.complete();
          }
        })
        .catch(() => {
          this.loadComplete = true;
          state.complete();
        });
    }
  },
  watch: {
    '$route.params.value'() {
      this.mapStatuses = [];
      this.page = 1;
      this.$refs['map-status-list'].$refs.infiniteLoading.stateChanger.reset(); 
    }
  }
}
</script>
