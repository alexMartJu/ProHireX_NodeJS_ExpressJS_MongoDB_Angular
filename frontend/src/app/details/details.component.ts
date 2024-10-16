import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService, Comments, CommentsService, User, Profile, Job } from '../core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {

  job!: Job;
  slug!: string | null;
  author!: Profile;
  logged!: boolean;
  currentUser!: User;
  canModify!: boolean;
  comments!: Comments[];
  commentControl = new FormControl();
  commentFormErrors = {};
  isSubmitting = false;
  isDeleting = false;

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private cd: ChangeDetectorRef,
    private commentsService: CommentsService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      (data: any) => {
        this.slug = data.job.jobs.slug;
        this.job = data.job.jobs;
        this.author = data.job.jobs.author
        console.log(this.job);
        
        // Load the comments on this article
        this.populateComments();
        this.cd.markForCheck();

        this.userService.currentUser.subscribe(
          (userData: User) => {
            this.currentUser = userData;
              console.log(this.currentUser);
            this.canModify = (this.currentUser.username === this.job.author.username);
            console.log(this.canModify);
            this.cd.markForCheck();
          }
        );
      });

      this.userService.isAuthenticated.subscribe(
        (data) => {
            this.logged = data;
        }
      );
  }

  onToggleFavorite(favorited: boolean) {
    this.job.favorited = favorited;

    if (favorited) {
      this.job.favoritesCount++;
    } else {
      this.job.favoritesCount--;
    }
  }

  trackByFn(index: number, item: Comments) {
    return index;
  }

  onToggleFollowing(following: boolean) {
    this.author.following = following;
    // console.log(this.author.following);
  }

  populateComments() {
    this.commentsService.getAll(this.job.slug)
      .subscribe(comments => {
        this.comments = comments;
        console.log('Comentarios recibidos:', comments);
        this.cd.markForCheck();
      });
  }

  addComment() {
    console.log('Intentando añadir comentario...');
    this.isSubmitting = true;
    this.commentFormErrors = {};

    const commentBody = this.commentControl.value;
    if (!commentBody) {
      console.error('El comentario no puede estar vacío');
      this.isSubmitting = false;
      return;
    }

    const payload = { body: commentBody };
    
    this.commentsService
      .add(this.job.slug, payload)
      .subscribe(
        comment => {
          console.log('Comentario agregado:', comment);
          this.comments.unshift(comment);
          this.commentControl.reset('');
          this.isSubmitting = false;
          this.cd.markForCheck();
          location.reload();
        },
        errors => {
          console.error('Error al agregar el comentario:', errors);
          this.isSubmitting = false;
          this.commentFormErrors = errors;
          this.cd.markForCheck();
        }
      );
  }

  onDeleteComment(comment: Comments) {
    this.commentsService.destroy(comment.id, this.job.slug)
      .subscribe(
        success => {
          this.comments = this.comments.filter((item) => item !== comment);
          this.cd.markForCheck();
        }
      );
  }

  onFavoriteChange(updatedJob: Job) {
    this.job = updatedJob; // Actualiza el trabajo en el detalle
  }
}