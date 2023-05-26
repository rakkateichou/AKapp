package com.diploma.data.favorite

@kotlinx.serialization.Serializable
data class FavoriteEntity(
    val id: Int,
    val userId: Long,
    val question: String,
    val answer: String
)