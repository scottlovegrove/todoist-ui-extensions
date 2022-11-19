import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { SyncApiService } from './sync-api.service'
import { TodoistService } from './todoist.service'

@Module({
    imports: [HttpModule],
    providers: [TodoistService, SyncApiService],
    exports: [TodoistService],
})
export class TodoistModule {}
