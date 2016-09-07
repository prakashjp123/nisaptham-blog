import {Component, OnInit} from '@angular/core';
import {DomSanitizationService, SafeHtml} from '@angular/platform-browser';
import {NavController, NavParams} from 'ionic-angular';
import {FeedService} from '../../service/FeedService';
import {CommentsPage} from '../comments/comments';
import * as moment from 'moment';

@Component({
    templateUrl: 'build/pages/post/post.html'
})
export class PostPage implements OnInit {

    private commentsPage: any = CommentsPage;
    private postId: string;
    private postUrl: string;
    private post: Object;
    private postContent: SafeHtml;

    constructor(private navController: NavController,
        private navParams: NavParams,
        private sanitizer: DomSanitizationService,
        private feedService: FeedService) {
        this.postId = this.navParams.get('postId');
        this.postUrl = this.navParams.get('postUrl');
    }

    ngOnInit() {
        this.loadPost();
        // this.loadComments();
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

    loadPost() {
        this.feedService.getEntryRemote(this.postId)
            .subscribe(post => this.post = post);
        this.feedService.getPostContent(this.postUrl)
            .subscribe(content => {
                this.postContent = this.sanitizer.bypassSecurityTrustHtml(content);
            });
    }

    loadCommentsPage(postId: string) {
        let id: string = postId.substr(postId.lastIndexOf('-') + 1);
        this.navController.push(this.commentsPage, { postId: id });
    }

}
