import { ProfileListResolver } from "./../resolvers/profile-list.resolver";
import { ProfileListComponent } from "./profile/profile-list/profile-list.component";
import { MessagesListResovler } from "src/resolvers/messages-list.resolver";
import { MessagesListComponent } from "./messages/messages-list/messages-list.component";
import { MessagesThreadResolver } from "../resolvers/messages-thread.resolver";
import { ViewProfileResolver } from "./../resolvers/view-profile.resolver";
import { ViewProfileComponent } from "./profile/view-profile/view-profile.component";
import { ViewPostComponent } from "./posts/view-post/view-post.component";
import { PostsListResolver } from "./../resolvers/posts-list.resolver";
import { PreventUnsavedChangesGuardForCreatePost } from "./guards/prevent-unsaved-changes-for-create-post.guard";
import { EditProfileComponent } from "./profile/edit-profile/edit-profile.component";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { HomeComponent } from "./home/home.component";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./guards/auth.guard";
import { PreventUnsavedChangesGuardForEditProfile } from "./guards/prevent-unsaved-changes-for-edit-profile.guard";
import { EditProfileResolver } from "src/resolvers/edit-profile.resolver";
import { PostsListComponent } from "./posts/posts-list/posts-list.component";
import { ViewPostResolver } from "src/resolvers/post-view.resolver";
import { MessageThreadComponent } from "./messages/message-thread/message-thread.component";

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
    path: "message/:recipientId",
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    component: MessageThreadComponent,
    resolve: { messagesThreadResolverData: MessagesThreadResolver },
  },
  {
    path: "profile-list",
    runGuardsAndResolvers: "always",
    resolve: { profileListPaginationResult: ProfileListResolver },
    component: ProfileListComponent,
  },
  {
    path: "message",
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    component: MessagesListComponent,
    resolve: { messagesListResolverData: MessagesListResovler },
  },
  { path: "**", redirectTo: "home", pathMatch: "full" },
];

export const MyRoutes = RouterModule.forRoot(routes);
