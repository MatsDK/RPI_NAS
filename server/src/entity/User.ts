import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
class User extends BaseEntity {
  @PrimaryColumn("int")
  id: number;

  @Column("text")
  email: string;

  @Column("text")
  userName: string;

  @Column("id")
  localHostNodeId: number;

  @Column("id")
  localNodeId: number;

  @Column("text")
  basePath: string;
}
