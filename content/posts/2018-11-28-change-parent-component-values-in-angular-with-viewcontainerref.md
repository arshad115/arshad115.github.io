---
title: "Change parent component values in Angular with ViewContainerRef"
category: Development
tags: 
  - angular
  - parent-child-communication
  - javascript
  - frontend
  - typescript
header:
  image: /assets/images/communication_header.jpg
  teaser: /assets/images/communication.jpg
comments: true
toc: false
---

Well there are many ways of parent child communication and interaction in angular, e.g.  [@Input binding](https://angular.io/api/core/Input ), [setter](https://angular.io/guide/component-interaction#intercept-input-property-changes-with-a-setter), [ngOnChanges()](https://angular.io/guide/component-interaction#intercept-input-property-changes-with-ngonchanges), [EventEmitter](https://angular.io/guide/component-interaction#parent-listens-for-child-event), [ via local variable](https://angular.io/guide/component-interaction#parent-interacts-with-child-via-local-variable), [@ViewChild()](https://angular.io/guide/component-interaction#parent-calls-an-viewchild), [via a service](https://angular.io/guide/component-interaction#parent-and-children-communicate-via-a-service), and so on...

![ViewRefContainer]({{ "/assets/images/posts/shipping-containers.jpg" | absolute_url }})

We will look at communication via [ViewContainerRef ](https://angular.io/api/core/ViewContainerRef). ViewContainerRef represents a container where one or more views can be attached to a component. 

The concept is pretty straightforward, get the reference of the (parent) view container and modify the values, or call a method. Now lets look at the code:

Lets say we have a variable `Name` in the `ParentComponent` and we want to modify it from `ChildComponent` using the method `SayMyName()`.

````ts
export class ChildComponent {
  constructor(private viewContainerRef: ViewContainerRef) { }
  getParentComponent(): ParentComponent{
        return this.viewContainerRef[ '_data' ].componentView.component.viewContainerRef[ '_view' ].component
    }
  SayMyName() {
    this.getParentComponent().Name = 'My name is Slim Shady!';
  }
}
````

Its as simple as that!

You can also view this example on [Stackblitz](https://stackblitz.com/edit/angular-comms-hhbmvs).

Support me with ETH: `0x681a83007bC52C0bF42B41263Dc498f9Ef7af02A` 
