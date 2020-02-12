import { Provider } from 'oidc-provider';

const issuer = 'http://localhost:5050';
const configuration = {
  // ... see available options /docs
  clients: [
    {
      client_id: 'foo',
      client_secret: 'bar',
      redirect_uris: ['http://localhost:5000/auth/cb'],
      scope: 'openid',
    },
  ],
};

const provider = new Provider(issuer, configuration);

console.log(provider.callback);
console.log(provider.app);

const server = provider.listen(5050, () => {
  console.log('oidc-provider listening on port 5050, check http://localhost:5050/.well-known/openid-configuration');
});
