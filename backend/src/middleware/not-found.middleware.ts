
export const notFoundHandler = (_req: any, res: any): void => {
  res.status(404).json({ message: 'Route not found' });
};
