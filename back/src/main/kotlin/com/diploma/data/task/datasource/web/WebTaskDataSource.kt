package com.diploma.data.task.datasource.web

import com.diploma.data.task.TaskEntity
import com.diploma.data.task.datasource.TaskDataSource
import com.diploma.data.task.datasource.web.parsers.WebTaskParser

class WebTaskDataSource(private vararg val parsers: WebTaskParser) : TaskDataSource{

    override suspend fun searchTasks(query: String, page: Int, subjects: List<String>): List<TaskEntity> {
        val result = arrayListOf<TaskEntity>()
        for (parser in parsers) {
            parser.searchTasks(query, page, subjects).map(result::add)
        }
        result.shuffle()
        return result
    }

}