import { Action } from '@ngrx/store';

import {
  TrainingActions,
  SET_AVAILABLE_TRAINING,
  SET_FINISHED_TRAINING,
  START_TRAINING,
  STOP_TRAINING
} from './training.actions';
import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeExercise: Exercise;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeExercise: null
};

export function trainingReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_TRAINING:
      return {
        ...state,
        availableExercises: action.payload
      };
    case SET_FINISHED_TRAINING:
      return {
        ...state,
        finishedExercises: action.payload
      };
    case START_TRAINING:
      return {
        ...state,
        activeExercises: action.payload
      };
    case STOP_TRAINING:
      return {
        ...state,
        activeExercises: null
      };
    default:
      return  state;
  }
}

export const getAvailableExercises = (state: TrainingState) => state.availableExercises;
export const getFinishedExercises = (state: TrainingState) => state.finishedExercises;
export const getActiveExercise = (state: TrainingState) => state.activeExercise;
