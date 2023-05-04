package com.diploma.data.task.datasource.web.parsers

import com.diploma.data.task.datasource.TaskDataSource

interface WebTaskParser : TaskDataSource {
    fun getSubjectList() : List<String>
}