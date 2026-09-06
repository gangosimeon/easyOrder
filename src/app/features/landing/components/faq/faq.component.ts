import { Component, computed, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface FaqCategory {
  id:    string;
  label: string;
  icon:  string;
}

interface FaqItem {
  id:         string;
  categoryId: string;
  question:   string;
  answer:     string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent {
  readonly categories: FaqCategory[] = [
    { id: 'boutique',   label: 'Créer ma boutique',       icon: 'storefront' },
    { id: 'produits',   label: 'Produits et catégories',  icon: 'inventory_2' },
    { id: 'commandes',  label: 'Commandes',               icon: 'receipt_long' },
    { id: 'visibilite', label: 'Visibilité et partage',   icon: 'share' },
    { id: 'gestion',    label: 'Gestion',                 icon: 'settings' },
    { id: 'assistance', label: 'Assistance',              icon: 'support_agent' },
  ];

  readonly items: FaqItem[] = [
    {
      id: 'q1', categoryId: 'boutique',
      question: 'Qu’est-ce que JeCréeMaBoutique ?',
      answer: 'JeCréeMaBoutique est une plateforme qui permet aux commerçants de créer facilement leur boutique en ligne, de présenter leurs produits et de permettre à leurs clients de les découvrir et de les contacter.',
    },
    {
      id: 'q2', categoryId: 'boutique',
      question: 'Comment créer ma boutique ?',
      answer: 'Cliquez sur « Créer ma boutique » et renseignez les informations demandées. Vous pouvez commencer directement, sans avoir à créer un compte au préalable.',
    },
    {
      id: 'q3', categoryId: 'boutique',
      question: 'Dois-je créer un compte avant de créer ma boutique ?',
      answer: 'Non. Vous pouvez commencer directement par la création de votre boutique.',
    },
    {
      id: 'q4', categoryId: 'boutique',
      question: 'Quelles sont les étapes pour créer ma boutique ?',
      answer: 'Vous renseignez d’abord les informations de votre boutique, puis vous créez vos catégories, ajoutez vos produits, personnalisez votre boutique, configurez les options nécessaires et enfin publiez votre boutique.',
    },
    {
      id: 'q5', categoryId: 'produits',
      question: 'Pourquoi dois-je créer des catégories ?',
      answer: 'Les catégories permettent de mieux organiser vos produits et facilitent la navigation de vos clients. Par exemple : Vêtements, Chaussures, Accessoires, Électronique, etc.',
    },
    {
      id: 'q6', categoryId: 'produits',
      question: 'Comment ajouter un produit ?',
      answer: 'Après avoir créé vos catégories, vous pouvez ajouter vos produits avec leur nom, leurs photos, leur prix, leur description et leur catégorie.',
    },
    {
      id: 'q12', categoryId: 'produits',
      question: 'Est-ce que je peux vendre différents types de produits ?',
      answer: 'Oui. Vous pouvez créer des catégories adaptées à votre activité et y ajouter vos différents produits.',
    },
    {
      id: 'q8', categoryId: 'commandes',
      question: 'Mes clients peuvent-ils commander sur ma boutique ?',
      answer: 'Oui. Votre boutique permet à vos clients de consulter vos produits et d’effectuer leurs demandes ou commandes selon les fonctionnalités configurées sur votre boutique.',
    },
    {
      id: 'q9', categoryId: 'visibilite',
      question: 'Comment mes clients trouvent-ils ma boutique ?',
      answer: 'Votre boutique dispose d’un lien que vous pouvez partager avec vos clients sur WhatsApp, Facebook, Instagram ou tout autre canal de communication.',
    },
    {
      id: 'q10', categoryId: 'visibilite',
      question: 'Puis-je partager ma boutique sur WhatsApp ?',
      answer: 'Oui. Vous pouvez partager facilement le lien de votre boutique avec vos clients et vos contacts WhatsApp.',
    },
    {
      id: 'q11', categoryId: 'visibilite',
      question: 'Puis-je personnaliser ma boutique ?',
      answer: 'Oui. Vous pouvez personnaliser différents éléments de votre boutique afin qu’elle corresponde à votre activité et à votre image.',
    },
    {
      id: 'q7', categoryId: 'gestion',
      question: 'Puis-je modifier ma boutique après sa publication ?',
      answer: 'Oui. Vous pouvez mettre à jour les informations de votre boutique, vos catégories et vos produits afin de garder votre boutique à jour.',
    },
    {
      id: 'q13', categoryId: 'gestion',
      question: 'Puis-je utiliser JeCréeMaBoutique depuis mon téléphone ?',
      answer: 'Oui. La plateforme est conçue pour être utilisée sur téléphone, tablette et ordinateur.',
    },
    {
      id: 'q14', categoryId: 'assistance',
      question: 'Que faire si j’ai besoin d’aide ?',
      answer: 'Si vous rencontrez une difficulté lors de la création ou de la gestion de votre boutique, vous pouvez contacter notre équipe afin d’obtenir de l’aide.',
    },
    {
      id: 'q15', categoryId: 'assistance',
      question: 'Pourquoi créer une boutique en ligne ?',
      answer: 'Votre boutique en ligne vous permet d’améliorer votre visibilité, de présenter vos produits à vos clients et de rester accessible même lorsque votre boutique physique est fermée.',
    },
  ];

  readonly searchQuery = signal('');
  readonly openId      = signal<string | null>(null);

  readonly filteredCategories = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    return this.categories
      .map(cat => ({
        ...cat,
        items: this.items.filter(item =>
          item.categoryId === cat.id &&
          (!q || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q))
        ),
      }))
      .filter(cat => cat.items.length > 0);
  });

  readonly hasResults = computed(() => this.filteredCategories().length > 0);

  toggle(id: string): void {
    this.openId.update(current => current === id ? null : id);
  }

  isOpen(id: string): boolean {
    return this.openId() === id;
  }

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }
}
