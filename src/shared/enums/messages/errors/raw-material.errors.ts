export const RAW_MATERIAL_ERRORS = {
  RAW_MATERIAL_NOT_FOUND: 'Raw material not found',
  RAW_MATERIAL_NAME_TAKEN: 'Raw material name already exists, try another one',
  FAILED_TO_CREATE_RAW_MATERIAL: 'Failed to create raw material',
  FAILED_TO_UPDATE_RAW_MATERIAL: 'Failed to update raw material',
  RAW_MATERIAL_ALREADY_DELETED: 'Raw material is already deleted',
  RAW_MATERIAL_IN_USE:
    'Cannot delete raw material: it is currently associated with active parts',
  INSUFFICIENT_RAW_MATERIAL:
    'Insufficient raw material stock to fulfil this job quantity',
} as const;
