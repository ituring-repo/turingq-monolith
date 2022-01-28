import Database from '@ioc:Adonis/Lucid/Database'
import test from 'japa'
import supertest from 'supertest'
import httpStatus from 'http-status'
import { Assert } from 'japa/build/src/Assert'

const BASE_URL = `http://${process.env.HOST}:${process.env.PORT}`

test.group('E2E -> Registration', (group) => {
  const requestHeaders = {
    'Content-Type': 'application/json',
  }

  const doRequest = async (
    data: Record<string, unknown>,
    method: string,
    url: string,
    expectedHttpStatus: number
  ): Promise<Record<string, unknown>> => {
    const response = await supertest(BASE_URL)
      [method](url)
      .send(data)
      .set(requestHeaders)
      .expect('Content-Type', /json/)
      .expect(expectedHttpStatus)

    return JSON.parse(response.text)
  }

  const assertError = (result: Record<string, unknown>, message: string, assert: Assert) => {
    assert.isArray(result.errors)
    const errors = result.errors as Record<string, string>[]
    const errorInfo = errors.find((error: Record<string, string>) => error.message === message)
    assert.isTrue(errorInfo !== undefined)
  }

  group.beforeEach(async () => {
    const client = Database.connection()
    client.truncate('users', true)
  })

  test('should register a new user', async (assert: Assert) => {
    const data = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: '$3crEt_P@$$w0rD',
      password_confirmation: '$3crEt_P@$$w0rD',
    }

    const result = await doRequest(data, 'post', '/register', httpStatus.CREATED)

    assert.isUndefined(result.password)
    assert.isDefined(result.created_at)
    assert.isDefined(result.updated_at)
    assert.deepInclude(result, {
      name: data.name,
      email: data.email,
    })
  })

  test('should not save a user without a name', async (assert: Assert) => {
    const data = {
      email: 'john@doe.com',
      password: '$3crEt_P@$$w0rD',
      password_confirmation: '$3crEt_P@$$w0rD',
    }

    const result = await doRequest(data, 'post', '/register', httpStatus.UNPROCESSABLE_ENTITY)

    assertError(result, 'The full name is required to create a new account', assert)
  })

  test('should not save a user without an email', async (assert: Assert) => {
    const data = {
      name: 'John Doe',
      password: '$3crEt_P@$$w0rD',
      password_confirmation: '$3crEt_P@$$w0rD',
    }

    const result = await doRequest(data, 'post', '/register', httpStatus.UNPROCESSABLE_ENTITY)

    assertError(result, 'You must inform a valid email', assert)
  })

  test('should not register the same email twice', async (assert: Assert) => {
    const data = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: '$3crEt_P@$$w0rD',
      password_confirmation: '$3crEt_P@$$w0rD',
    }

    await doRequest(data, 'post', '/register', httpStatus.CREATED)
    const result = await doRequest(data, 'post', '/register', httpStatus.UNPROCESSABLE_ENTITY)

    assertError(result, 'The informed email is already registered', assert)
  })

  test('should not save a user without a password', async (assert: Assert) => {
    const data = {
      name: 'John Doe',
      email: 'john@doe.com',
      password_confirmation: '$3crEt_P@$$w0rD',
    }

    const result = await doRequest(data, 'post', '/register', httpStatus.UNPROCESSABLE_ENTITY)

    assertError(result, 'The password is required', assert)
  })

  test('should ensure the password and the password confirmation are equal', async (assert: Assert) => {
    const data = {
      name: 'John Doe',
      email: 'john@doe.com',
      password: '$3crEt_P@$$w0rD',
      password_confirmation: 'another_P@$$w0rD',
    }

    const result = await doRequest(data, 'post', '/register', httpStatus.UNPROCESSABLE_ENTITY)

    assertError(result, 'The informed passwords do not match', assert)
  })
})
