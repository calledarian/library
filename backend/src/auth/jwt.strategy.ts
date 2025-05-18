import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET, // Make sure this matches your JWT signing key
        });
    }

    async validate(payload: any) {
        // Whatever you return here will be available in `@Request().user`
        return {
            userId: payload.sub,
            username: payload.username,
        };
    }
}
