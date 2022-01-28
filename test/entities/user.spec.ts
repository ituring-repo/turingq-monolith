import Database from '@ioc:Adonis/Lucid/Database'
import test from 'japa'

import User from 'App/Models/User'

test.group('Entities -> User', (group) => {
  const createUser = () => {
    const user = new User()
    user.name = 'John Doe'
    user.email = 'john@doe.com'
    user.password = 'secret'

    return user
  }

  group.beforeEach(async () => {
    const client = Database.connection()
    await client.truncate('users', true)
  })

  test('save a new user', async (assert) => {
    const user = createUser()
    await user.save()

    const savedUser = await User.find(user.id)
    assert.notStrictEqual(savedUser, user)
  })

  test('retrieve the correct user', async (assert) => {
    const user1 = createUser()
    await user1.save()

    const user2 = createUser()
    user2.name = 'Agata Doe'
    user2.email = 'agata@doe.com'
    await user2.save()

    const retrievedUser1 = await User.find(user1.id)
    const retrievedUser2 = await User.find(user2.id)
    assert.equal(user1.name, retrievedUser1!.name)
    assert.equal(user2.name, retrievedUser2!.name)
  })

  test('update a user', async (assert) => {
    const user = createUser()
    await user.save()

    const savedUser = await User.find(user.id)
    assert.isNotNull(savedUser)

    savedUser!.name = 'John H. Doe'
    await savedUser!.save()

    const updatedUser = await User.find(user.id)
    assert.equal(updatedUser!.name, savedUser!.name)
  })

  test('delete a user', async (assert) => {
    const user = createUser()
    await user.save()

    const savedUser = await User.find(user.id)
    assert.isNotNull(savedUser)

    await savedUser!.delete()

    const userShouldNotExist = await User.find(user.id)
    assert.isNull(userShouldNotExist)
  })

  test('ensure user email is unique', async (assert) => {
    try {
      const user1 = createUser()
      await user1.save()

      const user2 = createUser()
      await user2.save()
    } catch ({ message }) {
      assert.include(message, 'violates unique constraint "users_email_unique"')
    }
  })

  test('ensure user password gets hashed during save', async (assert) => {
    const user = createUser()
    await user.save()

    assert.notEqual(user.password, 'secret')
  })
})
