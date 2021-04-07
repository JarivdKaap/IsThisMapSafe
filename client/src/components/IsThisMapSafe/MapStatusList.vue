<template>
  <b-container class="mt--8 pb-5">
    <b-row cols="6" cols-sm="6" cols-md="6" cols-lg="4">
              <b-col
          v-for="mapStatus in mapStatuses"
          :key="mapStatus._id"
                col
                no-gutters
                class="mb-2"
                cols="12"
                sm="6"
                lg="4"
              >
        <map-status-card
          class="h-100"
          :mapStatus="mapStatus"
        />
      </b-col>
    </b-row>
    
    <infinite-loading @infinite="infiniteHandler" ref="infiniteLoading">
      <div slot="no-more"></div>
      <div slot="no-results"></div>
    </infinite-loading>
  </b-container>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading';
import MapStatusCard from './MapStatusCard.vue';
export default {
  components: {
    InfiniteLoading,
    MapStatusCard,
  },
  props: {
    mapStatuses: {
      type: Array,
      default: () => [],
    }
  },
  methods: {
    infiniteHandler($state) {
      this.$emit('load-page', $state)
    }
  }
}
</script>

<style scoped>
.my-grid {
  display: grid;
  justify-items: center;
  /* 280px is the minimum a column can get, you might need to adjust it based on your needs. */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-gap: 1.5rem;
}

.my-grid > * {
  width: 100%;
  max-width: 20rem;
}
</style>