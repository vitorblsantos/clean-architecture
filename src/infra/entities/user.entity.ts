import { Entity, Column, PrimaryGeneratedColumn, Index, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity()
export class User {
  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column('varchar', { unique: true })
  name: string

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date
}
