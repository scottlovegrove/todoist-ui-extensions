import { Module } from '@nestjs/common'

import { ActionsModule } from '../actions/actions.module'

@Module({
    imports: [ActionsModule],
    exports: [ActionsModule],
})
export class SnippetAppModule {}
