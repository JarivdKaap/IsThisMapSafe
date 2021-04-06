<template>
  <b-container class="mt--8 pb-5">
    <b-card-group columns>
        <map-status-card
          v-for="mapStatus in mapStatuses"
          :key="mapStatus._id"
          :mapStatus="mapStatus"
        />
    </b-card-group>
    
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