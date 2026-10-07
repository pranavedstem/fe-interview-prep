import type { DashboardSnapshot, Order, SalesData } from '@/features/dashboard/types';

const FIRST_NAMES = ['Ada', 'Grace', 'Linus', 'Alan', 'Margaret', 'Dennis', 'Barbara', 'Ken'];
const LAST_NAMES = [
  'Lovelace',
  'Hopper',
  'Torvalds',
  'Turing',
  'Hamilton',
  'Ritchie',
  'Liskov',
  'Thompson',
];

let orderCounter = 0;

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(items: readonly T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function makeOrder(): Order {
  orderCounter += 1;
  return {
    id: `order-${orderCounter}`,
    customer: `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`,
    amountCents: randomInt(500, 50000),
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchSnapshot(seq: number): Promise<DashboardSnapshot> {
  await delay(randomInt(200, 1500));

  const sales: SalesData = {
    totalCents: randomInt(1_000_000, 5_000_000),
    orderCount: randomInt(80, 400),
    changePct: randomInt(-120, 180) / 10,
  };

  const newOrders = Array.from({ length: randomInt(0, 2) }, makeOrder);

  return { seq, sales, activeUsers: randomInt(50, 900), newOrders };
}
