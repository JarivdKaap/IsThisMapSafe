import { Agenda, Every } from "@tsed/agenda";
import { Inject } from "@tsed/di";
import { Job } from "agenda";
import { MapStatusService } from "./MapStatusService";
import { MapValidatorService } from "./MapValidatorService";


@Agenda()
export class AgendaService {
  @Inject()
  private mapStatusService: MapStatusService;
  @Inject()
  private mapValidatorService: MapValidatorService;


  @Every("60 minutes", {
    name: "mapStatusUpdates", 
   })
  async sendAdminStatistics(job: Job) {
    await this.mapValidatorService.watchForUpdates();
  }

  @Every("12 hours", {
    name: "trendingMapsSearch", 
   })
  async searchTrendingMaps(job: Job) {
    await this.mapStatusService.addPopularItems();
  }
}