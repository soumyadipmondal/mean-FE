import { Component, OnInit } from '@angular/core';
import { Post } from 'src/model/post.model';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Social Network';
  constructor(private _authServ: AuthService) {}
  ngOnInit(): void {
    this._authServ.autoAuthUser();
  }
  /* addPost: Post[] = [];

  addNewPost(val: any) {
    console.log(val);
    this.addPost.push(val);
  } */
}
