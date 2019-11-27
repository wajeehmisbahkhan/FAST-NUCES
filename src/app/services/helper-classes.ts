class FirebaseDocument {
  id: string;

  constructor() {
    this.id = '';
  }
}
export class TCSEntry extends FirebaseDocument {
  name: string; // For ease only (GR1, C, B2)
  strength: number; // Strength for lecture
  courseId: string; // course reference
  // - Bilal will implement symmetry function to ensure the referenced courses can also clash with this one
  teacherIds: Array<string>; // teacher reference
  sectionIds: Array<string>; // sections included
  hasAtomicSections: boolean;

  constructor(
    name = '',
    courseId = '',
    teacherIds: Array<string> = [],
    sectionIds: Array<string> = [],
    hasAtomicSections = false
  ) {
    super();
    this.name = name;
    this.courseId = courseId;
    this.teacherIds = teacherIds;
    this.sectionIds = sectionIds;
    this.hasAtomicSections = hasAtomicSections;
  }
}

export class Lecture extends TCSEntry {
  day: string; // 0-4
  roomId: string;
  slot: string; // 0-7

  constructor(tcsEntry = new TCSEntry(), day = '', roomId = '', slot = '') {
    if (tcsEntry)
      super(
        tcsEntry.name,
        tcsEntry.courseId,
        tcsEntry.teacherIds,
        tcsEntry.sectionIds,
        tcsEntry.hasAtomicSections
      );
    else super();
    this.day = day;
    this.roomId = roomId;
    this.slot = slot;
  }
}

export class Constraint extends FirebaseDocument {
  pairedCourses: Array<Course>;
  constructor(pairedCourses: Array<Course> = []) {
    super();
    this.pairedCourses = pairedCourses;
  }
}

// Actual Input
export class Room extends FirebaseDocument {
  static maxRoomSize = 50; // ~ 45 rooms

  name: string; // CR-10, R-109
  capacity: number; // 50, 100
  availableSlots: Array<Array<boolean>>; // [Day][Time]

  constructor(name = '', availableSlots?: Array<Array<boolean>>) {
    super();
    this.name = name;
    if (!availableSlots) {
      // Fill with true by default
      const day = [];
      for (let i = 0; i < 5; i++) {
        // For each day
        const slot = [];
        for (let j = 0; j < 8; j++) {
          // For each slot
          slot.push(true); // 8 times
        }
        day.push(slot);
      }
      availableSlots = day;
    }
    this.availableSlots = availableSlots;
  }
}

export class Course extends FirebaseDocument {
  courseCode: string; // CS205
  department: string; // CS OR EE OR BBA
  title: string; // Computer Architecture, Theory Of Automata
  shortTitle: string; // CA, PROB, OS-LAB
  creditHours: number; // 1, 3, 4
  duration: number; // Hours of class a week
  isCoreCourse: boolean; // true = is a core course
  theoryCourseId: string; // Only filled if lab - only ICT-Lab is an exception
  prerequisiteIds: Array<string>; // Any courses that are required prior to this
  availableRooms: Array<string>; // [RoomId]
  availableSlots: Array<Array<boolean>>; // [Day][Time]

  constructor(
    courseCode = '',
    department = '',
    title = '',
    shortTitle = '',
    creditHours = 3,
    isCoreCourse = true,
    theoryCourseId = '',
    prerequisiteIds = [],
    availableRooms = [],
    availableSlots?: Array<Array<boolean>>
  ) {
    super();
    this.courseCode = courseCode;
    this.department = department;
    this.title = title;
    this.shortTitle = shortTitle;
    this.creditHours = creditHours;
    this.isCoreCourse = isCoreCourse;
    this.theoryCourseId = theoryCourseId;
    this.prerequisiteIds = prerequisiteIds;
    this.availableRooms = availableRooms;
    if (!availableSlots) {
      // Fill with true by default
      const day = [];
      for (let i = 0; i < 5; i++) {
        // For each day
        const slot = [];
        for (let j = 0; j < 8; j++) {
          // For each slot
          slot.push(true); // 8 times
        }
        day.push(slot);
      }
      availableSlots = day;
    }
    this.availableSlots = availableSlots;
  }
}

export class Teacher extends FirebaseDocument {
  name: string;
  department: string;
  availableRooms: Array<string>; // [RoomId]
  availableSlots: Array<Array<boolean>>; // [Day][Time]

  constructor(
    name = '',
    department = '',
    availableRooms = [], // [RoomId]
    availableSlots?: Array<Array<boolean>>
  ) {
    super();
    this.name = name;
    this.department = department;
    this.availableRooms = availableRooms;
    if (!availableSlots) {
      // Fill with true by default
      const day = [];
      for (let i = 0; i < 5; i++) {
        // For each day
        const slot = [];
        for (let j = 0; j < 8; j++) {
          // For each slot
          slot.push(true); // 8 times
        }
        day.push(slot);
      }
      availableSlots = day;
    }
    this.availableSlots = availableSlots;
  }
}

export class Section extends FirebaseDocument {
  name: string; // A1, A2, B1, B2... number of sections
  batch: number; // the batch which the section belongs to
  department: string;

  constructor(name = '', batch?: number, department = '') {
    super();
    this.name = name;
    this.batch = batch;
    this.department = department;
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
