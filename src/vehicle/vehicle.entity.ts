import {
  Entity,
  Unique,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  RelationId
} from 'typeorm';
import { School } from 'src/school/school.entity';
import { Member } from 'src/member/member.entity';

@Entity()
@Unique(['plate', 'school'])
export class Vehicle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  plate: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  body: string;

  @Column()
  color: string;

  @Column()
  insurance: string;

  @Column()
  registration: string;

  @Column({ default: false })
  status: string;

  @Column({ type: 'jsonb', default: ['partner'] })
  roles: string[];

  @ManyToOne(type => School)
  school: School;

  @RelationId((vehicle: Vehicle) => vehicle.school)
  schoolId: string;

  @ManyToOne(type => Member, member => member.vehicles)
  member: Member;

  @RelationId((vehicle: Vehicle) => vehicle.member)
  memberId: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

}
