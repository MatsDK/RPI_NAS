import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Datastore extends BaseEntity {
  @PrimaryColumn("int")
  id: number;

  @Column("text")
  name: string;

  @Column("int")
  userId: number;

  @Column("int")
  localHostNodeId: number;

  @Column("int")
  localNodeId: number;

  @Column("text")
  basePath: string;
}
