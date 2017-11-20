import * as fromBookmark from '../../bookmarks/store/index';
import * as course from '../../course/store/index';
import * as fromLearningLayout from '../store/index';
import * as fromLearningPathList from '../../learning-path/store/index';
import { AuthService } from '../../../../common/services/auth.service';
import { Component, Input, OnInit } from '@angular/core';
import { PATH_DETAIL_PAGE } from '../store/actions/learning-path.layout.actions';
import { GET_BOOK_MARK_BY_USERID } from '../../bookmarks/store/actions/bookmark.actions';
import { StorageService } from '../../../../common/services/storage.service';
import { Store } from '@ngrx/store';
import { Course } from '../../course/store/reducers/course.reducers';
import { GET_COURSE_BY_LEARNING_PATH_ID } from '../../course/store/actions/course.actions';

@Component({
  selector: 'ota-learning-path-detail',
  templateUrl: './learning-path-detail.component.html',
  styleUrls: ['./learning-path-detail.component.scss']
})
export class LearningPathDetailComponent implements OnInit {
  isPathDetailPage: boolean;
  pathId: string;
  courseByPathId: Course;
  loading = true;
  learningPathDescription: string;
  userId: string;
  bookmark: any;
  isCourseDetailPage = false;
  constructor(
    private store: Store<any>,
    private storageService: StorageService) {
    this.userId = this.storageService.getCurrentUserId();
  }

  ngOnInit() {
    this.getBookmarkStatus();
    this.courseDetailPage();
  }

  togglePathPage() {
    this.store.dispatch({ type: PATH_DETAIL_PAGE, payload: false });
  }

  getDataFromLearningPath() {
    this.store
    .select(fromLearningPathList.selectLearningPathLayout)
    .subscribe((res: any) => {
      this.isPathDetailPage = res.isPathDetailPage;
      this.pathId = res.pathId;
      this.learningPathDescription = res.learningPathDescription;
    });
    this.store.dispatch({
      type: GET_COURSE_BY_LEARNING_PATH_ID,
      payload: this.pathId
    });
  }

  getCourseByPathId() {
    this.store
    .select(course.selectCourseByPathId)
    .subscribe(res => {
      this.courseByPathId = res;
    });
  }

  getBookmarkStatus() {
    this.store.dispatch({type: GET_BOOK_MARK_BY_USERID, payload: this.userId});
    this.store.select(fromBookmark.selectBookmarkByUserId).subscribe(res => {
      if (res) {
        this.bookmark = res;
        this.getDataFromLearningPath();
        this.getCourseByPathId();
        this.loading = false;
      }
    });
  }

  courseDetailPage() {
    this.store.select(course.selectCourseDetailPageState).subscribe(res => {
      res === true ? this.isCourseDetailPage = true : this.isCourseDetailPage = false;
    });
  }
}
