// src/stores/alchemist.ts
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAlchemistStore = defineStore('alchemist', () => {
  const hp = ref(100);
  const maxHp = ref(100);
  const mp = ref(100);
  const maxMp = ref(100);
  const gold = ref(150);
  const debt = ref(0);
  const level = ref(1);
  const xp = ref(0);
  const isDead = ref(false);

  const isMaster = computed(() => level.value >= 5 && level.value % 5 === 0);
  
  // НОВА ФОРМУЛА ДОСВІДУ: Кожен рівень вимагає на 10% більше XP, ніж попередній.
  // 1 рівень: 100 XP
  // 2 рівень: 110 XP
  // 3 рівень: 121 XP і т.д.
  const xpToNextLevel = computed(() => {
    return Math.floor(100 * Math.pow(1.1, level.value - 1));
  });

  /** 
   * Нарахування досвіду та перевірка на підвищення рівня.
   * При підвищенні рівня: +15 Max HP, +12 Max MP, повне відновлення HP/MP.
   */
  const addXp = (amount: number) => {
    if (isDead.value) return;
    xp.value += amount;
    
    // Перевіряємо, чи вистачає досвіду для нового рівня (може бути кілька рівнів одразу)
    while (xp.value >= xpToNextLevel.value) {
      xp.value -= xpToNextLevel.value;
      level.value++;
      
      // БАФИ ПРИ НОВОМУ РІВНІ
      maxHp.value += 15; 
      maxMp.value += 12;
      
      // Повне відновлення здоров'я та мани
      hp.value = maxHp.value;
      mp.value = maxMp.value;
    }
  };

  const takeDamage = (amount: number) => {
    if (isDead.value) return;
    hp.value -= amount;
    if (hp.value <= 0) {
      hp.value = 0;
      isDead.value = true;
      level.value = 1; 
      xp.value = 0;
      gold.value = 150; 
      debt.value = 0;   
      
      // Скидаємо характеристики до базових при смерті
      maxHp.value = 100;
      maxMp.value = 100;
    }
  };

  const heal = (amount: number) => {
    if (isDead.value) return;
    hp.value = Math.min(maxHp.value, hp.value + amount);
  };

  const spendMana = (amount: number) => {
    if (mp.value >= amount) {
      mp.value -= amount;
      return true;
    }
    return false;
  };

  const resurrect = () => {
    isDead.value = false;
    hp.value = 100;
    mp.value = 100;
    maxHp.value = 100;
    maxMp.value = 100;
    level.value = 1;
    xp.value = 0;
  };

  const addGold = (amount: number) => { gold.value += amount; };
  
  const spendGold = (amount: number) => {
    if (gold.value >= amount) {
      gold.value -= amount;
      return true;
    }
    return false;
  };

  const takeLoan = () => {
    if (debt.value > 0 || isDead.value) return false;
    gold.value += 100;
    debt.value = 120;
    return true;
  };

  const repayLoan = () => {
    if (debt.value > 0 && gold.value >= debt.value) {
      gold.value -= debt.value;
      debt.value = 0;
      return true;
    }
    return false;
  };

  const buyMana = (amount: number, cost: number) => {
    if (isDead.value) return false;
    if (gold.value >= cost && mp.value < maxMp.value) {
      gold.value -= cost;
      mp.value = Math.min(maxMp.value, mp.value + amount);
      return true;
    }
    return false;
  };

  return { 
    hp, maxHp, mp, maxMp, gold, debt, level, xp, isDead, isMaster, xpToNextLevel,
    addXp, takeDamage, heal, spendMana, resurrect, addGold, spendGold, takeLoan, repayLoan, buyMana
  };
});