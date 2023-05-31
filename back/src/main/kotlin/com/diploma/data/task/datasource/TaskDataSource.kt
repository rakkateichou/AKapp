package com.diploma.data.task.datasource

import com.diploma.data.task.TaskEntity

interface TaskDataSource {
    suspend fun searchTasks(query: String, page: Int, subjects: List<String>): List<TaskEntity>
}