// import { JwtPayload } from '.';

// export type JwtPayloadWithRt = JwtPayload & { refreshToken: string };

export type JwtPayloadWithRt = {
    email: string;
    sub: number;
    refreshToken: string   
};
  
