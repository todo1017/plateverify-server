import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  RelationId
} from 'typeorm';
import { School } from 'src/school/school.entity';
import { Member } from 'src/member/member.entity';
import { Vehicle } from 'src/vehicle/vehicle.entity';

@Entity()
export class Record {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => School)
  school: School;

  @Column({nullable: true, type: 'varchar'})
  @RelationId((record: Record) => record.school)
  schoolId: string | null;

  @ManyToOne(type => Member)
  member: Member;

  @Column({nullable: true, type: 'varchar'})
  @RelationId((record: Record) => record.member)
  memberId: string | null;

  @ManyToOne(type => Vehicle)
  vehicle: Vehicle;

  @Column({nullable: true, type: 'varchar'})
  @RelationId((record: Record) => record.vehicle)
  vehicleId: string | null;

  @Column({ type: 'jsonb', default: {} })
  meta: any;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

}