import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Post } from 'src/model/post.model';
import { PostListComponent } from '../posts/post-list/post-list.component';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private _http: HttpClient) {}
  posts: Post[] = [];
  postSub = new Subject<{ posts: Post[]; postCount: number }>();

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?postsSize=${postsPerPage}&page=${currentPage}`;
    return this._http
      .get<{ message: string; postsData: any }>(
        `http://localhost:8000/api/posts${queryParams}`
      )
      .pipe(
        map((transPost) => {
          return {
            posts: transPost.postsData.posts.map((data: any) => {
              return {
                post: {
                  title: data.title,
                  content: data.content,
                  id: data._id,
                  creatorId: data.creator,
                },
              };
            }),
            postCount: transPost.postsData.maxCount,
          };
        })
      )
      .subscribe((postList: { posts: Post[]; postCount: number }) => {
        console.log(postList);
        this.posts = postList.posts;
        this.postSub.next({
          posts: [...this.posts],
          postCount: postList.postCount,
        });
      });
  }

  addPost(postData: Post) {
    this._http
      .post<{ message: string; id: string }>(
        'http://localhost:8000/api/sendPost',
        postData
      )
      .subscribe();
    /*  .subscribe((feedback: any) => {
        postData.id = feedback.id; // for adding id at the creation time
        this.posts.push(postData);
        this.postSub.next([...this.posts]);
      }); */
  }

  getSinglePost(id: string | null) {
    return this._http.get(`http://localhost:8000/api/post/${id}`);
  }

  updatePost(id: string | null, updatePost: any) {
    this._http
      .put(`http://localhost:8000/api/post/${id}`, updatePost)
      .subscribe();
    /* .subscribe((updateFeed) => {
        let updatedPost = JSON.parse(JSON.stringify(this.posts));
        const updateIndex = updatedPost.findIndex(
          (post: Post) => post.id === id
        );
        updatedPost[updateIndex] = {
          id,
          title: updatePost.title,
          content: updatePost.content,
        };
        this.posts = updatedPost;
        console.log(this.posts);
        this.postSub.next([...this.posts]);
      }); */
  }

  deletePost(postId: string) {
    return this._http.delete<{ message: string }>(
      `http://localhost:8000/api/post/${postId}`
    );
    /* .subscribe((message) => {
        console.log(message);
        this.posts = this.posts.filter((post) => post.id !== postId);
        this.postSub.next([...this.posts]);
      }); */
  }
}
