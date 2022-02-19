import { Property } from "@tsed/schema";
import { MapStatus } from "src/entities/MapStatus";


export class MapStatusQueue {
  @Property()
  validating: MapStatus | null;
  @Property()
  queue: MapStatus[];
}