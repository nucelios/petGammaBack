import { RecordDto } from '../dto/record.dto';
import { IRecord } from '../interfaces/IRecord.interface';
import { PsychologistRepository } from '../repositories/psychologist.repository';
import { RecordRepository } from '../repositories/record.repository';
import { IPsychologist } from '../interfaces/IPsychologist.interface';
import { PatientRepository } from '../repositories/patient.repository';
import { Record } from '../entities/record.entity';
import dayjs from 'dayjs';
import { EStatus } from '../enum/EStatus';

export class RecordService {
  private repository: RecordRepository;
  private repositoryPsycho: PsychologistRepository;
  private repositoryPatient: PatientRepository;

  constructor() {
    this.repository = new RecordRepository();
    this.repositoryPsycho = new PsychologistRepository();
    this.repositoryPatient = new PatientRepository();
  }

  public createRecord = async (psychologist: IPsychologist, dto: RecordDto, link?: string) => {
    const record = new Record();
    Object.assign(record, {
      patientId: dto.patientId,
      psychologistId: psychologist.id,
      slotId: dto.slotId,
      psychologistName: psychologist.fullName,
      cityId: psychologist.cityId,
      datetime: dto.datetime,
      cost: psychologist.cost,
      format: dto.format,
      broadcast: link ? link : null,
      address: link ? null : psychologist.address,
      status: EStatus.active,
      patientName: dto.patientName,
    });

    return await this.repository.createRecord(record);
  };

  public getAllRecords = async (id: number, isActual: boolean): Promise<IRecord[]> => {
    const date = dayjs().subtract(1, 'hour').format('YYYY-MM-DDTHH:mm:ss');
    return await this.repository.getAllRecords(date, id, isActual);
  };
  public getSumByMonth = async (id: number, clean: boolean) => {
    return await this.repository.getSumByMonth(id, clean);
  };

  public getDateRecords = async (date: string, id: number, isActual: boolean): Promise<IRecord[]> => {
    const startTime = dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
    const endTime = dayjs(date).endOf('day').format('YYYY-MM-DDTHH:mm:ss');
    return await this.repository.getDateRecords(startTime, endTime, id, isActual);
  };

  public getOneRecord = async (id: number): Promise<IRecord | null> => {
    return await this.repository.getOneRecord(id);
  };

  async updateRecordStatus(id: number, newStatus: EStatus) {
    return await this.repository.updateRecordStatus(id, newStatus);
  }
  async changePresenceStatus(id: number, role: 'psychologistAbsent' | 'patientAbsent') {
    await this.repository.changePresenceStatus(id, role);
    return await this.repository.updatePresenceStatus(id);
  }

  public checkPsychologists = async (id: number) => {
    return await this.repositoryPsycho.findOnePsychologist({ id: id });
  };

  public checkPatient = async (id: number) => {
    return await this.repositoryPatient.findOnePatient({ userId: id });
  };
  public transferRecord = async (id: number, newDataTime: string, broadcast?: string) => {
    return await this.repository.transferRecord(id, newDataTime, broadcast);
  };

  public checkRecord = async (id: number) => {
    return await this.getOneRecord(id);
  };

  public updatingOfPendingEntries = async () => {
    const currentDateTime = dayjs().format('YYYY-MM-DDTHH:mm:ss');
    return await this.repository.updatingOfPendingEntries(currentDateTime);
  };
  public createCommentPatient = async (id: number, comment: string) => {
    return await this.repository.createCommentPatient(id, comment);
  };

  public createCommentPsychologist = async (id: number, comment: string) => {
    return await this.repository.createCommentPsychologist(id, comment);
  };
}
