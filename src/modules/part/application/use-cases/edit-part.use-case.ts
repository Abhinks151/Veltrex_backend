import { Inject, Injectable } from '@nestjs/common';
import { IPartRepository } from '../ports/repositories/part-repository.interface';
import { IEditPartUseCase } from '../ports/use-cases/edit-part.use-case.interface';
import { Part } from '../../domain/part.entity';
import { EditPartDto } from '../dto/edit-part.dto';
import { IFileStorageService } from '@/shared/infrastructure/storage/interfaces/file-storage.interface';
import { FILE_STORAGE } from '@/shared/infrastructure/storage/storage.constants';
import { S3BucketFolderConstants } from '@/shared/enums/s3-bucket-folder.constants';
import { Prisma } from '@prisma/client';

@Injectable()
export class EditPartUseCase implements IEditPartUseCase {
  constructor(
    @Inject('IPartRepository')
    private readonly _partRepository: IPartRepository,
    @Inject(FILE_STORAGE)
    private readonly _fileStorageService: IFileStorageService,
  ) {}

  async execute(id: string, data: EditPartDto): Promise<Part> {
    const updateData: Prisma.PartUpdateInput = {
      name: data.name,
      partNumber: data.partNumber,
      description: data.description,
      material: data.material,
      operationType: data.operationType,
      dimensions: data.dimensions,
      cycleTime: data.cycleTime,
      setupTime: data.setupTime,
      priority: data.priority,
      // prisma connection other wide it will be undefined
      ...(data.machineId !== undefined && {
        machine: data.machineId
          ? { connect: { id: data.machineId } }
          : { disconnect: true },
      }),
      ...(data.fixtureId !== undefined && {
        fixture: data.fixtureId
          ? { connect: { id: data.fixtureId } }
          : { disconnect: true },
      }),
      ...(data.rawMaterialId !== undefined && {
        rawMaterial: data.rawMaterialId
          ? { connect: { id: data.rawMaterialId } }
          : { disconnect: true },
      }),
      ...(data.ncProgramId !== undefined && {
        ncProgram: data.ncProgramId
          ? { connect: { id: data.ncProgramId } }
          : { disconnect: true },
      }),
    };

    if (data.setupSheetFile) {
      const result = await this._fileStorageService.upload(
        data.setupSheetFile,
        S3BucketFolderConstants.UPLOADS,
      );
      updateData.setupSheet = result.url;
      updateData.setupSheetKey = result.key;
    }

    if (data.engineeringDrawingFile) {
      const result = await this._fileStorageService.upload(
        data.engineeringDrawingFile,
        S3BucketFolderConstants.UPLOADS,
      );
      updateData.engineeringDrawing = result.url;
      updateData.engineeringDrawingKey = result.key;
    }

    return await this._partRepository.update(id, updateData);
  }
}
