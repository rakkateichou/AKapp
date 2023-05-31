package com.diploma.data.task

// дата класс для ответа на запрос
@kotlinx.serialization.Serializable
data class TaskResponse(
    val taskEntity: TaskEntity,
    val isFavorite: Boolean,
    val favoriteCount: Long
)
