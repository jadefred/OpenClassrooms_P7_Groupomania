// src/mocks/handlers.js
import { rest } from 'msw'

export const handlers = [
  rest.post('/login', (req, res, ctx) => {
    // // Persist user's authentication in the session
    // sessionStorage.setItem('is-authenticated', 'true')

    const { email } = req.body

    if (email !== 'email@email.com') {
      return res(ctx.status(401), ctx.json({ success: false }))
    }

    return res(ctx.json({ success: true }))
  }),
]
