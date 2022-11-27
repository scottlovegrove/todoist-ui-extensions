import { Module } from '@nestjs/common'

import { TodoistModule } from '../../todoist/todoist.module'
import { AdaptiveCardsModule } from '../adaptivecards/adaptivecards.module'

import { ActionsService } from './actions.service'

@Module({
    imports: [AdaptiveCardsModule, TodoistModule],
    providers: [ActionsService],
    exports: [ActionsService],
})
export class ActionsModule {}
