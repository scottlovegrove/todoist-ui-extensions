import {
    AdaptiveCardService as AdaptiveCardServiceBase,
    CoreModule,
} from '@doist/ui-extensions-server'

import { Module } from '@nestjs/common'

import { SnippetModule } from '../snippet/snippet.module'

import { AdaptiveCardsService } from './adaptivecards.service'

@Module({
    imports: [CoreModule, SnippetModule],
    providers: [
        AdaptiveCardsService,
        {
            provide: AdaptiveCardServiceBase,
            useExisting: AdaptiveCardsService,
        },
    ],
    exports: [AdaptiveCardsService, AdaptiveCardServiceBase],
})
export class AdaptiveCardsModule {}
