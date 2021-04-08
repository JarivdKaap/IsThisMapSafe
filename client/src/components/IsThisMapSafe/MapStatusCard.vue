<template>
  <div>
    <div class="card h-100">
      <b-img-lazy :alt="'Preview image of ' + mapStatus.name" class="card-img-top" fluid :src="mapStatus.imageUrl" />
      <div class="icon icon-shape text-white rounded-circle shadow"
            style="position: absolute; top: 20px; right: 20px;"
            :class="[`bg-${iconColor}`, {'cursor-pointer': canShowDetails}]"
            v-b-modal="'modal-' + mapStatus._id"
            v-b-tooltip.hover :title="tooltipText">
        <i :class="icon"></i>
      </div>
      <div v-if="canShowDetails" class="icon icon-shape text-white rounded-circle shadow bg-gradient-gray cursor-pointer"
            style="position: absolute; height: 20px; width: 20px; top: 15px; right: 15px;"
            v-b-modal="'modal-' + mapStatus._id"
            >
        <i class="fa fa-plus"></i>
      </div>
      <b-modal v-if="canShowDetails" :id="'modal-' + mapStatus._id" size="lg" :title="mapStatus.name + ' - Details'" hide-footer>
        <div v-if="mapStatus.modNotes" class="mt--5">
          <h3>Notes from moderator:</h3>
          <p>{{ mapStatus.modNotes }}</p>
        </div>
        <div :class="{'mt--4': !mapStatus.modNotes}">
          <b-alert
            v-for="message in mapStatus.statusMessages"
            :key="message._id"
            show
            :variant="messageStyle(message).variant"
          >
            <!--<span class="alert-icon"><i :class="messageStyle(message).icon"></i></span>-->
            <span class="alert-text">{{ message.message }}</span>
          </b-alert>
        </div>
      </b-modal>
      <div class="card-body mt--3">
        <b-card-title>{{mapStatus.name}}</b-card-title>
        <b-card-text class="mt--3">
          By <b>{{mapStatus.creatorName}}</b><br>
          <div v-if="isValidated">
            Validated on {{formattedDate}}
          </div>
        </b-card-text>
      </div>
      <div class="card-footer mt--4">
        <b-button class="my--2" variant="primary" :href="steamPageUrl" target="_blank" rel="noreferrer">Visit Steam page</b-button>
      </div>
    </div>
  </div>
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
    canShowDetails() {
      return this.mapStatus.modNotes || this.mapStatus.statusMessages && this.mapStatus.statusMessages.length > 0;
    },
    tooltipText() {
      return this.tooltipStatusText + (this.canShowDetails ? ' Click for details.' : '')
    },
    tooltipStatusText() {
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
          return 'This workshop item has some user-specific code that might be suspicious.'
        case 5:
          return 'This workshop item uses code that can be malicious is some use-cases.'
        default:
          return 'Unknown Status.'
      }
    },
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
  methods: {
    messageStyle(message) {
      switch(parseInt(message.status)) {
        case 1:
          return { icon: 'ni ni-check-bold', variant: 'success' }
        case 2:
          return { icon: 'fa fa-bug', variant: 'warning' }
        case 3:
          return { icon: 'fa fa-exclamation', variant: 'danger' }
        default:
          return { icon: 'fa fa-question', variant: 'info' }
      }
    },
  }
}
</script>

<style scoped>
.cursor-pointer{
  cursor: pointer;
}

.card-img-top {
  object-fit: cover;
  height: 200px;
}
</style>