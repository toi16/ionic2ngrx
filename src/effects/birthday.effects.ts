
import { Injectable } from '@angular/core';
import { Effect, Actions, toPayload } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Rx';

import { BirthdayService } from '../services/birthday.service';
import { Birthday } from '../models/birthday';
import { BirthdayActions } from '../actions/birthday.actions';

@Injectable()
export class BirthdayEffects {
    constructor(
        private action$: Actions,
        private db: BirthdayService,
        private birthdayActions: BirthdayActions
    ) { }

    @Effect() addBirthday$ = this.action$
        .ofType(BirthdayActions.ADD_BIRTHDAY)
        .map<Action, Birthday>(toPayload) //need action to set type of object
        .mergeMap(birthday => this.db.add(birthday));

    @Effect() updateBirthday$ = this.action$
        .ofType(BirthdayActions.UPDATE_BIRTHDAY)
        .map<Action, Birthday>(toPayload)
        .mergeMap(birthday => this.db.update(birthday));

    @Effect() deleteBirthday$ = this.action$
        .ofType(BirthdayActions.DELETE_BIRTHDAY)
        .map<Action, Birthday>(toPayload)
        .mergeMap(birthday => this.db.delete(birthday));


    allBirthdays$ = this.db.getAll()
        .map(birthdays => this.birthdayActions.loadBirthdaysSuccess(birthdays));

    changedBirthdays$ = this.db.getChanges()
        .map(change => {
            if (change._deleted) {
                return this.birthdayActions.deleteBirthdaySuccess(change._id);
            }
                else {
                    return this.birthdayActions.addUpdateBirthdaySuccess(change);
                }
            });

    @Effect() getBirthdays$ = Observable.concat(this.allBirthdays$, this.changedBirthdays$);
}
