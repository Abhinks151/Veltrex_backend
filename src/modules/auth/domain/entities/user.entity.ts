import { Role } from '@/shared/enums/roles.enum';

export class User {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public password: string,
    public createdAt: Date,
    public updatedAt: Date,
    public role: Role,
    public isVerified: boolean,
    public isBlocked: boolean,
    public isDeleted: boolean,
    public profileImage?: string,
    public profileImageKey?: string,
  ) {
    this.userId = id;
    this.uuid = id;
  }

  public userId: string;
  public uuid: string;

  checkBlocked() {
    this.isBlocked = true;
  }

  canCreateTenant(): boolean {
    if (this.isBlocked) return false;
    if (!this.isVerified) return false;
    if (this.isDeleted) return false;
    if (this.role !== Role.ADMIN) return false;
    return true;
  }
}
