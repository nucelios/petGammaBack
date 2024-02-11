import { ICertificate } from './ICertificate.interface';
import { IUser } from './IUser.interface';
import { ICity } from './ICity.interface';
import { IPhoto } from './IPhoto.interface';
import { ITechnique } from './ITechnique.interface';
import { ITherapyMethod } from './ITherapyMethod.interface';
import { ISymptom } from './ISymptom.interface';
import { ELanguages } from '../enum/ELanguages';
import { EConsultationType } from '../enum/EConsultationType';
import { EFormat } from '../enum/EFormat';
import { EGender } from '../enum/EGender';

interface IPsychologistDataOnly {
  id: number;
  fullName: string;
  gender: EGender;
  birthday: Date;
  address: string;
  description: string;
  video: string | null;
  experienceYears: number;
  languages: ELanguages[];
  education: string;
  format: EFormat[];
  cost: number;
  consultationType: EConsultationType[];
  selfTherapy: number;
  lgbt: boolean;
  isPublish: boolean;
  userId: number;
  cityId: number;
}

interface IPsychologistNewDataOnly extends Omit<IPsychologistDataOnly, 'id' | 'isPublish' | 'userId'> {}

interface IPsychologistRelations {
  user: IUser;
  city: ICity;
  certificates: ICertificate[];
  photos: IPhoto[];
  therapyMethods: ITherapyMethod[];
  techniques: ITechnique[];
  symptoms: ISymptom[];
}

export interface IPsychologist extends IPsychologistDataOnly, Partial<IPsychologistRelations> {
  isFavorite: boolean;
}

export interface IPsychologistNewData extends IPsychologistNewDataOnly, Pick<IPsychologistRelations, 'symptoms' | 'techniques' | 'therapyMethods'> {}

export interface IPsychologistClientData extends IPsychologistNewDataOnly {
  therapyMethodIds: number[];
  techniqueIds: number[];
  symptomIds: number[];
}
