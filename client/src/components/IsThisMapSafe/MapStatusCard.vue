<template>
    <b-card
      :img-src="mapStatus.imageUrl"
      img-alt="Image"
      img-top
      tag="article"
      class="mb-2"
    >
      <b-row align-h="between" class="mx-1">
        <b-card-title>{{mapStatus.name}}</b-card-title>
        <div class="icon icon-shape text-white rounded-circle shadow"
              :class="[`bg-${iconColor}`]"
              v-b-tooltip.hover :title="tooltipText">
          <i :class="icon"></i>
        </div>
      </b-row>
      <b-card-text>
        By <b>{{mapStatus.creatorName}}</b><br>
        Validated on {{formattedDate}}
      </b-card-text>
      <template slot="footer">
          <b-button variant="primary" :href="steamPageUrl" target="_blank">Visit Steam page</b-button>
      </template>
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
    icon() {
      switch(parseInt(this.mapStatus.mapSecureStatus)) {
        case 0:
          return 'fa fa-bars'
        case 1:
          return 'fa fa-spinner'
        case 2:
          return 'fa fa-user'
        case 3:
          return 'ni ni-check-bold'
        case 4:
          return 'fa fa-bug'
        case 5:
          return 'fa fa-exclamation'
        default:
          return 'fa fa-question'
      }
    },
    iconColor() {
      switch(parseInt(this.mapStatus.mapSecureStatus)) {
        case 0:
          return 'gradient-gray'
        case 1:
          return 'gradient-gray'
        case 2:
          return 'gradient-gray'
        case 3:
          return 'gradient-green'
        case 4:
          return 'gradient-orange'
        case 5:
          return 'gradient-red'
        default:
          return 'gradient-gray'
      }
    },
    tooltipText() {
      switch(parseInt(this.mapStatus.mapSecureStatus)) {
        case 0:
          return 'This workshop item is in the queue for being validated.'
        case 1:
          return 'This workshop item is currently being validated.'
        case 2:
          return 'This workshop item is waiting to being validated by a moderator.'
        case 3:
          return 'This workshop item is safe.'
        case 4:
          return 'gradient-orange'
        case 5:
          return 'gradient-red'
        default:
          return 'Unknown Status.'
      }
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