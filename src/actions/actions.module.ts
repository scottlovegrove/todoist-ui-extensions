import { ActionsService } from '@doist/ui-extensions-server'

import { Module } from '@nestjs/common'

import { ActionsModule as CompleteActionsModule } from '../mark-as-read/actions/actions.module'
import { ActionsModule as SnippetActionsModule } from '../snippet-helper/actions/actions.module'

import { DummyActionService } from './dummy-action.service'

@Module({
    imports: [SnippetActionsModule, CompleteActionsModule],
    providers: [
        DummyActionService,
        {
            provide: ActionsService,
            useExisting: DummyActionService,
        },
    ],
    exports: [ActionsService, SnippetActionsModule],
})
export class ActionsModule {}
