// src/mocks/handlers.js
import { rest } from 'msw'
import Cookies from 'js-cookie'
import { allPost } from './data'

//mock post data

export const handlers = [
  ///////////////////login///////////////////
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email } = req.body

    if (email !== 'email@email.com') {
      return res(ctx.status(401), ctx.json({ message: 'user not exist' }))
    }

    return res(
      ctx.status(200),
      ctx.json({
        _id: 'user1',
        username: 'doge',
        token: 'jwt',
        accessToken: 'accessToken',
        refreshToken: 'refreshToken',
      })
    )
  }),

  rest.post('/api/auth/refresh', (req, res, ctx) => {
    const { refreshToken } = req.body
    if (!refreshToken) {
      return res(
        ctx.status(401),
        ctx.json({ message: 'Refresh token not found, try again' })
      )
    }
    return res(
      ctx.status(200),
      ctx.json({ accessToken: 'refreshed-new-access-token' })
    )
  }),

  rest.post('/api/auth/protected', (req, res, ctx) => {
    let token = req.headers.headers['authorization']
    if (!token) {
      return res(ctx.status(401), ctx.json({ message: 'Access token expired' }))
    }
    return res(ctx.json({ message: 'protected content' }))
  }),

  ///////////////////signup///////////////////
  rest.post('/api/auth/signup', (req, res, ctx) => {
    const { email } = req.body
    if (email !== 'email@email.com') {
      return res(ctx.status(401), ctx.json({ message: 'signup failed' }))
    }

    return res(ctx.json({ message: 'signup success' }))
  }),

  ///////////////////all posts///////////////////
  rest.get('/api/posts', (req, res, ctx) => {
    const isAuthenticated = Cookies.get('accessToken')
    if (!isAuthenticated) {
      // If not authenticated, respond with a 403 error
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authorized',
        })
      )
    }
    // If authenticated, return a mocked user details
    return res(ctx.status(200), ctx.json(allPost))
  }),

  ///////////////////like one post///////////////////
  rest.post('/api/posts/like', (req, res, ctx) => {
    const like = req.body.like

    if (like === 1) {
      return res(ctx.status(200), ctx.json({ message: 'user liked' }))
    }
    if (like === 0) {
      return res(
        ctx.status(201),
        ctx.json({ message: 'user retrieved the like' })
      )
    }
    if (!like) {
      return res(ctx.status(401), ctx.json({ message: 'Like undefined' }))
    }
  }),
]
