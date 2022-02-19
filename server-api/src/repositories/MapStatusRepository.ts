import { MapStatus } from "src/entities/MapStatus";
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(MapStatus)
export class MapStatusRepository extends Repository<MapStatus> {

}