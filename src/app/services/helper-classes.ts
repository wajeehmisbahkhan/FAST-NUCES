class FirebaseDocument {
  id: string;

  constructor() {
    this.id = '';
  }
}

class AssignedSlot {
  day: number;
  roomId: string;
  time: number;
}

export class TCSEntry extends FirebaseDocument {
  name: string; // For ease only (GR1, C, B2)
  strength: number; // Strength for lecture
  courseId: string; // course reference
  // - backend will implement symmetry function to ensure the referenced courses can also clash with this one
  teacherIds: Array<string>; // teacher reference
  atomicSectionIds: Array<string>; // sections included

  constructor(
    name = '',
    courseId = '',
    teacherIds: Array<string> = [],
    atomicSectionIds: Array<string> = []
  ) {
    super();
    this.name = name;
    this.courseId = courseId;
    this.teacherIds = teacherIds;
    this.atomicSectionIds = atomicSectionIds;
  }
}

export class Lecture extends TCSEntry {
  // Assigned by backend
  assignedSlots: Array<AssignedSlot>; // day, slot, roomId
  constructor() {
    super();
    this.assignedSlots = [];
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
    rooms?: Array<Room>,
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
    // Fill with room id
    if (rooms) this.availableRooms = rooms.map(room => room.id);
    else this.availableRooms = availableRooms;
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
    rooms?: Array<Room>,
    name = '',
    department = '',
    availableRooms = [], // [RoomId]
    availableSlots?: Array<Array<boolean>>
  ) {
    super();
    if (rooms) this.availableRooms = rooms.map(room => room.id);
    else this.availableRooms = availableRooms;
    this.name = name;
    this.department = department;
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

/*
  Important!
  normalSection for storing
  atomicSection and aggregateSection for viewing
  [atomicSection] will be sent to backend
*/
export class AtomicSection {
  // Custom generated id for backend
  id: string;
  // Normal attributes
  name: string;
  batch: number; // the batch which the section belongs to
  department: string;

  constructor(name = '', batch?: number, department = '') {
    this.name = name;
    this.batch = batch;
    this.department = department;
    // ID Generation
    // CS2016A1
    this.id = department + batch + name;
  }
}

export class AggregateSection {
  // Custom generated id for atomic section id generation
  id: string;
  // Normal attributes
  name: string;
  batch: number; // the batch which the section belongs to
  department: string;

  constructor(name = '', batch?: number, department = '') {
    this.name = name;
    this.batch = batch;
    this.department = department;
    // ID Generation
    // CS2016A
    this.id = department + batch + name;
  }
}

export class Section extends FirebaseDocument {
  numberOfSections: number; // A, B, C... number of sections
  batch: number; // the batch which the section belongs to
  department: string;

  constructor(numberOfSections?: number, batch?: number, department = '') {
    super();
    this.numberOfSections = numberOfSections;
    this.batch = batch;
    this.department = department;
  }

  // Takes a normal section and returns aggregate section based on number of sections
  static normalSectionToAggregateSections(section: Section) {
    const aggregateSections: Array<AggregateSection> = [];
    let letter = 'A';
    for (let i = 0; i < section.numberOfSections; i++) {
      const aggregateSection = new AggregateSection(
        letter,
        section.batch,
        section.department
      );
      aggregateSections.push(aggregateSection);
      // Next letter
      letter = String.fromCharCode(letter.charCodeAt(0) + 1);
    }
    return aggregateSections;
  }

  // Takes a normal section and returns atomic sections based on number of sections
  static normalSectionToAtomicSections(section: Section) {
    const atomicSections: Array<AtomicSection> = [];
    // First convert to aggregate sections
    const aggregateSections = this.normalSectionToAggregateSections(section);
    aggregateSections.forEach(aggregateSection =>
      atomicSections.push(
        ...this.aggregateSectionToAtomicSections(aggregateSection)
      )
    );
    return atomicSections;
  }

  // Takes an individual to aggregate section and returns atomic section
  static aggregateSectionToAtomicSections(section: AggregateSection) {
    // Copy into two atomic sections
    const atomicSectionOne: AtomicSection = JSON.parse(JSON.stringify(section));
    const atomicSectionTwo: AtomicSection = JSON.parse(JSON.stringify(section));
    // Append 1 and 2; C => C1, C2
    atomicSectionOne.name += '1';
    atomicSectionTwo.name += '2';
    // Return as array
    return [atomicSectionOne, atomicSectionTwo];
  }

  // Takes atomic sections and turns them into aggregate sections wherever possible
  // Only purpose is for front end ease in showing => [C1, C2, B1] = [C, B1]
  // TODO: Sort the thing and look aju baju
  static atomicSectionsToMixedSections(
    atomicSectionsArg: Array<AtomicSection>
  ) {
    // Deep copy
    const atomicSections = JSON.parse(
      JSON.stringify(atomicSectionsArg)
    ) as Array<AtomicSection>;
    // To return
    const mixedSections: Array<AtomicSection | AggregateSection> = [];
    atomicSections.forEach((atomicSection, index) => {
      let pushed = false;
      for (let i = index + 1; i < atomicSections.length; i++) {
        // Compare letters - if A1 === A2
        if (atomicSection.name[0] === atomicSections[i].name[0]) {
          pushed = true;
          mixedSections.push(
            new AggregateSection(
              atomicSection.name[0],
              atomicSection.batch,
              atomicSection.department
            )
          );
          // Remove A2
          atomicSections.splice(i, 1);
          break;
        }
      }
      if (!pushed)
        mixedSections.push(
          new AtomicSection(
            atomicSection.name,
            atomicSection.batch,
            atomicSection.department
          )
        );
    });
    return mixedSections;
  }

  // Takes mixed sections and turns them into atomic sections
  // Only purpose is for back end ease in showing => [C, B1] = [C1, C2, B1]
  static mixedSectionsToAtomicSections(
    mixedSections: Array<AtomicSection | AggregateSection>
  ) {
    const atomicSections: Array<AtomicSection> = [];
    mixedSections.forEach(section => {
      // If atomic just push
      if (section.name[1]) {
        atomicSections.push(section);
      } else {
        // Else break then push
        atomicSections.push(...this.aggregateSectionToAtomicSections(section));
      }
    });
    return atomicSections;
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
