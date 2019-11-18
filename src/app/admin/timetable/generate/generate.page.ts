import { Component, OnInit } from '@angular/core';
import { ServerService } from 'src/app/services/server.service';

@Component({
  selector: 'app-generate',
  templateUrl: './generate.page.html',
  styleUrls: ['./generate.page.scss']
})
export class GeneratePage implements OnInit {
  constructor(private server: ServerService) {}

  ngOnInit() {}

  get timetables() {
    return this.server.timetables;
  }
}
