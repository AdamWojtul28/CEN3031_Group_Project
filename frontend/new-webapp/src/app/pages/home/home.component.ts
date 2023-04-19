import { Component, AfterViewInit } from '@angular/core';
import Typed from 'typed.js';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {
  title = 'your-app-name';

  ngAfterViewInit() {
    const options = {
      strings: ['the United States', 'Poland', 'the United Kingdom'],
      typeSpeed: 150,
      backSpeed: 150,
      loop: true,
      
    };

    const typed = new Typed('.auto-type', options);
  }
}
