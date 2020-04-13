import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { HomeComponent } from "./home/home.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { PreventUnsavedChangesGuard } from "./guards/prevent-unsaved-changes.guard";
import { EditProfileResolver } from "src/resolvers/edit-profile.resolver";
import { PostComponent } from './post/post.component';

const routes: Routes = [
  { path: "home", component: HomeComponent },
  {
    path: "user",
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children: [
      {
        path: "edit",
        component: EditProfileComponent,
        canDeactivate: [PreventUnsavedChangesGuard],
        resolve: { EditProfileResolverData: EditProfileResolver },
      },
    ],
  },

  {
    path: "sign-in",
    component: SignInComponent,
  },
  {
    path: "sign-up",
    component: SignUpComponent,
  },
  {
    path: "add-post",
    component: PostComponent,
  },
  { path: "**", redirectTo: "home", pathMatch: "full" },
];

export const MyRoutes = RouterModule.forRoot(routes);
