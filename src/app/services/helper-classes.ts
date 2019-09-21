// Helpful Primitives & Combos
export class Batch {
  id: number; // unique & assigned auto-inc
  year: number; // 2017
  strength: number; // Number of Students ~700

  sections: Array<Section>; // sections in the batch

  department: Department; // dept which the batch belongs to
}

export class Department {
  id: number; // unique & assigned auto-inc
  name: string; // Computer Science OR Electrical Eng
  shortName: string; // CS OR SE OR EE
  strength: number; // Number of Students ~1000

  batches: Array<Batch>; // batches in that department
}

export class CourseClass {
  id: number; // unique & assigned auto-inc
  strength: number; // sum of strengths of sections
  course: Course; // course reference
  teacher: Teacher; // teacher reference
  sections: Array<Section>; // sections included
}

// Actual Input
export class Course {
  courseCode: string; // CS205
  department: string; // CS OR EE OR BBA
  school: string; // CS OR EE OR MG OR MT OR SS
  title: string; // Computer Architecture, Theory Of Automata
  shortTitle: string; // CA, PROB, OS-LAB
  creditHours: number; // 1, 3, 4
  yearOffered: number; // 1, 2, 3, 4
  semesterOffered: number; // 1, 2, 8
  isCoreCourse: boolean; // true = is a core course
  /*
    Facilities
    Need to add more like language lab and EE & BBA stuff
  */
  isComputerLab: boolean; // true = is a computer lab
  isElectricalLab: boolean; // true = is an electrical lab
  hasProjector: boolean; // true = has a working projector
  hasAllInOne: boolean; // true = has a viper in class
}

export class Teacher {
  id: number;
  name: string;
  department: string;
  courseClasses: Array<CourseClass>;
}

export class Section {
  id: number; // unique & assigned auto-inc
  name: string; // A, C OR GR-1, GR-2
  strength: number; // Number of Students ~50

  courseClasses: Array<CourseClass>; // course classes the section is registered in

  batch: Batch; // the batch which the section belongs to
}

export class ClassRoom {
  capacity: number; // 50, 100
  name: string; // CR-10, R-109
  building: string; // CS, EE
  floor: number; // 0, 1, 2 (in EE)
  /*
    Facilities
    Need to add more like language lab and EE & BBA stuff
  */
  isComputerLab: boolean; // true = is a computer lab
  isElectricalLab: boolean; // true = is an electrical lab
  hasProjector: boolean; // true = has a working projector
  hasAllInOne: boolean; // true = has a viper in class
}
