const { auth } = require('./app/_lib/auth');
export const config = {
  matcher: ['/account'],
};

export const middleware = auth;
