import {
  Entity,
  Unique,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany
} from 'typeorm';
import { School } from 'src/school/school.entity';
import { Vehicle } from 'src/vehicle/vehicle.entity';

@Unique(['plate', 'school'])
@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  address: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  grade: string;

  @Column()
  graduation: string;

  @Column()
  driver_license: string;

  @Column()
  tag: string;

  @ManyToOne(type => School, school => school.users)
  school: School;

  @OneToMany(type => Vehicle, vehicle => vehicle.member)
  vehicles: Vehicle[];

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

}