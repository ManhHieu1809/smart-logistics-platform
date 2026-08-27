export const paths = {
  login: '/login',

  dashboard: '/dashboard',

  customers: {
    root: '/customers',
    create: '/customers/new',
    detail: '/customers/:id',
    edit: '/customers/:id/edit',
  },

  products: {
    root: '/products',
    create: '/products/new',
    detail: '/products/:id',
    edit: '/products/:id/edit',
  },

  warehouses: {
    root: '/warehouses',
    create: '/warehouses/new',
    detail: '/warehouses/:id',
    edit: '/warehouses/:id/edit',
  },

  inventory: {
    root: '/inventory',
    transactions: '/inventory/transactions',
  },

  orders: {
    root: '/orders',
    create: '/orders/new',
    detail: '/orders/:id',
  },

  notifications: '/notifications',

  admin: {
    users: '/admin/users',
    createUser: '/admin/users/new',
    userDetail: '/admin/users/:id',
    roles: '/admin/roles',
    auditLogs: '/admin/audit-logs',
  },

  profile: '/profile',
} as const;