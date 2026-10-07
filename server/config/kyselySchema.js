/**
 * @typedef {Object} Coin
 * @property {string} id
 * @property {string} name
 * @property {string} photo_url
 * @property {number} price
 * @property {string=} monarch
 * @property {number} year
 * @property {'Montenegro' | 'Bulgaria' | 'Serbia' | 'Romania' | 'Greece' | 'United States'} country
 * @property {string=} price_value
 * @property {string} currency
 * @property {'coin' | 'investment' | 'consumable'} product_type
 * @property {'capsules' | 'cleaning_solutions' | 'cardboard_holders'=} consumable_category
 * @property {string=} composition_metal
 * @property {string=} weight
 * @property {string=} diameter
 * @property {string=} shape
 * @property {string=} technique
 * @property {string=} denomination
 * @property {string=} lettering
 * @property {string=} script
 * @property {number=} mintage
 * @property {string=} mint_place
 * @property {string=} coin_grading
 * @property {string=} number
 * @property {'active' | 'draft' | 'sold' | 'hidden'} status
 * @property {Date} created_at
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {string=} full_name
 * @property {string=} phone
 * @property {string=} city
 * @property {string=} address
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * @typedef {Object} Order
 * @property {string} id
 * @property {string} user_id
 * @property {string} customer_name
 * @property {string} phone
 * @property {string=} email
 * @property {string} city
 * @property {string} address
 * @property {string=} delivery_notes
 * @property {string} payment_method
 * @property {'new' | 'pending' | 'confirmed' | 'packed' | 'sent' | 'completed' | 'cancelled' | 'canceled'} status
 * @property {number} total
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * @typedef {Object} OrderItem
 * @property {string} id
 * @property {string} order_id
 * @property {string=} coin_id
 * @property {string} coin_name
 * @property {string=} photo_url
 * @property {number} price
 * @property {number} quantity
 */

/**
 * @typedef {Object} Database
 * @property {import('kysely').Table<Coin>} coins
 * @property {import('kysely').Table<User>} users
 * @property {import('kysely').Table<Order>} orders
 * @property {import('kysely').Table<OrderItem>} order_items
 */
