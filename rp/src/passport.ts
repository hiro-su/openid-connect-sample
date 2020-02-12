import passport from 'koa-passport';
import { Strategy } from 'openid-client';

export default class Passport {
  public client: any;
  public instance: any;

  constructor(issuer: any) {
    this.client = new issuer.Client({
      client_id: 'foo',
      client_secret: 'bar',
    });
    this.instance = passport;
  }

  oidc(config?: any) {
    const params = {
      redirect_uri: 'http://localhost:5000/auth/cb',
    };
    this.instance.use(
      'oidc',
      new Strategy({ client: this.client, params }, (tokenset: any, userinfo: any, done: any) => {
        console.log('tokenset', tokenset);
        console.log('access_token', tokenset.access_token);
        console.log('id_token', tokenset.id_token);
        console.log('claims', tokenset.claims);
        console.log('userinfo', userinfo);

        if (tokenset.claims.sub !== 'foo') return done(null);
        return done(null, tokenset.claims.sub);
      })
    );

    return this.instance.authenticate('oidc', config);
  }
}
