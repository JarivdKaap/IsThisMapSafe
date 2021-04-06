<template>
  <div>
    <!-- Header -->
    <div class="header bg-gradient-success py-7 py-lg-8 pt-lg-9">
      <b-container>
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="6" lg="7" md="8" class="px-4">
              <h1 class="text-white">Is This Map Safe?</h1>
              <p class="text-lead text-white">A validator for Call of Duty: Black Ops III workshop items which analyzes for malicious code.</p>
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

    <map-status-list
      :mapStatuses="mapStatuses"
      @load-page="loadPage"
    />
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
      mapStatuses: []
    }
  },
  methods: {
    loadPage(state) {
      MapStatusService.getMapStatusesPage(this.page, true)
        .then((data) => {
          if (data.length) {
            this.page++;
            this.mapStatuses.push(...data);
            state.loaded();
          } else {
            state.complete();
          }
        })
        .catch(() => {
          state.complete();
        });
    }
  }
}
</script>
