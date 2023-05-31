package com.diploma.data.user

import kotlinx.serialization.Serializable

// дата класс для восстановления пароля
@Serializable
data class UserRestorePass(
    val login: String,
    val code: String,
    val password: String
)