import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filedownload-notes',
  templateUrl: './notes.component.html',
})
export class FileDownloadNotesComponent implements OnInit {

  markdownSource = "ngPreserveWhitespaces";

  constructor() { }

  ngOnInit(): void {
  }

}
