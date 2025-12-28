import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoyaltyCard, CreateCardInput, UpdateCardInput, SAMPLE_CARDS } from '@/types/card';

const STORAGE_KEY = 'cardholdr_cards';
const INITIALIZED_KEY = 'cardholdr_initialized';

/**
 * CardService - Abstraction layer for card data management
 * Currently uses AsyncStorage, can be swapped for API later
 */
class CardServiceImpl {
  private cache: LoyaltyCard[] | null = null;

  /**
   * Initialize with sample data on first run
   */
  async initialize(): Promise<void> {
    const initialized = await AsyncStorage.getItem(INITIALIZED_KEY);
    if (!initialized) {
      await this.saveCards(SAMPLE_CARDS);
      await AsyncStorage.setItem(INITIALIZED_KEY, 'true');
    }
  }

  /**
   * Get all cards, sorted by most recently updated
   */
  async getCards(): Promise<LoyaltyCard[]> {
    if (this.cache) {
      return this.cache;
    }

    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      const cards = data ? JSON.parse(data) : [];
      this.cache = cards.sort((a: LoyaltyCard, b: LoyaltyCard) => b.updatedAt - a.updatedAt);
      return this.cache!;
    } catch (error) {
      console.error('Error loading cards:', error);
      return [];
    }
  }

  /**
   * Get a single card by ID
   */
  async getCard(id: string): Promise<LoyaltyCard | null> {
    const cards = await this.getCards();
    return cards.find((card) => card.id === id) || null;
  }

  /**
   * Add a new card
   */
  async addCard(input: CreateCardInput): Promise<LoyaltyCard> {
    const cards = await this.getCards();
    const now = Date.now();

    const newCard: LoyaltyCard = {
      ...input,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };

    const updatedCards = [newCard, ...cards];
    await this.saveCards(updatedCards);

    return newCard;
  }

  /**
   * Update an existing card
   */
  async updateCard(id: string, input: UpdateCardInput): Promise<LoyaltyCard> {
    const cards = await this.getCards();
    const index = cards.findIndex((card) => card.id === id);

    if (index === -1) {
      throw new Error(`Card with id ${id} not found`);
    }

    const updatedCard: LoyaltyCard = {
      ...cards[index],
      ...input,
      updatedAt: Date.now(),
    };

    cards[index] = updatedCard;
    await this.saveCards(cards);

    return updatedCard;
  }

  /**
   * Delete a card
   */
  async deleteCard(id: string): Promise<void> {
    const cards = await this.getCards();
    const filteredCards = cards.filter((card) => card.id !== id);

    if (filteredCards.length === cards.length) {
      throw new Error(`Card with id ${id} not found`);
    }

    await this.saveCards(filteredCards);
  }

  /**
   * Clear all cards (for testing/reset)
   */
  async clearAllCards(): Promise<void> {
    await this.saveCards([]);
    await AsyncStorage.removeItem(INITIALIZED_KEY);
  }

  /**
   * Internal: Save cards to storage and update cache
   */
  private async saveCards(cards: LoyaltyCard[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
      this.cache = cards.sort((a, b) => b.updatedAt - a.updatedAt);
    } catch (error) {
      console.error('Error saving cards:', error);
      throw error;
    }
  }

  /**
   * Invalidate cache (call when data might have changed externally)
   */
  invalidateCache(): void {
    this.cache = null;
  }
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Export singleton instance
export const CardService = new CardServiceImpl();

