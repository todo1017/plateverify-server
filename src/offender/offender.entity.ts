import {
  Entity,
  Unique,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany
} from 'typeorm';
import { Record } from "src/record/record.entity";

@Entity()
@Unique(["plate"])
export class Offender {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(type => Record, record => record.offender)
  records: Record[];

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  risk_level: string;

  @Column()
  plate: string;

  @Column()
  vehicle_make: string;

  @Column()
  vehicle_model: string;

  @Column()
  vehicle_color: string;

  @Column()
  vehicle_year: string;

  @Column()
  vehicle_state: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
  
}