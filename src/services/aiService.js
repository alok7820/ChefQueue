import { delay } from './api';
import { ORDERS } from '../data/mockData';

const canned = [
  "Right now the kitchen has {preparing} orders in progress and {pending} waiting to start. Table T-6 and T-11 have been waiting longest — I'd prioritize those next.",
  'Average prep time across active orders is running about 18 minutes. Butter Chicken and Veg Biryani are your slowest movers this hour.',
  "Today's summary: {total} orders placed, {completed} completed, revenue trending about 12% above yesterday's pace at this hour.",
  "Kitchen workload is moderate — 3 stations active, no bottlenecks. Ready to take on 4-5 more orders before things get tight.",
];

export const aiService = {
  async ask(message) {
    await delay(700);
    const preparing = ORDERS.filter((o) => o.status === 'Preparing').length;
    const pending = ORDERS.filter((o) => o.status === 'Pending').length;
    const completed = ORDERS.filter((o) => o.status === 'Completed').length;
    const reply = canned[Math.floor(Math.random() * canned.length)]
      .replace('{preparing}', preparing)
      .replace('{pending}', pending)
      .replace('{total}', ORDERS.length)
      .replace('{completed}', completed);
    return { reply };
  },
};


