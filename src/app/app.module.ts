import { Module } from '@nestjs/common'

import { LLMModule } from '@app/llm/llm.module'
import { ProfileModule } from '@app/profiles/profiles.module'

@Module({
  imports: [LLMModule, ProfileModule],
  exports: [LLMModule, ProfileModule],
})
export class AppModule {}
