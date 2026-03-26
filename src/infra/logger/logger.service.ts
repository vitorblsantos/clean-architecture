import { ConsoleLogger, Injectable } from '@nestjs/common'

import { ILogger } from '@domain/logger/logger.interface'

@Injectable()
export class LoggerService extends ConsoleLogger implements ILogger {
  debug(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.debug(`[DEBUG] ${message}`, context)
    }
  }

  error(context: string, message: string, trace?: string) {
    super.error(`[ERROR] ${message}`, trace, context)
  }

  log(context: string, message: string) {
    super.log(`[INFO] ${message}`, context)
  }

  verbose(context: string, message: string) {
    if (process.env.NODE_ENV !== 'production') {
      super.verbose(`[VERBOSE] ${message}`, context)
    }
  }

  warn(context: string, message: string) {
    super.warn(`[WARN] ${message}`, context)
  }
}
