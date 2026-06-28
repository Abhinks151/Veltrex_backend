export interface ICheckRawMaterialAvailabilityUseCase {
  /**
   * Checks whether a raw material has enough currentQty for the required quantity.
   * @param rawMaterialId - The ID of the raw material to check.
   * @param requiredQty   - The quantity the job needs.
   * @returns true if sufficient stock exists, false otherwise.
   */
  execute(rawMaterialId: string, requiredQty: number): Promise<boolean>;
}
