export const generateDummyUsers = (count: number) => {
  const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Charles', 'Karen'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
  
  return Array.from({ length: count }).map((_, i) => {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    return {
      id: `USR-${1000 + i}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`,
      avatar: `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`,
      points: Math.floor(Math.random() * 50000) + 1000,
      joinedAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
      status: Math.random() > 0.1 ? 'Active' : 'Inactive',
    };
  });
};

export const generateDummyRequests = (count: number, users: any[]) => {
  const giftCards = ['Amazon $50', 'Starbucks $25', 'Target $100', 'Walmart $50', 'Uber $25'];
  const statuses = ['Pending', 'Approved', 'Rejected'];
  
  return Array.from({ length: count }).map((_, i) => {
    const user = users[Math.floor(Math.random() * users.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    return {
      id: `REQ-${8000 + i}`,
      user,
      giftCard: giftCards[Math.floor(Math.random() * giftCards.length)],
      points: Math.floor(Math.random() * 500) * 100 + 1000, // E.g., 2000, 5000
      date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
      status,
    };
  });
};

export const dummyUsers = generateDummyUsers(2000);
export const dummyRequests = generateDummyRequests(3500, dummyUsers);

export const generateDummyTransactions = (count: number) => {
  const types = ['Earning', 'Redemption', 'System Bonus', 'Refund'];
  return Array.from({ length: count }).map((_, i) => {
    const type = types[Math.floor(Math.random() * types.length)];
    const isPositive = type !== 'Redemption';
    return {
      id: `TXN-${987000 + i}`,
      user: dummyUsers[Math.floor(Math.random() * dummyUsers.length)],
      type,
      amount: Math.floor(Math.random() * 500) * 100 + 100,
      isPositive,
      date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString(),
      status: Math.random() > 0.05 ? 'Success' : 'Failed',
    };
  });
};

export const dummyTransactions = generateDummyTransactions(4000);
