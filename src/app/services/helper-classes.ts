class FirebaseDocument {
  id: string;
}

export class TCSEntry extends FirebaseDocument {
  courseId: string; // course reference
  teacherId: string; // teacher reference
  sectionId: string; // sections included
}

// Actual Input
export class Course extends FirebaseDocument {
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
  needsComputerLab: boolean; // true = needs a computer lab
  needsElectricalLab: boolean; // true = needs an electrical lab
  needsProjector: boolean; // true = needs a working projector
  needsComputer: boolean; // true = needs a viper in class
}

export class Teacher extends FirebaseDocument {
  name: string;
  department: string;
}

export class Section extends FirebaseDocument {
  name: string; // A, C OR GR-1, GR-2
  strength: number; // Number of Students ~50
  batch: number; // the batch which the section belongs to
  department: string;
}

export class Room extends FirebaseDocument {
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
  hasComputer: boolean; // true = has a viper in class
}
