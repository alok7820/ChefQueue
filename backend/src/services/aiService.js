import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import User from '../models/User.js';

// ======================================================
// DATE HELPERS
// ======================================================

function startOfToday() {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
}

function startOfDaysAgo(days) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return date;
}

// ======================================================
// GET COMPLETE CHEFQUEUE DATA
// ======================================================

async function buildBusinessSnapshot() {
  const today = startOfToday();
  const last7Days = startOfDaysAgo(7);
  const last30Days = startOfDaysAgo(30);

  const [
    pending,
    preparing,
    ready,
    completed,
    cancelled,

    activeOrders,

    menuItems,

    todayOrders,

    last7DayOrders,

    last30DayOrders,

    recentCompletedOrders,

    chefs,
    cashiers,
  ] = await Promise.all([
    // -------------------------------
    // ORDER COUNTS
    // -------------------------------

    Order.countDocuments({
      status: 'Pending',
    }),

    Order.countDocuments({
      status: 'Preparing',
    }),

    Order.countDocuments({
      status: 'Ready',
    }),

    Order.countDocuments({
      status: 'Completed',
    }),

    Order.countDocuments({
      status: 'Cancelled',
    }),

    // -------------------------------
    // ACTIVE ORDERS
    // -------------------------------

    Order.find({
      status: {
        $in: ['Pending', 'Preparing', 'Ready'],
      },
    })
      .sort({ createdAt: 1 })
      .limit(20),

    // -------------------------------
    // MENU
    // -------------------------------

    MenuItem.find({}).sort({
      category: 1,
      name: 1,
    }),

    // -------------------------------
    // TODAY'S ORDERS
    // -------------------------------

    Order.find({
      createdAt: {
        $gte: today,
      },
    }),

    // -------------------------------
    // LAST 7 DAYS
    // -------------------------------

    Order.find({
      createdAt: {
        $gte: last7Days,
      },
    }),

    // -------------------------------
    // LAST 30 DAYS
    // -------------------------------

    Order.find({
      createdAt: {
        $gte: last30Days,
      },
    }),

    // -------------------------------
    // RECENT COMPLETED ORDERS
    // -------------------------------

    Order.find({
      status: 'Completed',
    })
      .sort({ updatedAt: -1 })
      .limit(10),

    // -------------------------------
    // STAFF
    // -------------------------------

    User.find({
      role: 'chef',
    }).select('id name email status'),

    User.find({
      role: 'cashier',
    }).select('id name email status'),
  ]);

  // ====================================================
  // TODAY'S REVENUE
  // ====================================================

  // Only count paid orders.
  const paidTodayOrders = todayOrders.filter(
    (order) =>
      order.paymentStatus === 'Paid'
  );

  const todayRevenue = paidTodayOrders.reduce(
    (sum, order) =>
      sum + Number(order.total || 0),
    0
  );

  const todayOrderCount =
    todayOrders.length;

  const averageOrderValue =
    paidTodayOrders.length > 0
      ? todayRevenue / paidTodayOrders.length
      : 0;

  // ====================================================
  // PAYMENT INFORMATION
  // ====================================================

  const paidToday = todayOrders.filter(
    (order) =>
      order.paymentStatus === 'Paid'
  ).length;

  const unpaidToday = todayOrders.filter(
    (order) =>
      order.paymentStatus === 'Unpaid'
  ).length;

  const refundedToday = todayOrders.filter(
    (order) =>
      order.paymentStatus === 'Refunded'
  ).length;

  // ====================================================
  // SOLD-OUT MENU ITEMS
  // ====================================================

  const soldOutItems = menuItems
    .filter((item) => !item.available)
    .map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      prepTime: item.prepTime,
    }));

  // ====================================================
  // AVAILABLE MENU ITEMS
  // ====================================================

  const availableItems = menuItems
    .filter((item) => item.available)
    .map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: item.price,
      prepTime: item.prepTime,
    }));

  // ====================================================
  // TOP-SELLING ITEMS - LAST 30 DAYS
  // ====================================================

  const itemSales = {};

  for (const order of last30DayOrders) {
    // Don't count cancelled orders as sales.
    if (order.status === 'Cancelled') {
      continue;
    }

    for (const item of order.items || []) {
      const key = item.menuItem;

      if (!itemSales[key]) {
        itemSales[key] = {
          menuItemId: key,
          name: item.name,
          quantity: 0,
          revenue: 0,
        };
      }

      itemSales[key].quantity +=
        Number(item.qty || 0);

      itemSales[key].revenue +=
        Number(item.price || 0) *
        Number(item.qty || 0);
    }
  }

  const topSellingItems = Object.values(
    itemSales
  )
    .sort(
      (a, b) =>
        b.quantity - a.quantity
    )
    .slice(0, 10);

  // ====================================================
  // LAST 7 DAYS DAILY SUMMARY
  // ====================================================

  const dailySummary = {};

  for (const order of last7DayOrders) {
    const date = new Date(order.createdAt)
      .toISOString()
      .split('T')[0];

    if (!dailySummary[date]) {
      dailySummary[date] = {
        date,
        orders: 0,
        revenue: 0,
      };
    }

    dailySummary[date].orders += 1;

    if (
      order.paymentStatus === 'Paid' &&
      order.status !== 'Cancelled'
    ) {
      dailySummary[date].revenue +=
        Number(order.total || 0);
    }
  }

  const last7DaysSummary =
    Object.values(dailySummary).sort(
      (a, b) =>
        a.date.localeCompare(b.date)
    );

  // ====================================================
  // LAST 30 DAYS TOTALS
  // ====================================================

  const last30PaidOrders =
    last30DayOrders.filter(
      (order) =>
        order.paymentStatus === 'Paid' &&
        order.status !== 'Cancelled'
    );

  const last30Revenue =
    last30PaidOrders.reduce(
      (sum, order) =>
        sum + Number(order.total || 0),
      0
    );

  // ====================================================
  // WAITING TIMES
  // ====================================================

  const now = Date.now();

  const activeOrdersWithWait =
    activeOrders.map((order) => {
      const createdTime =
        new Date(order.createdAt).getTime();

      const waitMinutes = Math.max(
        0,
        Math.floor(
          (now - createdTime) / 60000
        )
      );

      return {
        orderId: order.id,
        customer: order.customer,
        table: order.table,
        status: order.status,
        priority: order.priority,
        cookingTime: order.cookingTime,
        waitMinutes,
        items: (order.items || []).map(
          (item) => ({
            name: item.name,
            quantity: item.qty,
            price: item.price,
          })
        ),
      };
    });

  // ====================================================
  // PRIORITY RANKING
  // ====================================================

  const priorityRank = {
    High: 3,
    Normal: 2,
    Low: 1,
  };

  const recommendedOrders =
    [...activeOrdersWithWait].sort(
      (a, b) => {
        const priorityDifference =
          (priorityRank[b.priority] || 0) -
          (priorityRank[a.priority] || 0);

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return (
          b.waitMinutes -
          a.waitMinutes
        );
      }
    );

  // ====================================================
  // WORKLOAD
  // ====================================================

  const totalActiveOrders =
    activeOrders.length;

  const estimatedKitchenMinutes =
    activeOrders.reduce(
      (sum, order) =>
        sum +
        Number(order.cookingTime || 0),
      0
    );

  // ====================================================
  // STAFF SUMMARY
  // ====================================================

  const activeChefs =
    chefs.filter(
      (user) =>
        user.status === 'Active'
    );

  const inactiveChefs =
    chefs.filter(
      (user) =>
        user.status !== 'Active'
    );

  const activeCashiers =
    cashiers.filter(
      (user) =>
        user.status === 'Active'
    );

  const inactiveCashiers =
    cashiers.filter(
      (user) =>
        user.status !== 'Active'
    );

  // ====================================================
  // RETURN COMPLETE SNAPSHOT
  // ====================================================

  return {
    // -------------------------------
    // ORDERS
    // -------------------------------

    orders: {
      pending,
      preparing,
      ready,
      completed,
      cancelled,
      active: activeOrdersWithWait,
    },

    // -------------------------------
    // KITCHEN
    // -------------------------------

    kitchen: {
      activeOrders: totalActiveOrders,
      estimatedWorkMinutes:
        estimatedKitchenMinutes,

      recommendedNextOrders:
        recommendedOrders.slice(0, 5),
    },

    // -------------------------------
    // MENU
    // -------------------------------

    menu: {
      totalItems: menuItems.length,

      availableCount:
        availableItems.length,

      soldOutCount:
        soldOutItems.length,

      availableItems,

      soldOutItems,
    },

    // -------------------------------
    // TODAY
    // -------------------------------

    today: {
      orderCount: todayOrderCount,

      revenue: Number(
        todayRevenue.toFixed(2)
      ),

      averageOrderValue: Number(
        averageOrderValue.toFixed(2)
      ),

      paidOrders: paidToday,

      unpaidOrders: unpaidToday,

      refundedOrders: refundedToday,
    },

    // -------------------------------
    // HISTORY
    // -------------------------------

    history: {
      last7Days: last7DaysSummary,

      last30Days: {
        orderCount:
          last30DayOrders.length,

        revenue: Number(
          last30Revenue.toFixed(2)
        ),

        topSellingItems,
      },
    },

    // -------------------------------
    // STAFF
    // -------------------------------

    staff: {
      chefs: {
        total: chefs.length,
        active: activeChefs.length,
        inactive: inactiveChefs.length,
      },

      cashiers: {
        total: cashiers.length,
        active: activeCashiers.length,
        inactive: inactiveCashiers.length,
      },
    },

    // -------------------------------
    // RECENT COMPLETED
    // -------------------------------

    recentCompletedOrders:
      recentCompletedOrders.map(
        (order) => ({
          id: order.id,
          customer: order.customer,
          table: order.table,
          total: order.total,
          paymentStatus:
            order.paymentStatus,
          priority: order.priority,
          items: (order.items || []).map(
            (item) => ({
              name: item.name,
              quantity: item.qty,
              price: item.price,
            })
          ),
          completedAt:
            order.updatedAt,
        })
      ),
  };
}

