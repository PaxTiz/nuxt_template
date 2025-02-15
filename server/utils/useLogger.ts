import { join } from 'node:path';
import { createLogger, format, transports } from 'winston';

const BASE_DIRECTORY = join(process.cwd(), '.storage', 'logs');
const ERRORS_LOG = join(BASE_DIRECTORY, 'error.log');
const ALL_LOG = join(BASE_DIRECTORY, 'error.log');

export const useLogger = (service: string) => {
  const config = useRuntimeConfig();

  const logger = createLogger({
    transports: [
      new transports.File({
        level: 'error',
        filename: ERRORS_LOG,
        format: format.combine(
          format.timestamp(),
          format.splat(),
          format.json(),
        ),
      }),
    ],
  });

  if (config.public.environment === 'local') {
    logger.add(
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          format.splat(),
          format.prettyPrint({ colorize: true }),
          format.ms(),
        ),
      }),
    );
  } else {
    logger.add(
      new transports.File({
        filename: ALL_LOG,
        format: format.combine(
          format.timestamp(),
          format.splat(),
          format.json(),
        ),
      }),
    );
  }

  return logger.child({ service });
};
