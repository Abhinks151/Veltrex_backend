export interface InitialVersionDto {
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  description?: string;
}

export interface CreateNcProgramDto {
  tenantId: string;
  createdBy: string;
  name: string;
  initialVersion: InitialVersionDto;
}

export type UpdateNcProgramDto = Partial<CreateNcProgramDto>;
