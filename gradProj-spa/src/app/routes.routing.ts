import { ViewPostComponent } from "src/app/posts/view-post/view-post/view-post.component";
import { PostsListResolver } from "./../resolvers/posts-list.resolver";
import { PreventUnsavedChangesGuardForCreatePost } from "./guards/prevent-unsaved-changes-for-create-post.guard";
import { EditProfileComponent } from "./profile/edit-profile/edit-profile.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { HomeComponent } from "./home/home.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { PreventUnsavedChangesGuardForEditProfile } from "./guards/prevent-unsaved-changes-for-edit-profile.guard";
import { EditProfileResolver } from "src/resolvers/edit-profile.resolver";
import { PostsListComponent } from "./posts/posts-list/posts-list.component";
import { ViewPostResolver } from "src/resolvers/post-view.resolver";

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
        canDeactivate: [PreventUnsavedChangesGuardForEditProfile],
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
    path: "post",
    runGuardsAndResolvers: "always",
    component: PostsListComponent,
    resolve: { postsList: PostsListResolver },
    canDeactivate: [PreventUnsavedChangesGuardForCreatePost],
  },
  {
    path: "post/:id",
    component: ViewPostComponent,
    resolve: { post: ViewPostResolver },
    canDeactivate: [PreventUnsavedChangesGuardForCreatePost],
  },

  { path: "**", redirectTo: "home", pathMatch: "full" },
];

export const MyRoutes = RouterModule.forRoot(routes);
