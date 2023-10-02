// src/mocks/handlers.js
import { rest } from 'msw';

export const handlers = [
  rest.get('https://localhost:8000/hand', (req, res, ctx) => {
    console.log('Request intercepted:', req);
    return res(
      ctx.status(200),
      ctx.json({
        data: ['img37', 'img40', 'img72', 'img78']
      })
    );
  }),

  rest.put('https://localhost:8000/hand', (req, res, ctx) => {
    console.log('Request intercepted:', req);
    return res(
      ctx.status(200),
      ctx.json({
        data: ['img37']
      })
    );
  }),
];
