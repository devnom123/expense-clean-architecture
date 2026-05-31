export interface TokenPayload {
  sub: string;
  email: string;
}

export interface ITokenService {
  sign(payload: TokenPayload): Promise<string>;
}
