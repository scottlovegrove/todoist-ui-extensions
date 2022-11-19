import { ActionsService as ActionsServiceBase } from '@doist/ui-extensions-server'

import { Module } from '@nestjs/common'

import { AdaptiveCardsModule } from '../adaptivecards/adaptivecards.module'

import { ActionsService } from './actions.service'

@Module({
    imports: [AdaptiveCardsModule],
    providers: [
        ActionsService,
        {
            provide: ActionsServiceBase,
            useExisting: ActionsService,
        },
    ],
    exports: [ActionsService, ActionsServiceBase],
})
export class ActionsModule {}
