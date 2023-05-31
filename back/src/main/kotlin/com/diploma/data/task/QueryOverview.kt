package com.diploma.data.task


data class QueryOverview(
    val query: String,
    val topSubjects: Map<String, Int>,
    val subjects: Map<String, Int>
)