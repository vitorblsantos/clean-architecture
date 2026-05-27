import { Module } from '@nestjs/common'

import { ProfileModule } from '@app/profiles/profiles.module'

@Module({
  imports: [ProfileModule],
  exports: [ProfileModule],
})
export class AppModule {}
