import { Component } from '@angular/core';

@Component({
  selector: 'my-app',
  template: `
  <h1>My First Angular 2 App! Hello {{helloName}}!</h1>
  `
})

export class AppComponent {
  helloName: string = "Newcomer";
}

