import { Entity, Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm'

@Entity('profiles')
export class ProfileModel {
  @PrimaryColumn('varchar')
  id!: string

  @CreateDateColumn()
  createdAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date | null

  @Column('varchar')
  lastname!: string

  @Column('varchar')
  name!: string

  @UpdateDateColumn()
  updatedAt!: Date
}
