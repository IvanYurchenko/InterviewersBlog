import {Component, Input, ElementRef} from "@angular/core";

@Component({
    selector: 'blog-theme-selector',
    templateUrl: './app/components/blog-home/blog-theme-selector/blog-theme-selector.component.html',
    styleUrls: ['./app/components/blog-home/blog-theme-selector/blog-theme-selector.component.css']
})

export class BlogThemeSelectorComponent {
    @Input() bgColor: string;
    @Input() logo: string;

    private content: string;

    constructor(el: ElementRef) {
        //el.nativeElement.style.backgroundColor = bgColor;
        //this.content = el.nativeElement.innerText;

    }
}