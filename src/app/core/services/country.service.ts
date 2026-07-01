import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient }                  from '@angular/common/http';
import { Observable, of }              from 'rxjs';
import { catchError, map, tap }        from 'rxjs/operators';

// ── Table ISO → { indicatif, nom } (miroir de lib/country-utils.ts) ──────────
// Dupliquée ici pour éviter une dépendance au backend dans le frontend.

interface CountryEntry { dialCode: string; name: string; }

const ISO_MAP: Record<string, CountryEntry> = {
  BF: { dialCode: '226', name: 'Burkina Faso'        },
  CI: { dialCode: '225', name: "Côte d'Ivoire"        },
  SN: { dialCode: '221', name: 'Sénégal'              },
  ML: { dialCode: '223', name: 'Mali'                 },
  GH: { dialCode: '233', name: 'Ghana'                },
  TG: { dialCode: '228', name: 'Togo'                 },
  BJ: { dialCode: '229', name: 'Bénin'                },
  NE: { dialCode: '227', name: 'Niger'                },
  MR: { dialCode: '222', name: 'Mauritanie'           },
  GN: { dialCode: '224', name: 'Guinée'               },
  GM: { dialCode: '220', name: 'Gambie'               },
  GW: { dialCode: '245', name: 'Guinée-Bissau'        },
  SL: { dialCode: '232', name: 'Sierra Leone'         },
  LR: { dialCode: '231', name: 'Libéria'              },
  CV: { dialCode: '238', name: 'Cap-Vert'             },
  NG: { dialCode: '234', name: 'Nigéria'              },
  CM: { dialCode: '237', name: 'Cameroun'             },
  GA: { dialCode: '241', name: 'Gabon'                },
  CG: { dialCode: '242', name: 'Congo'                },
  CD: { dialCode: '243', name: 'R. D. Congo'          },
  CF: { dialCode: '236', name: 'Centrafrique'         },
  TD: { dialCode: '235', name: 'Tchad'                },
  GQ: { dialCode: '240', name: 'Guinée équatoriale'   },
  ET: { dialCode: '251', name: 'Éthiopie'             },
  KE: { dialCode: '254', name: 'Kenya'                },
  UG: { dialCode: '256', name: 'Ouganda'              },
  TZ: { dialCode: '255', name: 'Tanzanie'             },
  RW: { dialCode: '250', name: 'Rwanda'               },
  BI: { dialCode: '257', name: 'Burundi'              },
  MG: { dialCode: '261', name: 'Madagascar'           },
  MZ: { dialCode: '258', name: 'Mozambique'           },
  ZA: { dialCode: '27',  name: 'Afrique du Sud'       },
  ZW: { dialCode: '263', name: 'Zimbabwe'             },
  ZM: { dialCode: '260', name: 'Zambie'               },
  BW: { dialCode: '267', name: 'Botswana'             },
  NA: { dialCode: '264', name: 'Namibie'              },
  AO: { dialCode: '244', name: 'Angola'               },
  MA: { dialCode: '212', name: 'Maroc'                },
  DZ: { dialCode: '213', name: 'Algérie'              },
  TN: { dialCode: '216', name: 'Tunisie'              },
  EG: { dialCode: '20',  name: 'Égypte'               },
  SD: { dialCode: '249', name: 'Soudan'               },
  SS: { dialCode: '211', name: 'Soudan du Sud'        },
  FR: { dialCode: '33',  name: 'France'               },
  BE: { dialCode: '32',  name: 'Belgique'             },
  CH: { dialCode: '41',  name: 'Suisse'               },
  CA: { dialCode: '1',   name: 'Canada'               },
  US: { dialCode: '1',   name: 'États-Unis'           },
};

/** Map inverse indicatif → nom du pays. */
const DIAL_TO_NAME: Record<string, string> = {};
for (const { dialCode, name } of Object.values(ISO_MAP)) {
  if (!DIAL_TO_NAME[dialCode]) DIAL_TO_NAME[dialCode] = name;
}

/** Map inverse indicatif → code ISO (premier pays rencontré pour cet indicatif). */
const DIAL_TO_ISO: Record<string, string> = {};
for (const [iso, { dialCode }] of Object.entries(ISO_MAP)) {
  if (!DIAL_TO_ISO[dialCode]) DIAL_TO_ISO[dialCode] = iso;
}

