class FirebaseDocument {
  id: string;

  constructor() {
    this.id = '';
  }
}

export class TCSEntry extends FirebaseDocument {
  courseId: string; // course reference
  teacherId: string; // teacher reference
  sectionId: string; // sections included

  constructor(courseId = '', teacherId = '', sectionId = '') {
    super();
    this.courseId = courseId;
    this.teacherId = teacherId;
    this.sectionId = sectionId;
  }
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
    needsComputerLab = false,
    needsElectricalLab = false,
    needsProjector = false,
    needsComputer = false
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
    this.needsComputerLab = needsComputerLab;
    this.needsElectricalLab = needsElectricalLab;
    this.needsProjector = needsProjector;
    this.needsComputer = needsComputer;
  }
}

export class Teacher extends FirebaseDocument {
  name: string;
  department: string;
  isSenior: boolean;
  needsComputer: boolean;
  building: string;
  floor: number;
  preferredSlots: Array<boolean>;

  constructor(
    name = '',
    department = '',
    isSenior = false,
    needsComputer = false,
    building = '',
    floor = 0,
    preferredSlots = []
  ) {
    super();
    this.name = name;
    this.department = department;
    this.isSenior = isSenior;
    this.needsComputer = needsComputer;
    this.building = building;
    this.floor = floor;
    this.preferredSlots = preferredSlots;
  }
}

export class Section extends FirebaseDocument {
  name: string; // A, C OR GR-1, GR-2
  strength: number; // Number of Students ~50
  batch: number; // the batch which the section belongs to
  department: string;

  constructor(name = '', strength?: number, batch?: number, department = '') {
    super();
    this.name = name;
    this.strength = strength;
    this.batch = batch;
    this.department = department;
  }
}

export class Room extends FirebaseDocument {
  name: string; // CR-10, R-109
  capacity: number; // 50, 100
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

  constructor(
    name = '',
    isComputerLab = false,
    isElectricalLab = false,
    hasProjector = true,
    hasComputer = false
  ) {
    super();
    this.name = name;
    this.isComputerLab = isComputerLab;
    this.isElectricalLab = isElectricalLab;
    this.hasProjector = hasProjector;
    this.hasComputer = hasComputer;
  }
}
