export class Plan {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  durationDays: number | null;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(
    id: string,
    code: string,
    name: string,
    description: string | null,
    price: number,
    currency: string,
    durationDays: number | null,
    isBlocked: boolean,
    isDeleted: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.description = description;
    this.price = price;
    this.currency = currency;
    this.durationDays = durationDays;
    this.isBlocked = isBlocked;
    this.isDeleted = isDeleted;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
