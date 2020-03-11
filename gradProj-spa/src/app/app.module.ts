import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { AppComponent } from "./app.component";
import { LoginComponent } from './login/login.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { NotFoundComponent } from './not-found/not-found.component';



@NgModule({
  declarations: [AppComponent, LoginComponent, RegisterComponent, HomePageComponent, NotFoundComponent],
  imports: [BrowserModule, FontAwesomeModule,NgbModule,FormsModule,ReactiveFormsModule, AppRoutingModule ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
