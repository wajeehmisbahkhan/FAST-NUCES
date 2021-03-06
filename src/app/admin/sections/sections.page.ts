import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';
import { Section } from 'src/app/services/helper-classes';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.page.html',
  styleUrls: ['./sections.page.scss']
})
export class SectionsPage implements OnInit {
  section: Section;

  constructor(private server: ServerService) {
    this.section = new Section();
  }

  ngOnInit() {}

  addSection() {
    this.section.department = this.section.department.toUpperCase();
    this.server.addObject('sections', this.section);
  }

  // Convert to normal to show
  get sections() {
    return this.server.sections;
  }
}
