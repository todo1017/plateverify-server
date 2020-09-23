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

@Entity()
@Unique(['school', 'category'])
export class Setting {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(type => School)
  school: School;

  @RelationId((setting: Setting) => setting.school)
  schoolId: string;

  @Column()
  category: string;

  @Column('simple-json')
  body: {};

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

}