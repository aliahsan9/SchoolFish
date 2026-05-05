import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-secondary-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './secondary-navbar.component.html',
  styleUrls: ['./secondary-navbar.component.scss']
})
export class SecondaryNavbarComponent {

  schools = [
    { name: 'Oxford School', logo: 'https://i.pravatar.cc/40?img=1' },
    { name: 'Beaconhouse', logo: 'https://i.pravatar.cc/40?img=2' },
    { name: 'City School', logo: 'https://i.pravatar.cc/40?img=3' },
    { name: 'Allied School', logo: 'https://i.pravatar.cc/40?img=4' },
    { name: 'Roots International', logo: 'https://i.pravatar.cc/40?img=5' },
    { name: 'Lahore Grammar', logo: 'https://i.pravatar.cc/40?img=6' },
    { name: 'APS School', logo: 'https://i.pravatar.cc/40?img=7' }
  ];

}