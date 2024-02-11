import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IPsychologist } from '../interfaces/IPsychologist.interface';
import { City } from './city.entity';
import { User } from './user.entity';
import { Certificate } from './certificate.entity';
import { TherapyMethod } from './therapyMethod.entity';
import { Photo } from './photo.entity';
import { Symptom } from './symptom.entity';
import { Technique } from './technique.entity';
import { ELanguages } from '../enum/ELanguages';
import { EConsultationType } from '../enum/EConsultationType';
import { EFormat } from '../enum/EFormat';
import { WorkTime } from './workTime.entity';
import { EGender } from '../enum/EGender';

@Entity('psychologists')
export class Psychologist implements Required<IPsychologist> {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'full_name' })
  fullName!: string;

  @Column()
  gender!: EGender;

  @Column({ type: Date })
  birthday!: Date;

  @Column({ nullable: true })
  address!: string;

  @Column()
  cost!: number;

  @Column({ length: 600 })
  description!: string;

  @Column({ type: 'varchar', nullable: true })
  video!: string | null;

  @Column({ name: 'experience_years' })
  experienceYears!: number;

  @Column('simple-array')
  languages!: ELanguages[];

  @Column({ type: 'longtext' })
  education!: string;

  @Column('simple-array')
  format!: EFormat[];

  @Column({ name: 'consultation_type', type: 'simple-array' })
  consultationType!: EConsultationType[];

  @Column({ name: 'self_therapy' })
  selfTherapy!: number;

  @Column({ default: false })
  lgbt!: boolean;

  @Column({ name: 'is_publish', default: false })
  isPublish!: boolean;

  @Column({ name: 'city_id' })
  cityId!: number;

  @Column({ name: 'is_favorite', default: false })
  isFavorite!: boolean;

  @ManyToMany(() => Technique, (techniques) => techniques.psychologists, { cascade: true, eager: true })
  @JoinTable({
    name: 'psychologists_techniques',
    joinColumn: {
      name: 'psychologist_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'technique_id',
      referencedColumnName: 'id',
    },
  })
  techniques!: Technique[];

  @ManyToMany(() => TherapyMethod, (therapyMethod) => therapyMethod.psychologists, { cascade: true, eager: true })
  @JoinTable({
    name: 'psychologists_therapy_methods',
    joinColumn: {
      name: 'psychologist_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'therapy_method_id',
      referencedColumnName: 'id',
    },
  })
  therapyMethods!: TherapyMethod[];

  @ManyToMany(() => Symptom, (symptom) => symptom.psychologists, { cascade: true, eager: true })
  @JoinTable({
    name: 'psychologists_symptoms',
    joinColumn: {
      name: 'psychologist_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'symptom_id',
      referencedColumnName: 'id',
    },
  })
  symptoms!: Symptom[];

  @OneToOne(() => User, (user) => user.psychologist)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => City, (city) => city.psychologists, { eager: true })
  @JoinColumn({ name: 'city_id' })
  city!: City;

  @OneToMany(() => Photo, (photo) => photo.psychologist, { cascade: true, eager: true })
  photos!: Photo[];

  @OneToMany(() => Certificate, (certificate) => certificate.psychologist, { cascade: true, eager: true })
  certificates!: Certificate[];

  @OneToMany(() => WorkTime, (workTime) => workTime.psychologist, { cascade: true, eager: true })
  workTime!: WorkTime[];
}
