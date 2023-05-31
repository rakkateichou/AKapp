package com.diploma.data.task

@kotlinx.serialization.Serializable
data class TaskResponse(
    val taskEntity: TaskEntity,
    val isFavorite: Boolean,
    val favoriteCount: Long
)
