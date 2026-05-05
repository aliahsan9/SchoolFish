import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { AcademicComponent } from './features/academic/academic.component';
import { BillingComponent } from './features/billing/billing.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { ExamsComponent } from './features/exams/exams.component';
import { FeesComponent } from './features/fees/fees.component';
import { ParentsComponent } from './features/parents/parents.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NotFoundComponent } from './features/public/not-found.component';
import { UnauthorizedComponent } from './features/public/unauthorized.component';
import { StudentsComponent } from './features/students/students.component';
import { TeachersComponent } from './features/teachers/teachers.component';
import { LandingComponent } from './features/public/landing/landing.component';
import { RegisterComponent } from './features/public/register/register.component';
import { LoginComponent } from './features/public/login/login.component';
import { ShellLayoutComponent } from './layout/layout/shell-layout/shell-layout.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'app',
    component: ShellLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'students', component: StudentsComponent, canActivate: [roleGuard], data: { roles: ['Admin', 'Teacher'] } },
      { path: 'teachers', component: TeachersComponent, canActivate: [roleGuard], data: { roles: ['Admin', 'Teacher'] } },
      { path: 'parents', component: ParentsComponent, canActivate: [roleGuard], data: { roles: ['Admin'] } },
      { path: 'fees', component: FeesComponent, canActivate: [roleGuard], data: { roles: ['Admin', 'Teacher'] } },
      { path: 'academic', component: AcademicComponent, canActivate: [roleGuard], data: { roles: ['Admin', 'Teacher'] } },
      { path: 'exams', component: ExamsComponent, canActivate: [roleGuard], data: { roles: ['Admin', 'Teacher'] } },
      { path: 'billing', component: BillingComponent, canActivate: [roleGuard], data: { roles: ['Admin'] } },
      { path: 'profile', component: ProfileComponent },
      { path: 'unauthorized', component: UnauthorizedComponent },
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' }
    ]
  },
  { path: '**', component: NotFoundComponent }
];
