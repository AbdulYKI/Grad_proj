import { MessagesThreadResolver } from "../resolvers/messages-thread.resolver";
import { ViewProfileResolver } from "./../resolvers/view-profile.resolver";
import { ViewProfileResolverData } from "./helper/resolvers-data/view-profile-resolver-data";
import { ViewProfileComponent } from "./profile/view-profile/view-profile.component";
import { ViewPostResolverData } from "./helper/resolvers-data/view-post-resolver-data";
import { ViewPostComponent } from "./posts/view-post/view-post.component";
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
import { MessageCardComponent } from "./message-card/message-card.component";

const routes: Routes = [
  { path: "home", component: HomeComponent },
  {
    path: "profile",
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children: [
      {
        path: "edit",
        component: EditProfileComponent,
        canDeactivate: [PreventUnsavedChangesGuardForEditProfile],
        resolve: { editProfileResolverData: EditProfileResolver },
      },
    ],
  },

  {
    path: "sign-in",
    component: SignInComponent,
  },
  {
    path: "profile/:id",
    component: ViewProfileComponent,
    resolve: { viewProfileResolverData: ViewProfileResolver },
  },
  {
    path: "sign-up",
    component: SignUpComponent,
  },
  {
    path: "post",
    runGuardsAndResolvers: "always",
    component: PostsListComponent,
    resolve: { postsPaginationResult: PostsListResolver },
    canDeactivate: [PreventUnsavedChangesGuardForCreatePost],
  },
  {
    path: "post/:id",
    component: ViewPostComponent,
    resolve: { viewPostResolverData: ViewPostResolver },
    canDeactivate: [PreventUnsavedChangesGuardForCreatePost],
  },
  {
    path: "chat/:recipientId",
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    component: MessageCardComponent,
    resolve: { messagesThreadResolverData: MessagesThreadResolver },
  },

  { path: "**", redirectTo: "home", pathMatch: "full" },
];

export const MyRoutes = RouterModule.forRoot(routes);
