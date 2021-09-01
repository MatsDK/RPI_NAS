import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Node extends BaseEntity {
  @PrimaryColumn("int")
  id: number;

  @Column("text")
  name: string;

  @Column("text")
  ip: string;
}
