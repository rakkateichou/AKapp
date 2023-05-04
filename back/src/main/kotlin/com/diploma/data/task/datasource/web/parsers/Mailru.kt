package com.diploma.data.task.datasource.web.parsers

import com.diploma.data.task.TaskEntity

class Mailru : WebTaskParser {
    override fun getSubjectList(): List<String> {
        TODO("Not yet implemented")
    }

    override suspend fun searchTasks(query: String, page: Int, subjects: List<String>): List<TaskEntity> {
        TODO("Not yet implemented")
    }

}