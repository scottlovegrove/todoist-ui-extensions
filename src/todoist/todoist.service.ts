import { Injectable } from '@nestjs/common'

import { getLastWeeksDates } from '../utils/date-utils'

import { SyncApiService } from './sync-api.service'

import type { Project, ProjectDataWithCompleted } from './todoist.types'

@Injectable()
export class TodoistService {
    constructor(private readonly syncApiService: SyncApiService) {}

    async getProjectData(projectId: Project['id']): Promise<ProjectDataWithCompleted> {
        const { start: since, end: until } = getLastWeeksDates()
        const projectData = await this.syncApiService.getProject(projectId)
        const completedTasks = await this.syncApiService.getCompletedForProject({
            projectId,
            since,
            until,
        })
        return { ...projectData, completedTasks }
    }
}
