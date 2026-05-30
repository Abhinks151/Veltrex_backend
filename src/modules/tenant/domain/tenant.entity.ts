export class Tenant {
  id: string;
  name: string;
  ownerId: string;
  isBlocked: boolean;
  isDeleted: boolean;
  trialUsed: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    name: string,
    ownerId: string,
    isBlocked: boolean,
    isDeleted: boolean,
    trialUsed: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.ownerId = ownerId;
    this.isBlocked = isBlocked;
    this.isDeleted = isDeleted;
    this.trialUsed = trialUsed;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
