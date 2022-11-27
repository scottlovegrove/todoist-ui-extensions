import { Module } from '@nestjs/common'

import { SnippetService } from './snippet.service'

@Module({
    providers: [SnippetService],
    exports: [SnippetService],
})
export class SnippetModule {}
