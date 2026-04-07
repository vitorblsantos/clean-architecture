import { Entity, Column, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class ProfileModel {
  @CreateDateColumn()
  createdAt: Date

  @Index({ unique: true })
  @Column('varchar')
  id: string

  @Column('varchar')
  lastname: string

  @Column('varchar')
  name: string

  @UpdateDateColumn()
  updatedAt: Date
}