/** Convertit un code ISO en emoji drapeau. Ex: "BF" → 🇧🇫 */
function toFlagEmoji(iso: string): string {
  return [...iso.toUpperCase()]
    .map(c => String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65))
    .join('');
}

const STORAGE_KEY = 'jcmb_country_code';

export interface CountryOption {
  iso:      string;
  dialCode: string;
  name:     string;
}

@Injectable({ providedIn: 'root' })
export class CountryService {
  private http = inject(HttpClient);

  /** Indicatif téléphonique courant (ex: "226"). Null si pas encore résolu. */
  readonly detectedDialCode = signal<string | null>(null);

  /** Code ISO courant (ex: "BF"). Null si pas encore résolu. */
  private readonly _detectedIso = signal<string | null>(null);

  /** Nom du pays courant en français. */
  readonly countryName = signal<string | null>(null);

  /** Emoji drapeau du pays courant. Ex: "BF" → 🇧🇫. Null si non résolu. */
  readonly flagEmoji = computed(() => {
    const iso = this._detectedIso();
    return iso ? toFlagEmoji(iso) : null;
  });

  /**
   * URL de l'image drapeau via flagcdn.com — même approche que phone-input.
   * Ex: "BF" → "https://flagcdn.com/48x36/bf.png"
   */
  readonly flagImageUrl = computed(() => {
    const iso = this._detectedIso();
    return iso ? `https://flagcdn.com/48x36/${iso.toLowerCase()}.png` : null;
  });

  /** Liste de tous les pays disponibles, triés par nom (pour le sélecteur). */
  readonly allCountries: CountryOption[] = Object.entries(ISO_MAP)
    .map(([iso, { dialCode, name }]) => ({ iso, dialCode, name }))
    .sort((a, b) => a.name.localeCompare(b.name, 'fr'));

  /**
   * Résout le pays du visiteur.
   * - Si un pays est déjà enregistré en localStorage : résolution synchrone (via `of()`).
   * - Sinon : détection par IP (asynchrone ~300-600ms).
   * Retourne un Observable qui émet le dialCode résolu (ou null en cas d'échec) puis se termine.
   */
  init(): Observable<string | null> {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      this.applyDialCode(saved);
      return of(saved);
    }
    return this.detectFromIp();
  }

  /** Change le pays manuellement et persiste le choix dans localStorage. */
  setCountryByDialCode(dialCode: string): void {
    localStorage.setItem(STORAGE_KEY, dialCode);
    this.applyDialCode(dialCode);
  }

  /** Conversion indicatif → nom du pays. */
  getNameForDialCode(dialCode: string): string | null {
    return DIAL_TO_NAME[dialCode] ?? null;
  }

  // ── Privé ─────────────────────────────────────────────────────────────────

  private applyDialCode(dialCode: string, iso?: string): void {
    this.detectedDialCode.set(dialCode);
    this.countryName.set(DIAL_TO_NAME[dialCode] ?? null);
    // Résolution ISO : priorité à l'ISO fourni (détection IP), sinon lookup inverse
    this._detectedIso.set(iso?.toUpperCase() ?? DIAL_TO_ISO[dialCode] ?? null);
  }

  /**
   * Détecte le pays via l'API publique ipapi.co (gratuit, pas de clé, CORS ouvert).
   * Fallback sur api.country.is si ipapi.co échoue.
   */
  private detectFromIp(): Observable<string | null> {
    return this.http
      .get<{ country_code?: string }>('https://ipapi.co/json/')
      .pipe(
        map(r => r.country_code ?? null),
        catchError(() =>
          // Fallback : api.country.is — retourne { country: "BF" }
          this.http
            .get<{ country?: string }>('https://api.country.is/')
            .pipe(
              map(r => r.country ?? null),
              catchError(() => of(null)),
            ),
        ),
        tap(iso => {
          if (!iso) return;
          const entry = ISO_MAP[iso.toUpperCase()];
          // Passer l'ISO en 2e argument pour construire l'emoji drapeau exact
          if (entry) this.applyDialCode(entry.dialCode, iso);
        }),
        map(() => this.detectedDialCode()),
      );
  }
}
