import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ShopData } from '../services/public-shop.service';
import { Annonce } from '../../models/annonce.model';
import { Category } from '../../models/category.model';
import { Product } from '../../models/product.model';

// ────────────────────────────────────────────────
// 🔧 Mettre à false pour utiliser la vraie API
// ────────────────────────────────────────────────
export const USE_SHOP_MOCK = true;

// ─── Données entreprise ───────────────────────
const MOCK_COMPANY = {
  name: 'Boutique Kaboré & Fils',
  slug: 'kabore-et-fils',
  phone: '22677938688',
  description: 'Votre boutique de confiance à Ouagadougou',
  logo: '🏪',
  address: 'Secteur 15, Ouagadougou',
  coverColor: '#a04343',
};

// ─── Catégories (mêmes IDs que les services admin) ────────────────
const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Alimentation', icon: 'lunch_dining', color: '#FF6B35', description: 'Nourriture et épicerie', createdAt: new Date('2024-01-01') },
  { id: 'cat-2', name: 'Boissons',     icon: 'local_drink',  color: '#1E88E5', description: 'Eau, jus, sodas',       createdAt: new Date('2024-01-02') },
  { id: 'cat-3', name: 'Vêtements',   icon: 'checkroom',    color: '#8E24AA', description: 'Habits et tissus',      createdAt: new Date('2024-01-03') },
  { id: 'cat-4', name: 'Électronique', icon: 'devices',      color: '#00ACC1', description: 'Téléphones et appareils', createdAt: new Date('2024-01-04') },
  { id: 'cat-5', name: 'Agriculture',  icon: 'grass',        color: '#43A047', description: 'Semences et engrais',   createdAt: new Date('2024-01-05') },
  { id: 'cat-6', name: 'Beauté',       icon: 'face',         color: '#E91E63', description: 'Cosmétiques et soins',  createdAt: new Date('2024-01-06') },
];

// ─── Produits ─────────────────────────────────
const MOCK_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    categoryId: 'cat-1',
    name: 'Riz local 5kg',
    price: 3500,
    originalPrice: 4200,
    promotion: 17,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600',
    unit: 'sachet',
    stock: 50,
    createdAt: new Date('2024-01-10'),
    inStock: true
  },
  {
    id: 'prod-2',
    categoryId: 'cat-1',
    name: 'Huile de palme 1L',
    price: 1200,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwRpQAQaBK5UW_3LTnKO1xa9tARmwZVoFcmA&s',
    unit: 'litre',
    stock: 30,
    createdAt: new Date('2024-01-11'),
    inStock: true
  },
  {
    id: 'prod-3',
    categoryId: 'cat-1',
    name: 'Farine de maïs 2kg',
    price: 1800,
    originalPrice: 2200,
    promotion: 18,
    image: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?w=600',
    unit: 'sachet',
    stock: 25,
    createdAt: new Date('2024-01-12'),
    inStock: true
  },
  {
    id: 'prod-4',
    categoryId: 'cat-2',
    name: 'Eau minérale 1.5L',
    price: 500,
    image: 'https://images.unsplash.com/photo-1564419320461-6870880221ad?w=600',
    unit: 'bouteille',
    stock: 100,
    createdAt: new Date('2024-01-10'),
    inStock: true
  },
  {
    id: 'prod-5',
    categoryId: 'cat-2',
    name: 'Jus de bissap',
    price: 350,
    image: 'https://images.unsplash.com/photo-1622597467836-f3285f2131b8?w=600',
    unit: 'bouteille',
    stock: 45,
    createdAt: new Date('2024-01-11'),
    inStock: true
  },
  {
    id: 'prod-6',
    categoryId: 'cat-3',
    name: 'Tissu wax 6 yards',
    price: 8500,
    originalPrice: 10000,
    promotion: 15,
    image: 'https://images.unsplash.com/photo-1593032465175-481ac7f401a0?w=600',
    unit: 'pièce',
    stock: 15,
    createdAt: new Date('2024-01-13'),
    inStock: true
  },
  {
    id: 'prod-7',
    categoryId: 'cat-4',
    name: 'Téléphone basique',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600',
    unit: 'pièce',
    stock: 8,
    createdAt: new Date('2024-01-14'),
    inStock: true
  },
  {
    id: 'prod-8',
    categoryId: 'cat-5',
    name: 'Semences de sorgho',
    price: 2500,
    image: 'hhttps://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpeNL35d6wJexRl65L9MjiNTBQe5YrFzKIZw&s',
    unit: 'kg',
    stock: 60,
    createdAt: new Date('2024-01-15'),
    inStock: true
  },
  {
    id: 'prod-9',
    categoryId: 'cat-6',
    name: 'Savon de karité',
    price: 500,
    originalPrice: 700,
    promotion: 29,
    image: 'https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=600',
    unit: 'pièce',
    stock: 40,
    createdAt: new Date('2024-01-16'),
    inStock: true
  },
  {
    id: 'prod-10',
    categoryId: 'cat-1',
    name: 'Gombo sec',
    price: 500,
    originalPrice: 700,
    promotion: 29,
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600',
    unit: 'pièce',
    stock: 40,
    createdAt: new Date('2024-01-16'),
    inStock: false
  }
];

