import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MessageBoxComponent } from '../message-box/message-box.component';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getMovies();
  }
  modifyFavoriteMovies(movie: any): void {
    let user = JSON.parse(localStorage.getItem('user') || '');
    let icon = document.getElementById(`${movie._id}-favorite-icon`);

    if (user.FavoriteMovies.includes(movie._id)) {
      this.fetchApiData.removeFavoriteMovie(user.Username, movie._id).subscribe(
        (res) => {
          icon?.setAttribute('fontIcon', 'favorite_border');

          console.log('del success');
          console.log(res);
          user.favoriteMovies = res.favoriteMovies;
          localStorage.setItem('user', JSON.stringify(user));
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      // icon?.setAttribute("fontIcon", "favorite");
      // user.favoriteMovies.push(movie._id);
      // addFavoriteMovie return unauth, debugging
      this.fetchApiData.addFavoriteMovie(user.Username, movie._id).subscribe(
        (res) => {
          icon?.setAttribute('fontIcon', 'favorite');

          console.log('add success');
          console.log(res);
          user.favoriteMovies = res.favoriteMovies;
          localStorage.setItem('user', JSON.stringify(user));
        },
        (err) => {
          console.error(err);
        }
      );
    }
    localStorage.setItem('user', JSON.stringify(user));
  }

  getMovies(): void {
    console.log(localStorage.getItem('token'));
    this.fetchApiData
      .getAllMovies(localStorage.getItem('token'))
      .subscribe((resp: any) => {
        this.movies = resp;
        console.log(this.movies);
        return this.movies;
      });
  }
  showGenre(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
      data: {
        title: String(movie.Genre.Name),
        content: movie.Genre.Description,
      },
      width: '400px',
    });
  }
  showDirector(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
      data: {
        title: movie.Director.Name,
        content: movie.Director.Bio,
      },
      width: '400px',
    });
  }
  showDetail(movie: any): void {
    this.dialog.open(MessageBoxComponent, {
      data: {
        title: movie.Title,
        content: movie.Description,
      },
      width: '400px',
    });
  }
}
