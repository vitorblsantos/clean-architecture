import { Entity, Column, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm'

@Entity('profiles')
export class ProfileModel {
  @PrimaryColumn('varchar')
  id: string

  @CreateDateColumn()
  createdAt: Date

  @Column('varchar')
  lastname: string

  @Column('varchar')
  name: string

  @UpdateDateColumn()
  updatedAt: Date
}
