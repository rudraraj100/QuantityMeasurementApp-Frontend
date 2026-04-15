import { Routes } from '@angular/router';
import { LoginComponent } from './components/login.component';
import { CalculatorComponent } from './components/calculator.component';
import { AuthCallbackComponent } from './components/auth-callback/auth-callback.component';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'calculator' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'auth/callback', component: AuthCallbackComponent },
  { path: 'calculator', component: CalculatorComponent },
  { path: '**', redirectTo: 'calculator' },
];