// ─── Annonces ────────────────────────────────
const today    = new Date();
const nextWeek = new Date(); nextWeek.setDate(today.getDate() + 7);
const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1);

const MOCK_ANNOUNCEMENTS: Annonce[] = [
  {
    id: 'ann-1',
    titre: 'Grande Promotion du Vendredi !',
    message: 'Jusqu\'à -30% sur tous les produits alimentaires ce vendredi. Ne manquez pas cette offre exceptionnelle !',
    type: 'promo',
    emoji: '🔥',
    dateDebut: today,
    dateFin: nextWeek,
    active: true,
    epinglee: true,
    createdAt: new Date(),
  },
  {
    id: 'ann-2',
    titre: 'Nouveaux arrivages de tissus wax',
    message: 'Nouveaux modèles disponibles ! Venez découvrir notre nouvelle collection de pagnes 100% coton.',
    type: 'info',
    emoji: '🎉',
    dateDebut: today,
    active: true,
    epinglee: false,
    createdAt: new Date(),
  },
  {
    id: 'ann-3',
    titre: 'Fermeture exceptionnelle demain',
    message: 'La boutique sera fermée demain pour fête nationale. Nous reprenons le service après-demain.',
    type: 'alerte',
    emoji: '⚠️',
    dateDebut: today,
    dateFin: tomorrow,
    active: true,
    epinglee: true,
    createdAt: new Date(),
  },
  {
    id: 'ann-4',
    titre: 'Nouveaux arrivages de tissus wax',
    message: 'Nouveaux modèles disponibles ! Venez découvrir notre nouvelle collection de pagnes 100% coton.',
    type: 'info',
    emoji: '🎉',
    dateDebut: today,
    active: true,
    epinglee: false,
    createdAt: new Date(),
  },
  {
    id: 'ann-5',
    titre: 'Fermeture exceptionnelle demain',
    message: 'La boutique sera fermée demain pour fête nationale. Nous reprenons le service après-demain.',
    type: 'alerte',
    emoji: '⚠️',
    dateDebut: today,
    dateFin: tomorrow,
    active: true,
    epinglee: true,
    createdAt: new Date(),
  } ,
  {
    id: 'ann-6',
    titre: 'Nouveaux arrivages de tissus wax',
    message: 'Nouveaux modèles disponibles ! Venez découvrir notre nouvelle collection de pagnes 100% coton.',
    type: 'info',
    emoji: '🎉',
    dateDebut: today,
    active: true,
    epinglee: false,
    createdAt: new Date(),
  },
  {
    id: 'ann-7',
    titre: 'Fermeture exceptionnelle demain',
    message: 'La boutique sera fermée demain pour fête nationale. Nous reprenons le service après-demain.',
    type: 'alerte',
    emoji: '⚠️',
    dateDebut: today,
    dateFin: tomorrow,
    active: true,
    epinglee: true,
    createdAt: new Date(),
  },
];

// ─── Réponse complète ─────────────────────────
const MOCK_SHOP_DATA: ShopData = {
  company:       MOCK_COMPANY,
  categories:    MOCK_CATEGORIES,
  products:      MOCK_PRODUCTS,
  announcements: MOCK_ANNOUNCEMENTS,
};

// ─── Intercepteur ────────────────────────────
export const shopMockInterceptor: HttpInterceptorFn = (req, next) => {
  if (!USE_SHOP_MOCK) return next(req);

  const isShopEndpoint = req.method === 'GET' && req.url.match(/\/api\/public\/shop\/.+/);
  if (!isShopEndpoint) return next(req);

  return of(new HttpResponse({ status: 200, body: MOCK_SHOP_DATA })).pipe(
    delay(600) // simule latence réseau
  );
};
