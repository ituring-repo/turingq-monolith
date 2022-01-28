import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ChangeUserIdToUuid extends BaseSchema {
  protected tableName = 'users'

  public async up() {
    this.schema.alterTable('questions', (table) => {
      table.dropForeign('author_id')
    })

    this.schema.alterTable('answers', (table) => {
      table.dropForeign('author_id')
    })

    this.schema.alterTable('api_tokens', (table) => {
      table.dropForeign('user_id')
    })

    this.schema.alterTable('subscriptions', (table) => {
      table.dropForeign('user_id')
    })

    this.schema.table(this.tableName, (table) => {
      table.dropPrimary()
    })

    this.schema.table(this.tableName, (table) => {
      table.string('id').primary().alter()
    })

    this.schema.table('questions', (table) => {
      table.string('author_id').references('users.id').onDelete('CASCADE').alter()
    })

    this.schema.alterTable('answers', (table) => {
      table.string('author_id').references('users.id').onDelete('CASCADE').alter()
    })

    this.schema.alterTable('api_tokens', (table) => {
      table.string('user_id').references('users.id').onDelete('CASCADE').alter()
    })

    this.schema.alterTable('subscriptions', (table) => {
      table.string('user_id').references('users.id').onDelete('CASCADE').alter()
    })
  }

  public async down() {
    this.schema.alterTable('questions', (table) => {
      table.dropForeign('author_id')
    })

    this.schema.alterTable('answers', (table) => {
      table.dropForeign('author_id')
    })

    this.schema.alterTable('api_tokens', (table) => {
      table.dropForeign('user_id')
    })

    this.schema.alterTable('subscriptions', (table) => {
      table.dropForeign('user_id')
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.dropPrimary()
    })

    this.schema.alterTable(this.tableName, (table) => {
      table.integer('id').primary().alter()
    })

    this.schema.alterTable('questions', (table) => {
      table.integer('author_id').references('users.id').onDelete('CASCADE').alter()
    })

    this.schema.alterTable('answers', (table) => {
      table.integer('author_id').references('users.id').onDelete('CASCADE').alter()
    })

    this.schema.alterTable('api_tokens', (table) => {
      table.integer('user_id').references('users.id').onDelete('CASCADE').alter()
    })

    this.schema.alterTable('subscriptions', (table) => {
      table.integer('user_id').references('users.id').onDelete('CASCADE').alter()
    })
  }
}
