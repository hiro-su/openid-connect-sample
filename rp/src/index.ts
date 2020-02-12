import Koa from 'koa';
import Router from 'koa-router';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import Passport from './passport';
import { Issuer } from 'openid-client';
import session from 'koa-session';

const app = new Koa();
const router = new Router();

Issuer.discover('http://localhost:5050').then(issuer => {
  const passport = new Passport(issuer);

  router.get('/users', ctx => {
    ctx.body = `
    <html>
      <body>
        <div>login success.</div>
        <a href="http://localhost:5050/session/end">logout</a>
      </body>
    </html>
    `;
  });

  router.get('/auth', passport.oidc());
  router.get(
    '/auth/cb',
    passport.oidc({
      successRedirect: '/',
      failureRedirect: '/users',
    })
  );

  app.keys = ['your-session-secret'];
  app.use(
    session(
      {
        maxAge: 'session',
      },
      app
    )
  );

  app.use(logger());
  app.use(bodyParser({ enableTypes: ['json'] }));

  app.use(passport.instance.initialize());
  app.use(passport.instance.session());

  // ユーザ情報をセッションに保存するためにpassportにシリアライザ、デシリアライザを定義する

  passport.instance.serializeUser(function(user: any, done: any) {
    // 実際の処理ではセッション情報にはIDなどキーとなる情報のみ保存する
    done(null, user);
  });

  passport.instance.deserializeUser(function(id: any, done: any) {
    // 実際の処理ではセッション情報にもつIDなどからユーザ情報を取得する
    done(null, { client_id: id });
  });

  app.use(router.routes());
  app.use(router.allowedMethods());
  app.listen(5000);
});
