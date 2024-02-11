import { FiltersOfPsychologistDto } from '../dto/filtersOfPsychologist.dto';
import { Psychologist } from '../entities/psychologist.entity';
import { IPsychologist, IPsychologistClientData, IPsychologistNewData } from '../interfaces/IPsychologist.interface';
import { ISymptom } from '../interfaces/ISymptom.interface';
import { ITechnique } from '../interfaces/ITechnique.interface';
import { ITherapyMethod } from '../interfaces/ITherapyMethod.interface';
import { PatientRepository } from '../repositories/patient.repository';
import { PsychologistRepository } from '../repositories/psychologist.repository';
import { SymptomRepository } from '../repositories/symptom.repository';
import { TechniqueRepository } from '../repositories/technique.repository';
import { TherapyMethodRepository } from '../repositories/therapyMethod.repository';

interface IPsychologistSkills extends Pick<IPsychologistNewData, 'therapyMethods' | 'techniques' | 'symptoms'> {}

export class PsychologistService {
  private repository: PsychologistRepository;
  private therapyMethodRepository: TherapyMethodRepository;
  private techniqueRepository: TechniqueRepository;
  private symptomRepository: SymptomRepository;
  private patientRepository: PatientRepository;

  constructor() {
    this.repository = new PsychologistRepository();
    this.therapyMethodRepository = new TherapyMethodRepository();
    this.techniqueRepository = new TechniqueRepository();
    this.symptomRepository = new SymptomRepository();
    this.patientRepository = new PatientRepository();
  }

  public createPsychologistEntity = async (
    { therapyMethodIds, techniqueIds, symptomIds, ...restPsychologistClientData }: IPsychologistClientData,
    certificateList: string[],
    photosList: string[],
  ): Promise<Psychologist> => {
    const psychologistSkills = await this.getAllPsychologistSkillById(therapyMethodIds, techniqueIds, symptomIds);
    const psychologistNewData: IPsychologistNewData = { ...restPsychologistClientData, ...psychologistSkills };
    return this.repository.createPsychologistEntity(psychologistNewData, certificateList, photosList);
  };

  public getOnePsychologist = async (id: number): Promise<IPsychologist | null> => {
    return await this.repository.findOnePsychologist({ id });
  };

  public getPsychologists = async (isPublish: boolean): Promise<IPsychologist[]> => {
    return await this.repository.findPsychologists(isPublish);
  };

  public findPsychologistsByIds = async (ids: number[]): Promise<IPsychologist[] | null> => {
    return await this.repository.findPsychologistsByIds(ids);
  };

  public markFavoritePsychologists = async (psychologists: IPsychologist[], userId: number | undefined): Promise<IPsychologist[]> => {
    if (!userId) return psychologists;

    const patient = await this.patientRepository.findOnePatient({ userId });
    if (!patient || !Array.isArray(patient.favorites)) return psychologists;

    const favoriteIds = new Set(patient.favorites.map((favorite) => favorite.id));
    psychologists.forEach((psychologist) => (psychologist.isFavorite = favoriteIds.has(psychologist.id)));
    return psychologists;
  };

  public editPsychologist = async (
    id: number,
    { therapyMethodIds, techniqueIds, symptomIds, ...restPsychologistClientData }: IPsychologistClientData,
  ): Promise<IPsychologist | null> => {
    const psychologistSkills = await this.getAllPsychologistSkillById(therapyMethodIds, techniqueIds, symptomIds);
    const psychologistNewData: IPsychologistNewData = { ...restPsychologistClientData, ...psychologistSkills };
    await this.repository.editPsychologist(id, psychologistNewData);

    return await this.repository.findOnePsychologist({ id });
  };

  public publishPsychologist = async (id: number) => {
    return await this.repository.publishPsychologist(id);
  };

  public deletePsychologist = async (id: number) => {
    return await this.repository.deletePsychologist(id);
  };

  public getOnePsychologistByUserId = async (userId: number): Promise<IPsychologist | null> => {
    return await this.repository.findOnePsychologist({ userId });
  };

  private getAllPsychologistSkillById = async (
    therapyMethodIds: number[],
    techniqueIds: number[],
    symptomIds: number[],
  ): Promise<IPsychologistSkills> => {
    const therapyMethods: ITherapyMethod[] = await this.therapyMethodRepository.getAllTherapyMethodById(therapyMethodIds);
    const techniques: ITechnique[] = await this.techniqueRepository.getAllTechniqueById(techniqueIds);
    const symptoms: ISymptom[] = await this.symptomRepository.getAllSymptomById(symptomIds);

    return { therapyMethods, techniques, symptoms };
  };

  public filterPsychologists = async (filters: FiltersOfPsychologistDto): Promise<IPsychologist[]> => {
    const psychologistsIdFiltered = await this.repository.filterPsychologists(filters);
    const psychologistsIdFilteredArray: number[] = psychologistsIdFiltered.map((psychologist) => psychologist.id);

    return await this.repository.findPsychologistsByIds(psychologistsIdFilteredArray);
  };
}
