package com.diploma.data.favorite

// дата класс для избранного
@kotlinx.serialization.Serializable
data class FavoriteEntity(
    val id: Long,
    val userId: Long,
    val question: String,
    val answer: String
)