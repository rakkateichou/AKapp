package com.diploma.data.user

import kotlinx.serialization.Serializable

@Serializable
data class UserKnownNewPass(
    val oldPassword: String,
    val newPassword: String
)