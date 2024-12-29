export interface MyJwtPayload {
    id: number;
    authorities: string;
    exp: number;
    iat: number;
    iss: string;
    sub: string;
    username: string;
  }