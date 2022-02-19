import { StatusMessage } from "src/entities/StatusMessage";
import { EntityRepository, Repository } from "typeorm";


@EntityRepository(StatusMessage)
export class StatusMessageRepository extends Repository<StatusMessage> {

}