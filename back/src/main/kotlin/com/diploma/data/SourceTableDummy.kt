package com.diploma.data

import org.jetbrains.exposed.sql.Database
import org.jetbrains.exposed.sql.SchemaUtils
import org.jetbrains.exposed.sql.Table
import org.jetbrains.exposed.sql.transactions.transaction

class SourceTableDummy(database: Database) {
    object Sources : Table() {
        val id = integer("id").autoIncrement().uniqueIndex()
        val name = text("name")
        val link = text("link")
        override val primaryKey = PrimaryKey(id)
    }

    init {
        transaction(database) {
            SchemaUtils.createMissingTablesAndColumns(Sources)
        }
    }
}