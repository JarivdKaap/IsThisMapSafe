<template>
  <div class="home">
    <b-container>
      <b-card>
        <h1>Is this map safe?</h1>
      </b-card>

      <b-form-input v-model.lazy="search" type="search" placeholder="Search..."></b-form-input>

      <b-row>
        <b-col cols="12" md="6" xl="4" v-for="mapStatus in mapStatusesFiltered" :key="mapStatus._id">
          <map-status-card :map-status="mapStatus" />
        </b-col>
      </b-row>

      <infinite-loading v-if="!search" @infinite="infiniteHandler">
        <div slot="no-more"></div>
        <div slot="no-results"></div>
      </infinite-loading>
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
    MapStatusCard,
  },
  data() {
    return {
      search: '',
      page: 1,
      mapStatuses: [],
      mapStatusesSearch: [],
    };
  },
  computed: {
    mapStatusesFiltered() {
      if (this.search)
        return this.mapStatusesSearch;
      return this.mapStatuses
    }
  },
  methods: {
    infiniteHandler($state) {
      let request;
      if (this.search)
        request = MapStatusService.getMapStatusesPageSearch(this.page, this.search);
      else
        request = MapStatusService.getMapStatusesPage(this.page);
      request
        .then((data) => {
          if (data.length) {
            this.page++;
            this.mapStatuses.push(...data);
            if ($state)
              $state.loaded();
          } else if ($state) {
            $state.complete();
          }
        })
        .catch(() => {
          if ($state)
            $state.complete();
        });
    },
  },
  watch: {
    search() {
      if (!this.search)
        return;

      this.infiniteHandler();
    }
  }
};
</script>
