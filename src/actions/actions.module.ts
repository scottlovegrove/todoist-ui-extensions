import { ActionsService } from '@doist/ui-extensions-server'

import { Module } from '@nestjs/common'

import { AICastingCallModule } from '../ai-casting-call/app/ai-casting-call-app.module'
import { ActionsModule as CompleteActionsModule } from '../mark-as-read/actions/actions.module'
import { ActionsModule as SnippetActionsModule } from '../snippet-helper/actions/actions.module'

import { DummyActionService } from './dummy-action.service'

@Module({
    imports: [SnippetActionsModule, CompleteActionsModule, AICastingCallModule],
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
