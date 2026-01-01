import { useState, useEffect, useCallback } from 'react';
import { CardService } from '@/services/card-service';
import { LoyaltyCard, CreateCardInput, UpdateCardInput } from '@/types/card';

export function useCards() {
  const [cards, setCards] = useState<LoyaltyCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCards = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedCards = await CardService.getCards();
      setCards(loadedCards);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load cards'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  const addCard = useCallback(async (input: CreateCardInput) => {
    const newCard = await CardService.addCard(input);
    setCards((prev) => [newCard, ...prev]);
    return newCard;
  }, []);

  const updateCard = useCallback(async (id: string, input: UpdateCardInput) => {
    const updated = await CardService.updateCard(id, input);
    setCards((prev) => prev.map((card) => (card.id === id ? updated : card)));
    return updated;
  }, []);

  const deleteCard = useCallback(async (id: string) => {
    await CardService.deleteCard(id);
    setCards((prev) => prev.filter((card) => card.id !== id));
  }, []);

  const refreshCards = useCallback(async () => {
    CardService.invalidateCache();
    await loadCards();
  }, [loadCards]);

  return {
    cards,
    isLoading,
    error,
    addCard,
    updateCard,
    deleteCard,
    refreshCards,
  };
}

export function useCard(id: string) {
  const [card, setCard] = useState<LoyaltyCard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadCard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const loadedCard = await CardService.getCard(id);
      setCard(loadedCard);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load card'));
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  const updateCard = useCallback(
    async (input: UpdateCardInput) => {
      const updated = await CardService.updateCard(id, input);
      setCard(updated);
      return updated;
    },
    [id]
  );

  const deleteCard = useCallback(async () => {
    await CardService.deleteCard(id);
    setCard(null);
  }, [id]);

  const refreshCard = useCallback(async () => {
    CardService.invalidateCache();
    await loadCard();
  }, [loadCard]);

  return {
    card,
    isLoading,
    error,
    updateCard,
    deleteCard,
    refreshCard,
  };
}

