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
import { NgxTinymceModule } from "ngx-tinymce";
/*-------------------------------------------------------------------------------------------------*/
import { AppComponent } from "./app.component";
import { SignInComponent } from "./sign-in/sign-in.component";
import { ProfileComponent } from "./profile/profile.component";
import { LoadingCompComponent } from "./loading-comp/loading-comp.component";
import { AuthService } from "./services/auth.service";
import { AlertifyService } from "./services/Alertify.service";
import { SignUpComponent } from "./sign-up/sign-up.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { AuthGuard } from "./guards/auth.guard";
import { PreventUnsavedChangesGuard } from "./guards/prevent-unsaved-changes.guard";
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
    ProfileComponent,
    LoadingCompComponent
  ],
  imports: [
    NgMultiSelectDropDownModule.forRoot(),
    NgxTinymceModule.forRoot({
      baseURL: "./assets/tinymce/"
    }),
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
        whitelistedDomains: ["localhost:5000"]
      }
    }),
    BrowserAnimationsModule
  ],
  providers: [
    AuthService,
    AlertifyService,
    PreventUnsavedChangesGuard,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
