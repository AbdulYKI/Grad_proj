import { ProfileComponent } from "./profile/profile.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { HomeComponent } from "./home/home.component";
import { Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "SignIn",
    component: LoginComponent
  },
  {
    path: "SignUp",
    component: RegisterComponent
  },
  {
    path: "profile",
    component: ProfileComponent
  },
  {
    path: "404",
    component: NotFoundComponent
  },

  { path: "**", redirectTo: "404", pathMatch: "full" }
];

export const MyRoutes = RouterModule.forRoot(routes);
