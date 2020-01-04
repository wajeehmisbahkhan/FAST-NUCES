import { Component, OnInit, Input } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { PopoverController } from '@ionic/angular';
import {
  Lecture,
  TCSEntry,
  Room,
  ThreeDimensionalArray
} from 'src/app/services/helper-classes';

@Component({
  selector: 'app-swapper',
  templateUrl: './swapper.component.html',
  styleUrls: ['./swapper.component.scss']
})
export class SwapperComponent implements OnInit {
  // Inputs
  @Input() cell: Lecture; // Could be an empty cell (new Lecture)
  @Input() cellPosition: {
    day: number;
    roomIndex: number;
    slot: number;
  };
  @Input() viewTimetable: ThreeDimensionalArray<Lecture>;
  @Input() rooms: Array<Room>;

  // Local form usage
  selectedCellPosition: {
    day: number;
    roomIndex: number;
    slot: number;
  };

  constructor(private server: ServerService, private poc: PopoverController) {}

  ngOnInit() {
    // Deep copy
    this.selectedCellPosition = JSON.parse(JSON.stringify(this.cellPosition));
  }

  swapCells() {
    // Swap
    const tempCell = this.getCellByCellPosition(this.cellPosition);
    const { day, roomIndex, slot } = this.cellPosition;
    this.viewTimetable.set(
      day,
      roomIndex,
      slot,
      this.getCellByCellPosition(this.selectedCellPosition)
    );
    this.viewTimetable.set(
      this.selectedCellPosition.day,
      this.selectedCellPosition.roomIndex,
      this.selectedCellPosition.slot,
      tempCell
    );

    // TODO: Update on server

    this.poc.dismiss();
  }

  cancel() {
    this.poc.dismiss();
  }

  // If not found, return empty lecture
  getCellByCellPosition(cellPosition: {
    day: number;
    roomIndex: number;
    slot: number;
  }) {
    return this.viewTimetable.get(
      cellPosition.day,
      cellPosition.roomIndex,
      cellPosition.slot
    );
  }

  getColor(lecture: TCSEntry): string {
    if (!lecture || !lecture.courseId) return 'white';
    // Batch of any section
    const batch = this.getAtomicSectionById(lecture.atomicSectionIds[0]).batch;
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    let semester: number;
    // If Jan-Jun - freshies will remain freshies
    if (currentMonth < 6) semester = 1;
    else semester = 0;
    if (batch + semester === currentYear) {
      // Freshies
      return '#63FD4B';
    } else if (batch + semester === currentYear - 1) {
      // Sophomore
      return '#FF60C9';
    } else if (batch + semester === currentYear - 2) {
      // Junior
      return '#23B0EE';
    } else {
      // Senior
      return '#F5954A';
    }
  }

  getAtomicSectionById(id: string) {
    return this.atomicSections.find(section => section.id === id);
  }

  getTeacherById(id: string) {
    return this.teachers.find(teacher => teacher.id === id);
  }

  getCourseById(id: string) {
    return this.courses.find(course => course.id === id);
  }

  // The new cell
  get selectedCell(): TCSEntry {
    return this.getCellByCellPosition(this.selectedCellPosition);
  }

  get courses() {
    return this.server.courses;
  }

  get teachers() {
    return this.server.teachers;
  }

  get atomicSections() {
    return this.server.atomicSections;
  }
}
