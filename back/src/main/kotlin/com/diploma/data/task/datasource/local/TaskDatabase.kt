package com.diploma.data.task.datasource.local

import com.diploma.data.task.TaskEntity
import com.diploma.data.task.datasource.TaskDataSource

interface TaskDatabase : TaskDataSource {
    suspend fun saveTask(taskEntity: TaskEntity): Int
    suspend fun removeTask(id: Int): Boolean
}