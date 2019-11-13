import { Component, OnInit } from '@angular/core';
import { Constraint } from 'src/app/services/helper-classes';
import { ServerService } from 'src/app/services/server.service';
import { PopoverController } from '@ionic/angular';
import { EditComponent } from './edit/edit.component';

@Component({
  selector: 'app-constraints',
  templateUrl: './constraints.page.html',
  styleUrls: ['./constraints.page.scss']
})
export class ConstraintsPage implements OnInit {
  constraint: Constraint;
  showElectivesOnly: boolean;

  constructor(private server: ServerService, private poc: PopoverController) {
    this.constraint = new Constraint();
    this.showElectivesOnly = true;
  }

  ngOnInit() {}

  addConstraint() {
    this.server.addPrimitiveObject('constraints', this.constraint);
  }

  getCourseById(id: string) {
    return this.courses.find(course => course.id === id);
  }

  trackById(item: object, index: number) {
    return item['id'];
  }

  async presentPopover(element: any) {
    const popover = await this.poc.create({
      component: EditComponent,
      componentProps: {
        element
      }
    });
    return await popover.present();
  }

  get courses() {
    return this.server.courses;
  }

  get constraints() {
    return this.server.constraints;
  }

  get popoverInterfaceOptions() {
    return {
      cssClass: 'popover-wider'
    };
  }
}
