import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SecondaryNavbarComponent } from "../secondary-navbar/secondary-navbar.component";

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule, SecondaryNavbarComponent],
  templateUrl: './landing.component.html', 
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  features = [
    {
      icon: 'bi-person-check',
      title: 'Identity & Access Management',
      desc: 'Securely manage student, teacher, and staff roles with proper permissions.'
    },
    {
      icon: 'bi-building',
      title: 'Admissions & Enrollment',
      desc: 'Simplify admissions from application to approval in one place.'
    },
    {
      icon: 'bi-calendar-check',
      title: 'Attendance Tracking',
      desc: 'Track daily attendance and generate reports easily.'
    },
    {
      icon: 'bi-cash-stack',
      title: 'Fee & Finance',
      desc: 'Manage fees, invoices, and financial records with transparency.'
    },
    {
      icon: 'bi-award',
      title: 'Exams & Grading',
      desc: 'Create exams and generate report cards seamlessly.'
    },
    {
      icon: 'bi-clock',
      title: 'Timetable Scheduling',
      desc: 'Manage schedules and optimize teacher allocation.'
    }
  ];

  pricingPlans = [
    {
      name: 'Free Trial',
      price: 'Rs0 / Month',
      features: [
        'Access to core features',
        'Student & staff management',
        'Attendance & reports',
        'No AI chatbot'
      ],
      highlight: false
    },
    {
      name: 'Standard Plan',
      price: 'Rs10,000 / Month',
      features: [
        'All features included',
        'AI chatbot enabled',
        'Unlimited users',
        'Advanced analytics'
      ],
      highlight: true
    },
    {
      name: 'Premium+ Plan',
      price: 'Rs100,000 / Year',
      features: [
        'Everything in Standard',
        'Priority support',
        'Yearly discount',
        'Best for large schools'
      ],
      highlight: false
    }
  ];

  reviews = [1, 2, 3];

}