// src/stores/save.ts
import { useAlchemistStore } from './alchemist';
import { useInventoryStore } from './inventory';
import { useCauldronStore } from './cauldron';

const SAVE_KEY = 'alchemy_shop_save';

export const saveGame = () => {
  const alchemist = useAlchemistStore();
  const inventory = useInventoryStore();
  const cauldron = useCauldronStore();

  const data = {
    alchemist: {
      hp: alchemist.hp,
      maxHp: alchemist.maxHp,
      mp: alchemist.mp,
      maxMp: alchemist.maxMp,
      gold: alchemist.gold,
      debt: alchemist.debt,
      level: alchemist.level,
      xp: alchemist.xp,
      isDead: alchemist.isDead,
    },
    inventory: {
      pantry: inventory.pantry,
      potions: inventory.potions,
    },
    cauldron: {
      recipes: cauldron.recipes.map(r => ({ id: r.id, isUnlocked: r.isUnlocked })),
      pinnedRecipes: cauldron.pinnedRecipes,
    }
  };

  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
};

export const loadGame = () => {
  const savedData = localStorage.getItem(SAVE_KEY);
  if (!savedData) return;

  try {
    const data = JSON.parse(savedData);
    const alchemist = useAlchemistStore();
    const inventory = useInventoryStore();
    const cauldron = useCauldronStore();

    // Відновлюємо гравця
    if (data.alchemist) {
      alchemist.hp = data.alchemist.hp;
      alchemist.maxHp = data.alchemist.maxHp;
      alchemist.mp = data.alchemist.mp;
      alchemist.maxMp = data.alchemist.maxMp;
      alchemist.gold = data.alchemist.gold;
      alchemist.debt = data.alchemist.debt;
      alchemist.level = data.alchemist.level;
      alchemist.xp = data.alchemist.xp;
      alchemist.isDead = data.alchemist.isDead;
    }

    // Відновлюємо інвентар
    if (data.inventory) {
      inventory.pantry = data.inventory.pantry || {};
      inventory.potions = data.inventory.potions || {};
    }

    // Відновлюємо рецепти
    if (data.cauldron) {
      if (data.cauldron.recipes) {
        data.cauldron.recipes.forEach((savedRecipe: any) => {
          const recipe = cauldron.recipes.find(r => r.id === savedRecipe.id);
          if (recipe) recipe.isUnlocked = savedRecipe.isUnlocked;
        });
      }
      if (data.cauldron.pinnedRecipes) {
        cauldron.pinnedRecipes = data.cauldron.pinnedRecipes;
      }
    }
  } catch (e) {
    console.error("Помилка завантаження гри:", e);
  }
};

export const resetGame = () => {
  localStorage.removeItem(SAVE_KEY);
  window.location.reload(); // Перезавантажуємо сторінку, щоб скинути все
};