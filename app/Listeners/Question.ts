import { EventsList } from '@ioc:Adonis/Core/Event'

import Subscription from 'App/Models/Subscription'

export default class Question {
  public async onNewQuestion(question: EventsList['new:question']) {
    const subscription = new Subscription()
    subscription.userId = question.authorId
    subscription.questionId = question.id

    await subscription.save()
  }
}
