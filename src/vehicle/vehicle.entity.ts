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

  @Column({nullable: true, type: 'varchar'})
  insurance: string | null;

  @Column({nullable: true, type: 'varchar'})
  registration: string | null;

  @Column({nullable: true, type: 'varchar'})
  status: string | null;

  @ManyToOne(type => School)
  school: School;

  @Column()
  @RelationId((member: Member) => member.school)
  schoolId: string;

  @ManyToOne(type => Member, member => member.vehicles)
  member: Member;

  @Column({nullable: true, type: 'varchar'})
  @RelationId((vehicle: Vehicle) => vehicle.member)
  memberId: string | null;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

}
