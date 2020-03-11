import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MustMatch } from '../helper/must-match.validator';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false;
  constructor(private formBuilder: FormBuilder) { }


  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      username:['',Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      gender:['',Validators.required]
  }, {
      validator: MustMatch('password', 'confirmPassword')
  });


}
//click submit btn =>

onSubmit(){
  this.submitted = true;
  //any error filed =>
  if (this.registerForm.invalid) {
    return;
}
//else => print info
else{
  console.log(this.registerForm);
  alert('Your Data  : )\n\n' + JSON.stringify(this.registerForm.value,null,6));
//.stringify => value json , replacer(null) ,space)
}

}


readyScreen() {
  //function load the form
  setTimeout(function () {
    this.splash.classList.add('out')
  }, 1100)
};

ngAfterViewInit(){
  this.readyScreen(); //call this method automatically after all Elements is load
}


get email(){
  return this.registerForm.get('email');
}
get username(){
  return this.registerForm.get('username');
}
get password(){
  return this.registerForm.get('password');
}
get confirmPassword(){
  return this.registerForm.get('confirmPassword');
}
get gender(){
  return this.registerForm.get('gender');
}



}
