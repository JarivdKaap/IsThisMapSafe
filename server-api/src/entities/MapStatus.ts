import { OnDeserialize } from "@tsed/json-mapper";
import { CollectionOf, Enum, Ignore, Nullable, Property, Required } from "@tsed/schema";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import MapSecureStatus from "./MapSecureStatus";
import { StatusMessage } from "./StatusMessage";


@Entity()
export class MapStatus {
  @PrimaryGeneratedColumn("uuid")
  @Property()
  id: string;
  @Column()
  @Property()
  @Required()
  name: string;
  @Column()
  @Property()
  @Required()
  creatorName: string;
  @Column({type: 'bigint'})
  @Property()
  @Required()
  steamid: number;
  @Column()
  @Property()
  @Required()
  imageUrl: string;

  @Column({
    type: "enum",
    enum: MapSecureStatus,
    default: MapSecureStatus.Unknown,
  })
  @Enum(MapSecureStatus)
  @OnDeserialize(s => MapSecureStatus[s])
  @Required()
  mapSecureStatus: MapSecureStatus;
  @Column({
    type: "enum",
    enum: MapSecureStatus,
    default: MapSecureStatus.Unknown,
  })
  @Enum(MapSecureStatus)
  @Required()
  @OnDeserialize(s => MapSecureStatus[s])
  modReviewStatus: MapSecureStatus;

  @OneToMany(() => StatusMessage, statusMessage => statusMessage.mapStatus, {
    eager: true,
  })
  @JoinColumn()
  @CollectionOf(StatusMessage)
  statusMessages: StatusMessage[];

  @Column({
    type: 'text',
    nullable: true,
  })
  @Ignore()
  validationHash: string | null;
  @Column({
    type: 'text',
    nullable: true,
  })
  @Property()
  modNotes: string;

  @CreateDateColumn()
  @Property()
  createdAt: Date;
  @UpdateDateColumn()
  @Property()
  updatedAt: Date;
  @DeleteDateColumn()
  deletedAt: Date;
}