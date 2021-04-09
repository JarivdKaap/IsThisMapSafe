<template>
  <div>
    <div class="card h-100">
      <b-img-lazy :alt="'Preview image of ' + mapStatus.name" class="card-img-top" fluid :src="mapStatus.imageUrl" />
      <map-status-result-icon
        :mapStatus="mapStatus"
      />
      <div class="card-body mt--3">
        <b-card-title>{{mapStatus.name}}</b-card-title>
        <b-card-text class="mt--3">
          By <b>{{mapStatus.creatorName}}</b><br>
          <div v-if="isValidated">
            Validated on {{formattedDate}}
          </div>
        </b-card-text>
      </div>
      <div class="card-footer mt--4" v-if="!hideSteamButton">
        <b-button class="my--2" variant="primary" :href="steamPageUrl" target="_blank" rel="noreferrer">Visit Steam page</b-button>
      </div>
    </div>
  </div>
</template>

<script>
import MapStatusResultIcon from './MapStatusResultIcon.vue'
export default {
  props: {
    mapStatus: {
      type: Object,
      required: true,
    },
    hideSteamButton: {
      type: Boolean,
      default: false,
    }
  },
  components: { MapStatusResultIcon },
  computed: {
    isValidated() {
      return parseInt(this.mapStatus.mapSecureStatus) >= 3;
    },
    formattedDate() {
      return new Date(this.mapStatus.statusChangedDate).toLocaleDateString()
    },
    steamPageUrl() {
      return `https://steamcommunity.com/sharedfiles/filedetails/?id=${this.mapStatus.steamid}`;
    },
  },
}
</script>

<style scoped>
.card-img-top {
  object-fit: cover;
  height: 150px;
}
</style>