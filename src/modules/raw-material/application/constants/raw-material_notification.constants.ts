export const RAW_MATERIAL_NOTIFICATION = {
  LOW_STOCK: {
    title: 'Raw Material Low Stock Alert',
    message:
      'Raw material "{name}" has dropped below the minimum quantity threshold. Current quantity: {currentQty}, Minimum: {minQty}.',
  },
} as const;
