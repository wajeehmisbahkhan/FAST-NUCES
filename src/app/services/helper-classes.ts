import { ServerService } from './server.service';

class FirebaseDocument {
  id: string;

  constructor() {
    this.id = '';
  }
}

export class TCSEntry extends FirebaseDocument {
  name: string; // For ease only (GR1, C, B2)
  courseId: string; // course reference
  teacherIds: Array<string>; // teacher reference
  sectionIds: Array<string>; // sections included

  constructor(
    name = '',
    courseId = '',
    teacherIds: Array<string> = [],
    sectionIds: Array<string> = []
  ) {
    super();
    this.name = name;
    this.courseId = courseId;
    this.teacherIds = teacherIds;
    this.sectionIds = sectionIds;
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
  batch: number; // 2017, 2018
  semesterOffered: number; // 1, 2, 8
  isCoreCourse: boolean; // true = is a core course
  /*
    Facilities
    Need to add more like language lab and EE & BBA stuff
  */
  needsComputerLab: boolean; // true = needs a computer lab
  needsElectricalLab: boolean; // true = needs an electrical lab
  needsLanguageLab: boolean;

  constructor(
    courseCode = '',
    department = '',
    school = '',
    title = '',
    shortTitle = '',
    creditHours = 3,
    batch = null,
    semesterOffered = null,
    isCoreCourse = true,
    needsComputerLab = false,
    needsElectricalLab = false,
    needsLanguageLab = false
  ) {
    super();
    this.courseCode = courseCode;
    this.department = department;
    this.school = school;
    this.title = title;
    this.shortTitle = shortTitle;
    this.creditHours = creditHours;
    this.batch = batch;
    this.semesterOffered = semesterOffered;
    this.isCoreCourse = isCoreCourse;
    this.needsComputerLab = needsComputerLab;
    this.needsElectricalLab = needsElectricalLab;
    this.needsLanguageLab = needsLanguageLab;
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
    preferredSlots?: Array<boolean>
  ) {
    super();
    this.name = name;
    this.department = department;
    this.isSenior = isSenior;
    this.needsComputer = needsComputer;
    this.building = building;
    this.floor = floor;
    if (!preferredSlots) {
      const maxRoomSize = 30; // ~27
      preferredSlots = [];
      // Fill with true by default
      for (let i = 0; i < maxRoomSize * 5; i++) {
        preferredSlots.push(true);
      }
    }
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
  isLanguageLab: boolean; // true = has a working projector
  hasComputer: boolean; // true = has a viper in class

  constructor(
    name = '',
    isComputerLab = false,
    isElectricalLab = false,
    isLanguageLab = true,
    hasComputer = false
  ) {
    super();
    this.name = name;
    this.isComputerLab = isComputerLab;
    this.isElectricalLab = isElectricalLab;
    this.isLanguageLab = isLanguageLab;
    this.hasComputer = hasComputer;
  }
}

// Front End Specific Classes

/*
  Important!
  normalSection for viewing
  atomicSection for storing
  aggregateSection for in between
*/
export class AggregateSection {
  sections: Array<Section>;
  section: Section;
  constructor(sectionOne: Section, sectionTwo: Section) {
    // To store actual combination
    this.sections = [sectionOne, sectionTwo];
    // Will have same id as one
    this.section = JSON.parse(JSON.stringify(sectionOne)); // Could have used two as well
    // Id
    this.section.id = sectionOne.id + '\n' + sectionTwo.id; // Ids seperated using \n
    // Strength
    this.section.strength = sectionOne.strength + sectionTwo.strength;
    // Remove digits at end; C1 = C
    this.section.name = this.section.name.replace(/[0-9]/g, '');
  }

  static normalToAtomicSections(section: Section): Array<Section> {
    // Copy into two atomic sections
    const atomicSectionOne = JSON.parse(JSON.stringify(section)) as Section;
    const atomicSectionTwo = JSON.parse(JSON.stringify(section)) as Section;
    // Append 1 and 2; C => C1, C2
    atomicSectionOne.name += '1';
    atomicSectionTwo.name += '2';
    // Divide strength with floor and ceil
    atomicSectionOne.strength = Math.floor(section.strength / 2);
    atomicSectionTwo.strength = Math.ceil(section.strength / 2);
    // Return as array
    return [atomicSectionOne, atomicSectionTwo];
  }

  static atomicToAggregateSections(
    atomicSections: Array<Section>
  ): Array<AggregateSection> {
    const aggregateSections = [];
    while (atomicSections.length > 0) {
      // Assume C1
      const atomicSectionOne = atomicSections.shift();
      // Search for C2
      const atomicSectionTwoIndex = atomicSections.findIndex(
        section =>
          section.batch === atomicSectionOne.batch &&
          section.department === atomicSectionOne.department &&
          section.name.replace(/[0-9]/g, '') ===
            atomicSectionOne.name.replace(/[0-9]/g, '')
      );
      let atomicSectionTwo: Section;
      // If not found - in case of currently adding a new section to the database
      if (atomicSectionTwoIndex === -1) {
        // Placeholder section
        atomicSectionTwo = atomicSectionOne;
      } else {
        atomicSectionTwo = atomicSections.splice(atomicSectionTwoIndex, 1)[0];
      }
      // Push both after combining
      aggregateSections.push(
        new AggregateSection(atomicSectionOne, atomicSectionTwo)
      );
    }
    return aggregateSections;
  }

  static aggregateToNormalSections(
    aggregateSections: Array<AggregateSection>
  ): Array<Section> {
    const sections: Array<Section> = [];
    aggregateSections.forEach(aggregateSection => {
      sections.push(aggregateSection.section);
    });
    return sections;
  }
}

// Common helping functions
export function sortAlphaNum(a: string, b: string) {
  const reA = /[^a-zA-Z]/g;
  const reN = /[^0-9]/g;
  const aA = a.replace(reA, '');
  const bA = b.replace(reA, '');
  if (aA === bA) {
    const aN = parseInt(a.replace(reN, ''), 10);
    const bN = parseInt(b.replace(reN, ''), 10);
    return aN < bN ? -1 : 1;
  }
  return aA > bA ? 1 : -1;
}
