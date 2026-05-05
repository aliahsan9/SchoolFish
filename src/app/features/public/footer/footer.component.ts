import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  currentYear = new Date().getFullYear();

  quickLinks = [
    { name: 'Home', link: '/' },
    { name: 'About', link: '/about' },
    { name: 'Features', link: '/features' },
    { name: 'Services', link: '/services' }
  ];

  supportLinks = [
    { name: 'Contact', link: '/contact' },
    { name: 'Privacy Policy', link: '/privacy' },
    { name: 'Terms & Conditions', link: '/terms' }
  ];

}