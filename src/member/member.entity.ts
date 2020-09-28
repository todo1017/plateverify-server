import {
  Entity,
  Unique,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  RelationId
} from 'typeorm';
import { School } from 'src/school/school.entity';
import { Vehicle } from 'src/vehicle/vehicle.entity';
import { Record } from "src/record/record.entity";

@Entity()
@Unique(['first_name', 'last_name', 'group', 'email', 'schoolId'])
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => School)
  school: School;

  @Column()
  @RelationId((member: Member) => member.school)
  schoolId: string;

  @OneToMany(type => Vehicle, vehicle => vehicle.member)
  vehicles: Vehicle[];

  @OneToMany(type => Record, record => record.member)
  records: Record[];

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  address: string;

  @Column()
  group: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  grade: string;

  @Column()
  graduation: string;

  @Column({nullable: true, type: 'varchar'})
  driver_license: string | null;

  @Column({nullable: true, type: 'varchar'})
  tag: string | null;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

}