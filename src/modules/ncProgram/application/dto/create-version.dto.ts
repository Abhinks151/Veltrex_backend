export interface AddVersionDto {
  programId: string;
  tenantId: string;
  createdBy: string;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  description?: string;
}
