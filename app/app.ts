import {Component, ViewChild} from '@angular/core';
import {MenuController, NavController, Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {SummaryPage} from './pages/summary/summary';
import {PostPage} from './pages/post/post';
import {FeedService} from './service/FeedService';

@Component({
    template: `<ion-menu [content]="menuContent">
            <ion-toolbar primary>
                <ion-title>நிசப்தம்</ion-title>
            </ion-toolbar>
            <ion-content>
                <ion-list>
                    <button ion-item (click)="loadCategory('home')">முகப்பு</button>
                    <button ion-item (click)="loadCategory('அறக்கட்டளை')">அறக்கட்டளை</button>
                    <button ion-item (click)="loadCategory('பத்தி')">பத்தி</button>
                    <button ion-item (click)="loadCategory('புனைவு')">புனைவு</button>
                    <button ion-item (click)="loadCategory('நூல்முகம்')">நூல்முகம்</button>
                    <button ion-item (click)="loadCategory('கடிதங்கள்')">கடிதங்கள்</button>
                    <button ion-item (click)="loadPostPage()">வா.மணிகண்டன்</button>
                </ion-list>
            </ion-content>
        </ion-menu>
        <ion-nav #menuContent [root]="rootPage"></ion-nav>`,
    providers: [ FeedService ]
})
export class NisapthamApp {
    @ViewChild('menuContent') navController: NavController;
    private rootPage: any = SummaryPage;
    private postPage: any = PostPage;

    constructor(platform: Platform, private menuController: MenuController) {
        platform.ready().then(() => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            StatusBar.styleDefault();
        });
    }

    loadCategory(category: string) {
        this.menuController.close();
        this.navController.setRoot(SummaryPage, { 'category': category });
    }

    loadPostPage() {
        let postId: string = '111180933869870203';
        let postUrl: string = 'http://www.nisaptham.com/2005/03/blog-post_26.html';
        this.menuController.close();
        this.navController.push(this.postPage, { 'postId': postId, 'postUrl': postUrl });
    }

}

ionicBootstrap(NisapthamApp, null, {
    'platforms': {
        'ios': {
            'backButtonText': 'பின் செல்'
        }
    }
});
