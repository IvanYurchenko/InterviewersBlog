import {Component} from "@angular/core";

@Component({
    selector: 'blog-header',
    templateUrl: './app/components/blog-header/blog-header.component.html'
})

export class BlogHeaderComponent {
    private param: string = "Hello All";
}