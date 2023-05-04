package com.diploma.data.user.datasource

import com.diploma.data.user.User

interface UserDataSource {
    suspend fun register(user: User): Long
    suspend fun login(login: String, password: String): User?
}