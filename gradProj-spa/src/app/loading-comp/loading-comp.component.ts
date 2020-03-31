import { Component, OnInit } from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';

@Component({
  selector: 'app-loading-comp',
  templateUrl: './loading-comp.component.html',
  styleUrls: ['./loading-comp.component.css']
})
export class LoadingCompComponent implements OnInit {
  public loading_overlay = true;
  constructor(private router: Router) {
    router.events.subscribe((event:RouterEvent)=>{
      this.navigationInterceptor(event)
    })
   }

  ngOnInit(): void {
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading_overlay = true;
    }
    if (event instanceof NavigationEnd) {
      setTimeout(()=>{
        this.loading_overlay = false;
   }, 2500);
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.loading_overlay = false;
    }
    if (event instanceof NavigationError) {
      this.loading_overlay = false;
    }

}
}
