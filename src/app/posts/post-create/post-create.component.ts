import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PostService } from 'src/app/services/post.service';
import { Feedback } from 'src/model/feedback.model';
import { Post } from 'src/model/post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss'],
})
export class PostCreateComponent implements OnInit {
  //@Output() newPostEvent = new EventEmitter();
  title: string = '';
  comment: string = '';
  enteredPost: Post[] = [];
  post: Post;
  isLoading: boolean = false;
  private isEditMode: boolean = false;
  private editPostId: string | null = '';
  constructor(
    private _pService: PostService,
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.paramMap.subscribe((param: ParamMap) => {
      if (param.has('postId')) {
        this.editPostId = param.get('postId');
        this.isEditMode = true;
        this._pService.getSinglePost(this.editPostId).subscribe((post: any) => {
          this.isLoading = false;
          const { _id, title, content } = post;
          this.post = {
            id: _id,
            title,
            content,
          };
        });
      } else {
        this.isLoading = false;
        this.isEditMode = false;
        this.editPostId = '';
      }
    });
  }
  /* onAddingPost() {
    let sendingPost: Post = {
      id: Math.random() * 10,
      title: this.title,
      comment: this.comment,
    };
    this.newPostEvent.emit(sendingPost);
  } */
  onSubmit(formVal: NgForm) {
    if (formVal.invalid) {
      return;
    }
    this.isLoading = true;
    if (!this.isEditMode) {
      let sendingPost: Post = {
        id: '',
        title: formVal.form.value.title,
        content: formVal.form.value.comment,
      };
      this._pService.addPost(sendingPost);
    } else {
      const updatingPost: Post = {
        id: '',
        title: formVal.form.value.title,
        content: formVal.form.value.comment,
      };
      this._pService.updatePost(this.editPostId, updatingPost);
    }
    this.router.navigateByUrl('/');
    formVal.resetForm();
    //this.newPostEvent.emit(sendingPost);
  }
}
