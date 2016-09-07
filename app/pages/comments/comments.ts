import {Component, OnInit} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {FeedService} from '../../service/FeedService';
import * as moment from 'moment';

@Component({
    templateUrl: 'build/pages/comments/comments.html'
})
export class CommentsPage implements OnInit {

    private postId: string;
    private comments: Array<Object>;
    private nextSet: number;
    private endLoading: boolean = false;

    constructor(private navController: NavController,
        private navParams: NavParams,
        private feedService: FeedService) {
        this.postId = this.navParams.get('postId');
    }

    ngOnInit() {
        this.loadComments();
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

    loadComments(refresher?: any) {
        this.nextSet = 1;
        this.feedService.getCommentsRemote(this.postId, this.nextSet)
            .subscribe(comments => {
                this.comments = comments;
                this.nextSet++;
                if (refresher) {
                    refresher.complete();
                }
            });
    }

    updateComments(infiniteScroll?: any) {
        this.feedService.getCommentsRemote(this.postId, this.nextSet)
            .subscribe(comments => {
                this.comments = this.comments.concat(comments);
                this.nextSet++;
                if (comments.length == 0) {
                    this.endLoading = true;
                }
                if (infiniteScroll) {
                    infiniteScroll.complete();
                }
            });
    }

}
