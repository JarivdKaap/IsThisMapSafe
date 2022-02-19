<template>
  <div>
    <div
      v-b-modal="'modal-' + mapStatus.id"
    >
      <div class="icon icon-shape text-white rounded-circle shadow"
            :style="{ position: 'absolute', top: `${topPosition}px`, right: '20px' }"
            :class="[`bg-${iconColor(mapStatus.mapSecureStatus)}`, {'cursor-pointer': canShowDetails}]"
            v-b-tooltip.hover :title="tooltipText"
            >
        <font-awesome-icon :icon="icon" :class="{ 'fa-spin': icon === 'spinner' }"/>
      </div>
      <div v-if="canShowDetails" class="icon icon-shape text-white rounded-circle shadow bg-gradient-gray cursor-pointer"
            :style="{position: 'absolute', height: '20px', width: '20px', top: `${topPosition - 5}px`, right: '15px',}"
            >
        <font-awesome-icon icon="plus"/>
      </div>
      <div class="icon icon-shape text-white rounded-circle shadow"
        :style="{ position: 'absolute', top: `${topPosition + 55}px`, right: '20px' }"
        :class="[`bg-${iconColor(mapStatus.modReviewStatus)}`, {'cursor-pointer': canShowDetails}]"
        v-b-tooltip.hover :title="tooltipModText"
        v-if="mapStatus.modReviewStatus"
      >
        <i class="fa fa-user"></i>
      </div>
    </div>
    <b-modal v-if="canShowDetails" :id="'modal-' + mapStatus.id" size="lg" :title="mapStatus.name + ' - Details'" hide-footer>
      <div v-if="mapStatus.modNotes" class="mt--5">
        <h3>Notes from moderator:</h3>
        <p v-html="mapStatus.modNotes"></p>
      </div>
      <div :class="{'mt--4': !mapStatus.modNotes}">
        <h3>Error messages</h3>
        <b-alert
          v-for="message in mapStatus.statusMessages"
          :key="message.id"
          show
          :variant="messageStyle(message).variant"
        >
          <!--<span class="alert-icon"><i :class="messageStyle(message).icon"></i></span>-->
          <span class="alert-text">{{ message.message }}</span>
        </b-alert>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    mapStatus: {
      type: Object,
      required: true,
    },
    topPosition: {
      type: Number,
      required: false,
      default: 20,
    }
  },
  computed: {
    icon() {
      switch(parseInt(this.mapStatus.mapSecureStatus)) {
        case 1:
          return 'bars'
        case 2:
          return 'spinner'
        case 3:
          return 'user'
        case 4:
          return 'check'
        case 5:
          return 'bug'
        case 6:
          return 'exclamation'
        default:
          return 'question'
      }
    },
    canShowDetails() {
      return this.mapStatus.modNotes || this.mapStatus.statusMessages && this.mapStatus.statusMessages.length > 0;
    },
    tooltipText() {
      // @ts-ignore
      return this.tooltipStatusText + (this.canShowDetails ? ' Click for details.' : '')
    },
    tooltipModText() {
      let text = '';
      switch(parseInt(this.mapStatus.modReviewStatus)) {
        case 4:
          text = 'A moderator determined this workshop item is safe.'
          break;
        case 5:
          text = 'A moderator determined this workshop item has some user-specific code that is suspicious.'
          break;
        case 6:
          text = 'A moderator determined this workshop item uses code that is malicious and you should not play this.'
          break;
        default:
          text = 'Unknown Status.'
          break;
      }
      // @ts-ignore
      return text + (this.canShowDetails ? ' Click for details.' : '')
    },
    tooltipStatusText() {
      switch(parseInt(this.mapStatus.mapSecureStatus)) {
        case 1:
          return 'This workshop item is in the queue for being validated.'
        case 2:
          return 'This workshop item is currently being validated.'
        case 3:
          return 'This workshop item is waiting to being validated by a moderator.'
        case 4:
          return 'This workshop item is safe.'
        case 5:
          return 'This workshop item has some user-specific code that might be suspicious.'
        case 6:
          return 'This workshop item uses code that can be malicious is some use-cases.'
        default:
          return 'Unknown Status.'
      }
    },
  },
  methods: {
    messageStyle(message: { status: string }) {
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
    iconColor(status: string) {
      switch(parseInt(status)) {
        case 1:
          return 'gradient-gray'
        case 2:
          return 'gradient-gray'
        case 3:
          return 'gradient-gray'
        case 4:
          return 'gradient-green'
        case 5:
          return 'gradient-orange'
        case 6:
          return 'gradient-red'
        default:
          return 'gradient-gray'
      }
    },
  }
})
</script>

<style>
.cursor-pointer{
  cursor: pointer;
}
.tooltip {
  z-index: 999999;
}
</style>
