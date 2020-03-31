import { ProfileComponent } from "./profile/profile.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { HomeComponent } from "./home/home.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { PreventUnsavedChangesGuard } from "./guards/prevent-unsaved-changes.guard";

const routes: Routes = [
  { path: "", component: HomeComponent },
  {
    path: "",
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children: [
      {
        path: "profile",
        component: ProfileComponent,
        canDeactivate: [PreventUnsavedChangesGuard]
      }
    ]
  },

  {
    path: "sign-in",
    component: SignInComponent
  },
  {
    path: "sign-up",
    component: SignUpComponent
  },

  { path: "**", redirectTo: "", pathMatch: "full" }
];

export const MyRoutes = RouterModule.forRoot(routes);
