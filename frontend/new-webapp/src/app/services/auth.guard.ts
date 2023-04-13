import { inject } from "@angular/core";
import { UsersHttpService } from "./users-http.service"
import { Router } from "@angular/router";

export const AuthGuard = () => {
  const authService = inject(UsersHttpService);
  const router = inject(Router);

  if (authService.user.value){
    return true;
  }

  return router.parseUrl('/login');
}