package com.diploma.data.user

import kotlinx.serialization.Serializable

// дата класс для изменения пароля
@Serializable
data class UserKnownNewPass(
    val oldPassword: String,
    val newPassword: String
)