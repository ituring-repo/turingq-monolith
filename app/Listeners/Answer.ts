import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'
import { EventsList } from '@ioc:Adonis/Core/Event'

import Subscription from 'App/Models/Subscription'
import Question from 'App/Models/Question'
import User from 'App/Models/User'

export default class Answer {
  public async onNewAnswer(answer: EventsList['new:answer']) {
    const question = await Question.findOrFail(answer.questionId)

    const subscribedUsers = (
      await Subscription.query().select('user_id').where('question_id', '=', question.id)
    ).map((subscription: Subscription) => subscription.userId)

    const users = await User.query().whereIn('id', subscribedUsers)

    for (const user of users) {
      await Mail.sendLater((message) => {
        message
          .from(Env.get('MAIL_FROM'))
          .to(user.email)
          .subject('There is a new answer for a question you are subscribed!')
          .text(`Question: ${question.title}.\n\nAnswer: ${answer.body}`)
      })
    }
  }
}
