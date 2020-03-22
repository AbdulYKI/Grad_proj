import { MyRoutes } from "./routes.routing";
import { JwtModule } from "@auth0/angular-jwt";
import { HomeComponent } from "./home/home.component";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RegisterComponent } from "./register/register.component";
import { NotFoundComponent } from "./not-found/not-found.component";
import { NavBarComponent } from "./nav-bar/nav-bar.component";
<<<<<<< HEAD
import { HttpClientModule } from "@angular/common/http";
export function tokenGetter() {
  return localStorage.getItem("gradPorjToken");
}
=======
import { ProfileComponent } from './profile/profile.component';

>>>>>>> 9955db16d79f493e1945f7266bf7a7fc45e422f1
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    NotFoundComponent,
    NavBarComponent,
    ProfileComponent
  ],
  imports: [
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
        whitelistedDomains: ["example.com"],
        blacklistedRoutes: ["example.com/examplebadroute/"]
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
