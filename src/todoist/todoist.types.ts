export type Project = {
    id: string
    name: string
    parent_id?: Project['id']
    inbox_project?: true
    team_inbox?: true
    color: string
    shared: boolean
}

export type Section = {
    id: string
    name: string
    project_id: Project['id']
    section_order: number
}

export type Task = {
    id: string
    content: string
    description: string
    project_id?: string
    section_id?: Section['id']
    parent_id?: Task['id']
    child_order: number
    priority: 1 | 2 | 3 | 4
    task_id?: Task['id']
}

export type ProjectData = {
    project: Project
    sections: Section[]
    items: Task[]
}

export type ProjectDataWithCompleted = ProjectData & {
    completedTasks: Task[]
}
