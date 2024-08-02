



// import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Res } from '@nestjs/common';
// import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
// import { UserService } from 'src/user/user.service';
// import { Response } from 'express';

// @Injectable()
// export class TokenInterceptor implements NestInterceptor {
//   constructor(private readonly userService: UserService) {}

//   intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
//     const request = context.switchToHttp().getRequest();
//     const response = context.switchToHttp().getResponse<Response>();

    
//     if (request.user) {
//       const { id, email,isAdmin } = request.user;
//       const token = this.userService.getAccessToken(email, id, response);

//       if (token) {
//         request.headers['Authorization'] = `Bearer ${token}`;
//         console.log(token)
//       }
//     }

//     return next.handle();
//   }
// }
