import { AppError } from '../utils/app-error.js';

export const errorHandler = (
  error: unknown,
  _req: any,
  res: any,
  _next: any
): void => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Unexpected server error' });
};
