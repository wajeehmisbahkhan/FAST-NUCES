import { Component, OnInit, Input } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { PopoverController } from '@ionic/angular';
import { Lecture } from 'src/app/services/helper-classes';

@Component({
  selector: 'app-swapper',
  templateUrl: './swapper.component.html',
  styleUrls: ['./swapper.component.scss']
})
export class SwapperComponent implements OnInit {
  // Inputs
  @Input() cell: Lecture;
  @Input() cellPosition: {
    day: number;
    roomId: string;
    slot: number;
  };
  @Input() timetable: Array<Lecture>;

  // The new cell
  selectedCell: Lecture;

  constructor(private server: ServerService, private poc: PopoverController) {}

  ngOnInit() {
    this.selectedCell = JSON.parse(JSON.stringify(this.cell));
  }

  swapCells() {
    // Get cell indexes
    const cellIndex = this.getCellIndexById(this.cell.id);
    const selectedCellIndex = this.getCellIndexById(this.selectedCell.id);
    // Swap
    const tempCell = this.timetable[cellIndex];
    this.timetable[cellIndex] = this.timetable[selectedCellIndex];
    this.timetable[selectedCellIndex] = tempCell;
    this.poc.dismiss();
  }

  cancel() {
    this.poc.dismiss();
  }

  getCellByCellPosition(day: number, roomId: string, slot: number) {}

  getCellIndexById(lectureId: string) {
    return this.timetable.findIndex(lecture => lecture.id === lectureId);
  }

  getColor(lecture: Lecture): string {
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

  get courses() {
    return this.server.courses;
  }

  get teachers() {
    return this.server.teachers;
  }

  get rooms() {
    return this.server.rooms;
  }

  get atomicSections() {
    return this.server.atomicSections;
  }
}