// ======================================================
// FALLBACK
// ======================================================

function fallbackReply(snapshot) {
  const {
    pending,
    preparing,
    ready,
    completed,
  } = snapshot.orders;

  const soldOut =
    snapshot.menu.soldOutItems.length;

  const revenue =
    snapshot.today.revenue;

  return `
Today there are ${pending} pending orders,
${preparing} preparing orders,
and ${ready} ready orders.

There are ${soldOut} sold-out menu item(s)
and today's paid revenue is ₹${revenue}.

Completed orders today: ${completed}.
`.trim();
}

// ======================================================
// ASK LOCAL LLM
// ======================================================

export async function askAssistant(message) {
  const snapshot =
    await buildBusinessSnapshot();

  const ollamaUrl =
    process.env.OLLAMA_URL ||
    'http://localhost:11434';

  const ollamaModel =
    process.env.OLLAMA_MODEL ||
    'llama3.2';

  // ====================================================
  // COMPLETE DATA FOR LLM
  // ====================================================

  const businessData =
    JSON.stringify(
      snapshot,
      null,
      2
    );

  // ====================================================
  // PROMPT
  // ====================================================

  const prompt = `
You are the ChefQueue AI Assistant.

ChefQueue is a restaurant management and POS system.

You are given LIVE information retrieved from the ChefQueue
MongoDB database.

Use ONLY the information provided in the data below.

IMPORTANT RULES:

1. Do not invent information.
2. Do not create fake orders.
3. Do not create fake menu items.
4. Do not create fake revenue numbers.
5. Do not claim information exists if it is not included.
6. If the requested information is not available, clearly say that
   ChefQueue does not currently have that information.
7. Give direct and useful answers.
8. When recommending an order, explain why.
9. Use the actual priority, waiting time and kitchen workload.
10. For revenue, use only the supplied revenue values.
11. Cancelled orders should not be treated as successful sales.
12. Answer in approximately 2-5 sentences unless the user asks
    for more detail.

LIVE CHEFQUEUE DATA:
${businessData}

USER QUESTION:
${message}
`;

  try {
    // ==================================================
    // CALL OLLAMA
    // ==================================================

    const response =
      await fetch(
        `${ollamaUrl}/api/chat`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify({
            model: ollamaModel,

            stream: false,

            messages: [
              {
                role: 'system',
                content:
                  'You are the official ChefQueue restaurant AI assistant. Use only the live ChefQueue data provided to you.',
              },

              {
                role: 'user',
                content: prompt,
              },
            ],
          }),
        }
      );

    if (!response.ok) {
      throw new Error(
        `Ollama API responded with status ${response.status}`
      );
    }

    const data =
      await response.json();

    const text =
      data.message?.content?.trim();

    if (!text) {
      throw new Error(
        'Ollama returned an empty response'
      );
    }

    return {
      reply: text,
      source: 'ai',
    };
  } catch (err) {
    console.error(
      '[aiService] Ollama failed:',
      err.message
    );

    return {
      reply: fallbackReply(snapshot),
      source: 'fallback',
    };
  }
}