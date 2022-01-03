import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';
import { Post } from 'src/model/post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit, OnDestroy {
  //@Input() createdPosts: Post[] = [];
  createdPosts: any = [];
  isLoading: boolean = false;
  totalPosts: number = 10;
  postsPerPage: number = 2;
  currentPage: number = 1;
  pageSizeOptions = [1, 2, 5, 10];
  private authSub: Subscription;
  isAuthUser: boolean = false;
  loggedInUser: string;

  constructor(private _pService: PostService, private _authServ: AuthService) {}

  ngOnInit() {
    this.isLoading = true;

    this._pService.getPosts(this.postsPerPage, this.currentPage);
    this._pService.postSub.subscribe((immediateUpdate: any) => {
      //console.log(this.isLoading);
      this.totalPosts = immediateUpdate.postCount;
      this.isLoading = false;
      this.loggedInUser = this._authServ.getCreatorId();
      this.createdPosts = immediateUpdate.posts;
    });
    this.authSub = this._authServ.authSubs$.subscribe((isAuthValid) => {
      this.loggedInUser = this._authServ.getCreatorId();
      this.isAuthUser = isAuthValid;
    });
  }

  onPageChange(pageData: PageEvent) {
    this.postsPerPage = pageData.pageSize;
    this.currentPage = pageData.pageIndex + 1;
    this._pService.getPosts(this.postsPerPage, this.currentPage);
  }

  onDeletePost(postId: string) {
    this.isLoading = true;
    this._pService.deletePost(postId).subscribe(() => {
      this.isLoading = false;
      this._pService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  ngOnDestroy() {
    this.authSub.unsubscribe();
  }
}
