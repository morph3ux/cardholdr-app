import { CardGradientKey } from '@/constants/theme';

export type BarcodeType = 'CODE128' | 'QR' | 'EAN13' | 'CODE39' | 'UPC';

export interface LoyaltyCard {
  id: string;
  name: string;
  cardNumber: string;
  barcodeType: BarcodeType;
  color: CardGradientKey | string;
  logoUrl?: string;
  notes?: string;
  createdAt: number;
  updatedAt: number;
  openCount?: number; // Number of times the card has been opened
}

export type CreateCardInput = Omit<LoyaltyCard, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateCardInput = Partial<Omit<LoyaltyCard, 'id' | 'createdAt' | 'updatedAt'>>;

// Sample cards for initial state / development
export const SAMPLE_CARDS: LoyaltyCard[] = [
  {
    id: '1',
    name: 'Starbucks Rewards',
    cardNumber: '6141290012345678',
    barcodeType: 'CODE128',
    color: 'green',
    createdAt: Date.now() - 86400000 * 7,
    updatedAt: Date.now() - 86400000 * 7,
  },
  {
    id: '2',
    name: 'Target Circle',
    cardNumber: '4589123456789012',
    barcodeType: 'CODE128',
    color: 'coral',
    createdAt: Date.now() - 86400000 * 5,
    updatedAt: Date.now() - 86400000 * 5,
  },
  {
    id: '3',
    name: 'CVS ExtraCare',
    cardNumber: '7890123456',
    barcodeType: 'CODE128',
    color: 'purple',
    createdAt: Date.now() - 86400000 * 3,
    updatedAt: Date.now() - 86400000 * 3,
  },
  {
    id: '4',
    name: 'Costco Membership',
    cardNumber: '111234567890',
    barcodeType: 'CODE128',
    color: 'blue',
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
  },
];

