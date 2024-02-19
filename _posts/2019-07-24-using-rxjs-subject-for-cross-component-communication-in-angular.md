---
category: Development
tags: 
  - Angular
  - Subject
  - Cross Communication
  - Rxjs
  - Programming
header:
  image: https://miro.medium.com/max/1000/1*UJ68N887kfjee-bSvCIdIQ.png
  teaser: https://angular.io/assets/images/logos/angular/angular.svg
comments: true
---

Earlier I posted about [child to parent communication in angular](https://arshadmehmood.com/programming/change-parent-component-values-in-angular-with-viewcontainerref/), today we will take a look at cross component interaction in angular using `Subject` from the `rxjs` library.
We can declare the subject inside our component or another service if you like and subscribe to it to make the changes. Whenever you want to interact with it, just do it with the `next` method. Here is the `AppComponent` code:

```typescript
import { Component } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  private static subject = new Subject<any>();

  public static getSubject() {
    return AppComponent.subject;
  }

  ngOnInit() {
      AppComponent.getSubject().subscribe(()=>{
          this.doSomething();
      });
  }
    
  ngOnDestroy() {
	AppComponent.getSubject().unsubscribe();
  }
    
  public doSomething(): void {
    Console.log('Test');
  }
}
```

You can interact with this `Subject` from anywhere inside your angular app like this:

```typescript
AppComponent.getSubject().next();
```

