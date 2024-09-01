import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { CoventryController } from './coventry.controller'

@Module({
    imports: [HttpModule],
    controllers: [CoventryController],
})
export class CoventryModule {}
