import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/Rx';

@Injectable()
export class FeedService {

    constructor(private http: Http) { }

    private postFeedUrl: string = "https://www.blogger.com/feeds/10674130/posts/default/--?alt=json";
    private postsFeedUrl: string = "https://www.blogger.com/feeds/10674130/posts/default?alt=json";
    private commentFeedUrl: string = "http://www.nisaptham.com/feeds/--/comments/default?alt=json";
    private entriesPerPage: number = 10;

/*
    getEntriesByCategoryLocal(category: string, pageNo: number): Array<Object> {
        let entries: Array<Object>;
        let rawEntries = localStorage.getItem('entries');
        if (rawEntries === null || rawEntries == undefined) {
            return null;
        }
        entries = JSON.parse(rawEntries);
        return entries.filter(function (entry: Object) {
            if ((!entry['category'] && category == 'home')|| entry['category'][0]['term'] == category)
                return true;
            return false;
        }).splice(((pageNo - 1) * this.entriesPerPage), this.entriesPerPage);
    }

    resetLocal(): boolean {
        localStorage.removeItem('entries');
        return true;
    }
*/

    getCommentsRemote(postId: string, pageNo: number): Observable<Array<Object>> {
        let startIndex: number = ((pageNo - 1) * this.entriesPerPage) + 1;
        let url: string = this.commentFeedUrl.replace("--", postId) + '&start-index=' + startIndex + '&max-results=' + this.entriesPerPage;

        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getEntryRemote(postId: string): Observable<Object> {
        let url: string = this.postFeedUrl.replace("--", postId);
        return this.http.get(url)
            .map(response => { return response.json().entry || {}; })
            .catch(this.handleError);
    }

    getPostContent(postUrl: string): Observable<string> {
        return this.http.get(postUrl)
            .map(this.extractPostContent)
            .catch(this.handleError);
    }

    getEntriesByCategoryRemote(category: string, pageNo: number): Observable<Array<Object>> {
        let startIndex: number = ((pageNo - 1) * this.entriesPerPage) + 1;
        let url: string = this.postsFeedUrl + '&start-index=' + startIndex + '&max-results=' + this.entriesPerPage;

        if (category != null && category != undefined && category != "home") {
            url += '&category=' + category;
        }

        return this.http.get(url)
            .map(this.extractData)
            .catch(this.handleError);
    }

/*
    preserveEntries(entries: Array<Object>) {
        let updatedEntries: Array<Object>;
        let rawLocalEntries: string = localStorage.getItem('entries');
        if (rawLocalEntries === null || rawLocalEntries == undefined) {
            updatedEntries = entries;
        } else {
            updatedEntries = JSON.parse(rawLocalEntries);
            updatedEntries = updatedEntries.concat(entries);
        }
        localStorage.setItem('entries', JSON.stringify(updatedEntries));
    }
*/

    private extractData(response: Response): Array<Object> {
        let result: any = response.json();
        let entries: Array<Object> = result.feed.entry || [];
        return entries;
    }

    private extractPostContent(response: Response): string {
        let htmlContent = response.text();
        let dom = new DOMParser().parseFromString(htmlContent, 'text/html');
        return new XMLSerializer().serializeToString(dom.querySelector(".post-body.entry-content"));
    }

    private handleError(error: any) {
        let errMsg = (error.message) ? error.message :
            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg);
        return Observable.throw(errMsg);
    }

}