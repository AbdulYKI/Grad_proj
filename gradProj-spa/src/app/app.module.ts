import { SharedService } from "./services/shared.service";
import { UserService } from "src/app/services/user.service";
import { EditProfileResolver } from "src/resolvers/edit-profile.resolver";
import { environment } from "src/environments/environment";
import { MyRoutes } from "./routes.routing";
import { JwtModule } from "@auth0/angular-jwt";
import { HomeComponent } from "./home/home.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { EditorModule, TINYMCE_SCRIPT_SRC } from "@tinymce/tinymce-angular";
import { AngularMultiSelectModule } from "angular2-multiselect-dropdown";
/*-------------------------------------------------------------------------------------------------*/
import { AppComponent } from "./app.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { LoadingCompComponent } from "./loading-comp/loading-comp.component";
import { TextEditorComponent } from "./text-editor/text-editor.component";
import { AuthService } from "./services/auth.service";
import { AlertifyService } from "./services/alertify.service";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { AuthGuard } from "./guards/auth.guard";
import { PreventUnsavedChangesGuard } from "./guards/prevent-unsaved-changes.guard";
import { ErrorInterceptorProvider } from "./services/Interceptor.service";
import { FooterComponent } from "./footer/footer.component";
import { PostComponent } from "./post/post.component";
import { PhotoUploaderComponent } from './photo-uploader/photo-uploader.component';
import { SinglePostCardComponent } from './single-post-card/single-post-card.component';

export function tokenGetter() {
  return localStorage.getItem(environment.tokenName);
}
@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    HomeComponent,
    NotFoundComponent,
    NavBarComponent,
    EditProfileComponent,
    LoadingCompComponent,
    FooterComponent,
    TextEditorComponent,
    PostComponent,
    PhotoUploaderComponent,
    SinglePostCardComponent,
  ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    EditorModule,
    BrowserModule,
    FontAwesomeModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MyRoutes,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        blacklistedRoutes: ["localhost:5000/api/auth"],
        whitelistedDomains: ["localhost:5000"],
      },
    }),
    BrowserAnimationsModule,
    AngularMultiSelectModule,
  ],
  providers: [
    AuthService,
    AlertifyService,
    PreventUnsavedChangesGuard,
    AuthGuard,
    UserService,
    EditProfileResolver,
    ErrorInterceptorProvider,
    SharedService,
    { provide: TINYMCE_SCRIPT_SRC, useValue: "tinymce/tinymce.min.js" },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
