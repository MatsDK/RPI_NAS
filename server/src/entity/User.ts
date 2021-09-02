import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn("int")
  id: number;

  @Column("text")
  email: string;

  @Column("text")
  userName: string;
}
