<template>
  <div>
    <div class="header bg-gradient-success py-6 py-lg-7 pt-lg-8">
      <b-container v-if="loadComplete && mapStatuses.length > 0">
        <div class="header-body text-center mb-7">
          <b-row class="justify-content-center">
            <b-col xl="6" lg="7" md="8" class="px-4">
              <h1 class="text-white">
                Search Results - {{ $route.params.value }}
              </h1>
            </b-col>
          </b-row>
        </div>
      </b-container>
      <div class="separator separator-bottom separator-skew zindex-100">
        <svg
          x="0"
          y="0"
          viewBox="0 0 2560 100"
          preserveAspectRatio="none"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            class="fill-default"
            points="2560 0 2560 100 0 100"
          ></polygon>
        </svg>
      </div>
    </div>

    <map-status-list :mapStatuses="mapStatuses" ref="map-status-list" @load-page="loadPage" />

    <div v-if="loadComplete && mapStatuses.length == 0" class="text-center">
      <b-container class="mt-3 pb-5">
        <b-row class="justify-content-center">
          <b-col lg="5" md="7">
            <b-card no-body class="bg-secondary border-0 mb-0">
              <h3 class="my-3">No items found with your search criteria.</h3>
            </b-card>
          </b-col>
        </b-row>
      </b-container>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'

@Component({})
export default class Home extends Vue {
  private page: number = 1
  private mapStatuses: object[] = []
  private loadComplete: boolean = false

  // @ts-ignore
  async asyncData({ $axios, route }) {
    const mapStatuses = await $axios.$get(
      `/api/mapstatuses/search/${route.params.value}?page=0&size=9`
    )
    return {
      page: 1,
      loadComplete: true,
      mapStatuses: mapStatuses.data,
    }
  }

  loadPage(state: any) {
    // @ts-ignore
    this.$axios
      .$get(
        `/api/mapstatuses/search/${this.$route.params.value}?page=${this.page}&size=9`
      )
      .then((response: any) => {
        if (response.data.length) {
          // @ts-ignore
          this.page++
          // @ts-ignore
          this.mapStatuses.push(...response.data)
          state.loaded()
        } else {
          state.complete()
        }
      })
      .catch(() => {
        state.complete()
      })
  }
}
</script>
