import { Component, EventEmitter, Input, Output, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Comments, User, UserService } from '../core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-details-comment',
  templateUrl: './details-comment.component.html',
  styleUrl: './details-comment.component.css'
})
export class DetailsCommentComponent implements OnInit, OnDestroy {

  constructor(
    private userService: UserService,
    private cd: ChangeDetectorRef
  ) {}

  private subscription!: Subscription;

  @Input() comment!: Comments;
  @Output() deleteComment = new EventEmitter<boolean>();

  canModify!: boolean;

  ngOnInit() {
    // Load the current user's data
    this.subscription = this.userService.currentUser.subscribe(
      (userData: User) => {
        this.canModify = (userData.username === this.comment.author.username);
        console.log(this.canModify);
        this.cd.markForCheck();
      }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  deleteClicked() {
    this.deleteComment.emit(true);
  }
}