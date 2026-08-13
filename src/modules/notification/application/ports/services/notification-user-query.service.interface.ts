export interface INotificationUserQueryService {
  findUserIdsByTenantAndRoles(
    tenantId: string,
    roles: string[],
  ): Promise<string[]>;
}
