const JwtPrivateKey = 'QSRY15RK1';
const JwtPublicKey = JwtPrivateKey;
export const JwtPrivateKeyToken = 'JwtPrivateKeyToken';
export const JwtPublicKeyToken = 'JwtPublicKeyToken';
export const AuthProviders = [
  {
    provide: JwtPrivateKeyToken,
    useValue: JwtPrivateKey,
  },
  {
    provide: JwtPublicKeyToken,
    useValue: JwtPublicKey,
  },
];
