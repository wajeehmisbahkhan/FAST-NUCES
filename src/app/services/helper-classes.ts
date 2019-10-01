class FirebaseDocument {
  id: string;
}

// Helpful Primitives & Combos
export class Batch extends FirebaseDocument {
  year: number; // 2017
  strength: number; // Number of Students ~700

  sections: Array<Section>; // sections in the batch

  department: Department; // dept which the batch belongs to
}

export class Department extends FirebaseDocument {
  name: string; // Computer Science OR Electrical Eng
  shortName: string; // CS OR SE OR EE
  strength: number; // Number of Students ~1000

  batches: Array<Batch>; // batches in that department
}

export class CourseClass extends FirebaseDocument {
  strength: number; // sum of strengths of sections
  course: Course; // course reference
  teacher: Teacher; // teacher reference
  sections: Array<Section>; // sections included
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
  isComputerLab: boolean; // true = is a computer lab
  isElectricalLab: boolean; // true = is an electrical lab
  hasProjector: boolean; // true = has a working projector
  hasAllInOne: boolean; // true = has a viper in class

  constructor(
    courseCode = '',
    department = '',
    school = '',
    title = '',
    shortTitle = '',
    creditHours = 3,
    yearOffered = null,
    semesterOffered = null,
    isCoreCourse = true,
    isComputerLab = false,
    isElectricalLab = false,
    hasProjector = false,
    hasAllInOne = false
  ) {
    super();
    this.courseCode = courseCode;
    this.department = department;
    this.school = school;
    this.title = title;
    this.shortTitle = shortTitle;
    this.creditHours = creditHours;
    this.yearOffered = yearOffered;
    this.semesterOffered = semesterOffered;
    this.isCoreCourse = isCoreCourse;
    this.isComputerLab = isComputerLab;
    this.isElectricalLab = isElectricalLab;
    this.hasProjector = hasProjector;
    this.hasAllInOne = hasAllInOne;
  }
}

export class Teacher extends FirebaseDocument {
  name: string;
  department: string;
  courseClasses: Array<CourseClass>;
}

export class Section extends FirebaseDocument {
  name: string; // A, C OR GR-1, GR-2
  strength: number; // Number of Students ~50

  courseClasses: Array<CourseClass>; // course classes the section is registered in

  batch: Batch; // the batch which the section belongs to
}

export class ClassRoom extends FirebaseDocument {
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
