import {Component, OnInit} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {Network} from 'ionic-native';
import {FeedService} from '../../service/FeedService';
import {CommentsPage} from '../comments/comments';
import {PostPage} from '../post/post';
import * as moment from 'moment';

@Component({
  templateUrl: 'build/pages/summary/summary.html'
})
export class SummaryPage implements OnInit {

    private commentsPage: any;
    private postPage: any;
    private entries: Array<Object>;
    private category: string;
    private nextSet: number;
    private endLoading: boolean = false;

    constructor(private navController: NavController,
        private navParams: NavParams,
        private alertController: AlertController,
        private feedService: FeedService) {
        this.commentsPage = CommentsPage;
        this.postPage = PostPage;
        this.category = this.navParams.get('category') || 'home';
    }

    ngOnInit() {
        this.loadEntriesByCategory();
    }

    checkInternet() {
        console.log(Network.connection);
        if (Network.connection != 'none') {
            return true;
        } else {
            let alert = this.alertController.create({
                subTitle: 'இணைக்க முடியவில்லை',
                message: 'நீங்கள் இணையத்துடன் இணைப்பில் இல்லை. இணைப்பை சரிபார்த்து மீண்டும் முயற்சிக்கவும்.',
                buttons: ['சரி']
            });
            alert.present();
            return false;
        }
    }

    imageUrl(url: string): string {
        if (url.indexOf("img.youtube.com") != -1) {
            return url.replace("default.jpg", "0.jpg");
        } else if (url.indexOf("/s72-c/") != -1) {
            return url.replace("/s72-c/", "/s400-c/");
        } else {
            return url;
        }
    }

    formatDate(dateString: string): string {
        var date = moment(dateString);
        if (date.isValid()) {
            if (moment(new Date().getTime()).diff(date, 'days') >= 7) {
                return date.format('MMM D, YYYY');
            }
            return date.fromNow();
        }
        return 'Invalid Date';
    }

    loadEntriesByCategory(refresher?: any) {
        if (!this.checkInternet()) {
            if (refresher)
                refresher.complete();
            return;
        }

        this.nextSet = 1;
        this.feedService.getEntriesByCategoryRemote(this.category, 1)
            .subscribe(entries => {
                this.entries = entries;
                this.nextSet++;
                if (refresher) {
                    refresher.complete();
                }
            });
    }

    updateEntriesByCategory(infiniteScroll?: any) {
        if (!this.checkInternet()) {
            if (infiniteScroll)
                infiniteScroll.complete();
            return;
        }

        this.feedService.getEntriesByCategoryRemote(this.category, this.nextSet)
            .subscribe(entries => {
                this.entries = this.entries.concat(entries);
                this.nextSet++;
                if (entries.length == 0) {
                    this.endLoading = true;
                }
                if (infiniteScroll) {
                    infiniteScroll.complete();
                }
            });
    }

    reloadEntries(refresher: any) {
        this.loadEntriesByCategory(refresher);
    }

    loadCommentsPage(postId: string) {
        let id: string = postId.substr(postId.lastIndexOf('-') + 1);
        this.navController.push(this.commentsPage, { postId: id });
    }

    loadPostPage(postSummary: Object) {
        let id: string = postSummary['id']['$t'];
        let postId: string = id.substr(id.lastIndexOf('-') + 1);
        let postUrl: string = postSummary['link'].filter(item => { return item.rel == 'alternate'; })[0]['href'];
        this.navController.push(this.postPage, { 'postId': postId, 'postUrl': postUrl });
    }

}
