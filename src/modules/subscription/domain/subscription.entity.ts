import { PlanType } from '@/shared/enums/plan-type.enum';
import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';

export class Subscription {
  constructor(
    public id: string,
    public tenantId: string,
    public plan: PlanType,
    public status: SubscriptionStatus,
    public startDate: Date,
    public endDate: Date,
    public trialUsed: boolean,
    public razorpaySubscriptionId: string | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}

// model Subscription {
//   id        String   @id @default(uuid()) @db.Uuid

//   tenantId  String   @db.Uuid @unique
//   tenant    Tenant   @relation(fields: [tenantId], references: [id])

//   plan      PlanType
//   status    SubscriptionStatus

//   startDate DateTime
//   endDate   DateTime

//   trialUsed Boolean  @default(false)

//   razorpaySubscriptionId String?

//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }
