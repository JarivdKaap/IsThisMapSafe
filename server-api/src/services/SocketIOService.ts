import { Namespace, SocketService } from "@tsed/socketio";
import { MapStatus } from "src/entities/MapStatus";



@SocketService()
export class SocketIOService {
  @Namespace nsp: Namespace;


  public refreshQueue(): void {
    this.nsp.emit("refresh-queue");
  }

  public mapStatusValidated(mapStatus: MapStatus): void {
    this.nsp.emit(`item-validated-${mapStatus.steamid}`, mapStatus);
  }
}