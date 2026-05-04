import { Module } from '@nestjs/common'

import { ProfileModule } from '@app/profile/profile.module'

@Module({
  imports: [ProfileModule],
  exports: [ProfileModule],
})
export class AppModule {}
