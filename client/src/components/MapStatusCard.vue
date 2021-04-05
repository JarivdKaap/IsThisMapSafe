<template>
  <b-card>
    <b-row no-gutters>
      <b-col md="6">
        <b-card-img :src="mapStatus.imageUrl" alt="Image" class="rounded-0"></b-card-img>
      </b-col>
      <b-col md="6">
        <b-card-body :title="mapStatus.name">
          <b-card-text>
            Made by <b>{{ mapStatus.creatorName }}</b> Status: <b>{{ mapStatus.mapSecureStatus }}</b>
          </b-card-text>
          <b-button variant="primary" :href="steamPageUrl" target="_blank">Visit Steam page</b-button>
        </b-card-body>
      </b-col>
    </b-row>
  </b-card>
</template>

<script>
export default {
  props: {
    mapStatus: {
      type: Object,
      required: true,
    },
  },
  computed: {
    steamPageUrl() {
      return `https://steamcommunity.com/sharedfiles/filedetails/?id=${this.mapStatus.steamid}`;
    },
  },
};
</script>
