export interface ITokenGenerator {
  generateToken(): string;
  hash(token: string): string;
}
