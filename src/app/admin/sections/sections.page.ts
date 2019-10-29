import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { Section, AggregateSection } from 'src/app/services/helper-classes';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.page.html',
  styleUrls: ['./sections.page.scss']
})
/*
  Important!
  normalSection for viewing
  atomicSection for storing
  aggregateSection for in between
*/
export class SectionsPage implements OnInit {
  // Normal section as input
  section: Section;
  constructor(private server: ServerService) {
    this.section = new Section();
  }

  ngOnInit() {}

  addSection() {
    // Convert to atomic before sending
    const atomicSections = AggregateSection.normalToAtomicSections(
      this.section
    );
    // Push both atoms
    atomicSections.forEach(atomicSection => {
      this.server.addPrimitiveObject('sections', atomicSection);
    });
  }

  // Convert to aggregate to store both infos
  get aggregateSections() {
    // Send copy
    const sections = JSON.parse(JSON.stringify(this.server.sections));
    return AggregateSection.atomicToAggregateSections(sections);
  }

  // Convert to normal to show
  get sections() {
    return AggregateSection.aggregateToNormalSections(this.aggregateSections);
  }
}
