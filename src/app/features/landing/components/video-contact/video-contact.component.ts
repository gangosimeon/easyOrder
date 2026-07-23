import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface ContactItem {
  icon: string;
  label: string;
  value: string;
  href?: string;
  color: string;
}

@Component({
  selector: 'app-video-contact',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './video-contact.component.html',
  styleUrl: './video-contact.component.scss'
})
export class VideoContactComponent {
  readonly contactItems: ContactItem[] = [
    {
      icon: 'chat',
      label: 'WhatsApp',
      value: '+226 65 70 46 96',
      href: 'https://wa.me/22665704696',
      color: '#25D366',
    },
    {
      icon: 'email',
      label: 'Email',
      value: 'jecreemaboutique@gmail.com',
      href: 'mailto:jecreemaboutique@gmail.com',
      color: '#008060',
    },
    {
      icon: 'schedule',
      label: 'Heures d\'ouverture',
      value: 'Lun - Sam : 8h - 20h',
      color: '#008060',
    },
  ];
}
