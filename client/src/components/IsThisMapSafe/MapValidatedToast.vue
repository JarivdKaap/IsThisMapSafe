<template>
  <div class="mx--3 mt--3">
    <b-img-lazy :alt="'Preview image of ' + mapStatus.name" class="img-top w-100" fluid :src="mapStatus.imageUrl" />
    <map-status-result-icon
      :topPosition="50"
      :mapStatus="mapStatus"
    />
    <div class="ml-3 mt-1">
      <b-card-title>{{mapStatus.name}}</b-card-title>
      <b-card-text class="mt--3">
        By <b>{{mapStatus.creatorName}}</b><br>
      </b-card-text>
    </div>
  </div>
</template>

<script>
import MapStatusResultIcon from './MapStatusResultIcon.vue'
export default {
  components: { MapStatusResultIcon },
  props: {
    mapStatus: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped>
.img-top {
  object-fit: cover;
  height: 150px;
}
</style>