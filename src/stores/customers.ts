// src/stores/customers.ts
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useAlchemistStore } from './alchemist';
import type { Customer } from '../types';

export const useCustomerStore = defineStore('customers', () => {
  const alchemist = useAlchemistStore();
  const currentCustomer = ref<Customer | null>(null);

  // ЧОЛОВІЧІ ІМЕНА
  const maleFirstNames = [
    'Alder', 'Bram', 'Cedric', 'Dorian', 'Elias', 'Finn', 'Gideon', 'Hugo', 
    'Ivan', 'Jasper', 'Kael', 'Lucian', 'Magnus', 'Nico', 'Orion', 'Percival', 
    'Quinn', 'Rowan', 'Silas', 'Tristan', 'Ulric', 'Victor', 'Wesley', 'Xander', 
    'Yorick', 'Zane', 'Alistair', 'Balthazar', 'Casimir', 'Dmitri'
  ];

  // ЖІНОЧІ ІМЕНА
  const femaleFirstNames = [
    'Aria', 'Bella', 'Cora', 'Dahlia', 'Elena', 'Freya', 'Gwen', 'Hazel', 
    'Iris', 'Jade', 'Kira', 'Luna', 'Maeve', 'Nora', 'Ophelia', 'Piper', 
    'Quinn', 'Rowena', 'Sage', 'Tessa', 'Ursula', 'Violet', 'Willow', 'Xena', 
    'Yara', 'Zara', 'Anastasia', 'Beatrix', 'Celeste', 'Daphne'
  ];

  // ПРІЗВИЩА (універсальні)
  const lastNames = [
    'Blackwood', 'Crowley', 'Darkholme', 'Evergreen', 'Fairweather', 'Grimm', 
    'Holloway', 'Ironwood', 'Kingsley', 'Lancaster', 'Moon', 'Nightshade', 
    'Oakheart', 'Pendragon', 'Quicksilver', 'Ravenclaw', 'Silverton', 'Thorn', 
    'Underwood', 'Valentine', 'Whitmore', 'Yarrow', 'Zephyr', 'Ashford', 
    'Bloodworth', 'Coldwater', 'Duskmoor', 'Emberly', 'Frost', 'Galloway'
  ];

  const potionTypes: { id: string; basePrice: number; minLevel: number; chance: number }[] = [
    { id: 'heal_potion', basePrice: 30, minLevel: 1, chance: 15 }, 
    { id: 'mana_potion', basePrice: 40, minLevel: 1, chance: 15 }, 
    
    { id: 'strength_potion', basePrice: 60, minLevel: 2, chance: 25 },
    { id: 'antidote', basePrice: 50, minLevel: 2, chance: 25 },
    { id: 'poison_potion', basePrice: 70, minLevel: 3, chance: 15 },
    
    { id: 'invisibility_potion', basePrice: 100, minLevel: 4, chance: 10 },
    { id: 'flight_potion', basePrice: 120, minLevel: 4, chance: 10 },
    { id: 'ice_potion', basePrice: 150, minLevel: 5, chance: 8 },
    { id: 'fire_potion', basePrice: 150, minLevel: 5, chance: 8 },
    
    { id: 'dragon_breath', basePrice: 300, minLevel: 6, chance: 4 },
    { id: 'life_elixir', basePrice: 500, minLevel: 7, chance: 2 },
  ];

  /** 
   * Генерує нового випадкового покупця. Враховує рівень гравця для вибору зілля.
   */
  const generateCustomer = () => {
    // Випадково вибираємо стать для імені
    const isMale = Math.random() > 0.5;
    const firstNameList = isMale ? maleFirstNames : femaleFirstNames;
    
    const firstName = firstNameList[Math.floor(Math.random() * firstNameList.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    const availablePotions = potionTypes.filter(p => alchemist.level >= p.minLevel);
    
    let weightedList: typeof potionTypes = [];
    availablePotions.forEach(p => {
      for (let i = 0; i < p.chance; i++) {
        weightedList.push(p);
      }
    });

    if (weightedList.length === 0) {
      weightedList = [potionTypes[0]!, potionTypes[1]!];
    }

    const potion = weightedList[Math.floor(Math.random() * weightedList.length)]!;
    
    let price = potion.basePrice * (0.85 + Math.random() * 0.3);
    
    if (alchemist.isMaster) {
      price *= 1.05;
    }

    currentCustomer.value = {
      id: Date.now(),
      name: name,
      requestedPotionId: potion.id,
      offerPrice: Math.round(price)
    };
  };

  const sellToCustomer = (hasPotion: boolean) => {
    if (!currentCustomer.value || !hasPotion) return false;
    alchemist.addGold(currentCustomer.value.offerPrice);
    alchemist.addXp(25); 
    currentCustomer.value = null; 
    generateCustomer(); 
    return true;
  };

  const rejectCustomer = () => {
    currentCustomer.value = null;
    generateCustomer();
  };

  return { currentCustomer, generateCustomer, sellToCustomer, rejectCustomer };
});