import { ConsoleLogger, Injectable } from '@nestjs/common'

import { ILogger } from '@domain/logger/logger.interface'
import { EEnvironment } from '@domain/enums/environment.enum'
import { EnvironmentService } from '@infra/config/environment/environment.service'

@Injectable()
export class LoggerService extends ConsoleLogger implements ILogger {
  constructor(private readonly environmentService: EnvironmentService) {
    super()
  }

  debug(context: string, message: string) {
    if (this.environmentService.getAppEnvironment() === EEnvironment.Production) return

    super.debug(`[DEBUG] ${message}`, context)
  }

  error(context: string, message: string, trace?: string) {
    super.error(`[ERROR] ${message}`, trace, context)
  }

  log(context: string, message: string) {
    super.log(`[INFO] ${message}`, context)
  }

  verbose(context: string, message: string) {
    if (this.environmentService.getAppEnvironment() === EEnvironment.Production) return

    super.verbose(`[VERBOSE] ${message}`, context)
  }

  warn(context: string, message: string) {
    super.warn(`[WARN] ${message}`, context)
  }
}
