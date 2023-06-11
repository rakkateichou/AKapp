package com.diploma.data.task

import kotlinx.serialization.Serializable

// дата класс для задачи
@Serializable
data class TaskEntity(
    val id: Long = 0,
    val question: String,
    val answer: String,
    val subjectName: String? = ""
)