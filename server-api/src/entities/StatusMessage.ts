import { OnDeserialize } from "@tsed/json-mapper";
import { Enum, Property } from "@tsed/schema";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MapStatus } from "./MapStatus";
import MessageStatus from "./MessageStatus";



@Entity()
export class StatusMessage {
  @PrimaryGeneratedColumn("uuid")
  @Property()
  id: string;

  @ManyToOne(() => MapStatus)
  mapStatus: MapStatus;

  @Column({
    type: "enum",
    enum: MessageStatus,
    default: MessageStatus.Unknown,
  })
  @Enum(MessageStatus)
  @OnDeserialize(s => MessageStatus[s])
  status: MessageStatus;
  @Column()
  @Property()
  message: string;

  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}