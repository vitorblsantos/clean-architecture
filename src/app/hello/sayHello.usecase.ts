import { ILogger } from '@domain/logger/logger.interface'
import { UserRepository } from '@domain/repositories/users.repositories'

export class SayHelloUseCase {
  constructor(
    private readonly logger: ILogger,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(id: string): Promise<string> {
    this.logger.log('SayHelloUseCase', 'Execute')

    const user = await this.userRepository.getUserById(id)

    if (!user) {
      this.logger.warn('SayHelloUseCase', `User with id ${id} not found`)
      return `User with id ${id} not found`
    }

    return `Hello, ${user.name}!`
  }
}
