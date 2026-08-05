export const S3_BUCKET_FOLDERS = {
  PROFILES: 'profiles',
  UPLOADS: 'uploads',
} as const;

export type S3BucketFolder =
  (typeof S3_BUCKET_FOLDERS)[keyof typeof S3_BUCKET_FOLDERS];

/** @deprecated Use S3_BUCKET_FOLDERS */
export const S3BucketFolderConstants = S3_BUCKET_FOLDERS;
