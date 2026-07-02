import { Module } from '@nestjs/common'

import { ProfileModule } from '@app/profiles/profiles.module'
import { LLMModule } from '@app/llm/llm.module'

@Module({
  imports: [LLMModule, ProfileModule],
  exports: [LLMModule, ProfileModule],
})
export class AppModule {}
