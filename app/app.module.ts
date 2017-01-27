import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule} from '@angular/http';
import {RouterModule, Routes} from '@angular/router';

import {BlogAppComponent} from './components/blog-app.component';
import {BlogHeaderComponent} from "./components/blog-header/blog-header.component";
import {BlogLogoComponent} from "./components/blog-header/blog-logo/blog-logo.component";
import {BlogHeaderMenuComponent} from "./components/blog-header/blog-header-menu/blog-header-menu.component";
import {BlogSearchComponent} from "./components/blog-header/blog-search/blog-search.component";
import {BlogThemeSelectorComponent} from "./components/blog-home/blog-theme-selector/blog-theme-selector.component";
import {BlogHomeComponent} from "./components/blog-home/blog-home.component";

const routes:Routes = [
    {path: 'home', component: BlogHomeComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: '**', redirectTo: 'home', pathMatch: 'full'}
];

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [
        BlogAppComponent,
        BlogHeaderComponent,
        BlogLogoComponent,
        BlogHeaderMenuComponent,
        BlogSearchComponent,
        BlogThemeSelectorComponent,
        BlogHomeComponent
    ],
    bootstrap: [BlogAppComponent]
})

export class AppModule {
}
