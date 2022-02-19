import { BodyParams } from "@tsed/common";
import {Controller, Inject} from "@tsed/di";
import {PathParams, QueryParams} from "@tsed/platform-params";
import {Get, Post, Returns, Summary} from "@tsed/schema";
import { MapStatus } from "src/entities/MapStatus";
import { StatusMessage } from "src/entities/StatusMessage";
import { MapStatusQueue } from "src/models/MapStatus/MapStatusQueue";
import {Pageable} from "../models/pagination/Pageable";
import {Pagination} from "../models/pagination/Pagination";
import { MapStatusService } from "../services/MapStatusService";

@Controller("/mapstatuses")
export class MapStatusController {
  @Inject()
  private mapStatusService: MapStatusService;

  @Get("/")
  @Summary("Get pageable map statuses")
  @(Returns(206, Pagination).Of(MapStatus).Title("PaginatedMapStatus"))
  @(Returns(200, Pagination).Of(MapStatus).Title("PaginatedMapStatus"))
  async getMapStatuses(@QueryParams() pageableOptions: Pageable, @QueryParams("validated") validated: boolean): Promise<Pagination<MapStatus> | undefined> {
    return this.mapStatusService.getMapStatuses(pageableOptions, validated);
  }

  @Get("/queue")
  @Summary("Get queue")
  @(Returns(200, MapStatusQueue).Title("MapStatusQueue"))
  async getMapStatusesQueue(): Promise<MapStatusQueue> {
    return this.mapStatusService.getMapStatusesQueue();
  }

  @Get("/search/:search")
  @Summary("Get pagable map statusses with search")
  @(Returns(206, Pagination).Of(MapStatus).Title("PaginatedMapStatus"))
  @(Returns(200, Pagination).Of(MapStatus).Title("PaginatedMapStatus"))
  async getMapStatusesSearch(@QueryParams() pageableOptions: Pageable, @PathParams("search") search: string): Promise<Pagination<MapStatus> | undefined> {
    return this.mapStatusService.getMapStatusesSearch(pageableOptions, search);
  }

  @Get("/:id")
  @Summary("Get map status by id")
  @(Returns(200, MapStatus).Title("MapStatus"))
  async getMapStatus(@PathParams("id") id: string): Promise<MapStatus | undefined> {
    return this.mapStatusService.getMapStatus(id);
  }

  @Get("/steamid/:id")
  @Summary("Get map status by steamid")
  @(Returns(200, MapStatus).Title("MapStatus"))
  async getMapStatusBySteamid(@PathParams("id") id: number): Promise<MapStatus | undefined> {
    return this.mapStatusService.getMapStatusBySteamId(id);
  }

  @Post("/")
  @Summary("Create map status")
  @(Returns(201, MapStatus).Title("MapStatus"))
  async updateMapStatus(@BodyParams('steamid') steamid: number) {
    return this.mapStatusService.createMapStatusRequest(steamid);
  }

  @Post("/messages/:hash")
  @Summary("Create map status messages")
  async addStatusMessages(@PathParams("hash") hash: string, @BodyParams('messages') messages: StatusMessage[]) {
    return this.mapStatusService.addStatusMessages(hash, messages);
  }
}
