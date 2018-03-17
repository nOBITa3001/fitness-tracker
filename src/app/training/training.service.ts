import { Exercise } from './exercise.model';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();

  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise;
  private exercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 8, date: new Date(), state: 'completed' },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15, date: new Date(), state: 'completed' },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18, date: new Date(), state: 'completed' },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8, date: new Date(), state: 'completed' }
  ];

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.db
      .collection('availableExercises')
      .snapshotChanges()
      .map(docArray => {
        return docArray.map(doc => {
          return {
            id: doc.payload.doc.id,
            name: doc.payload.doc.data().name,
            duration: doc.payload.doc.data().duration,
            calories: doc.payload.doc.data().calories
          };
        });
      })
      .subscribe((exercises: Exercise[]) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      });
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.exercises.push({
      ...this.runningExercise,
      date: new Date(),
      state: 'completed'
    });

    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.exercises.push({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'
    });

    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getCompletedOrCancelledExercises() {
    return this.exercises.slice();
  }
}
