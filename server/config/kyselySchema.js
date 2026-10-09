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
 * @property {Date | null} restocked_at
 * @property {number} stock_quantity
 * @property {'hide' | 'show' | 'review_delete'} zero_stock_action
 * @property {Date | null} expected_delivery_date
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string=} username Legacy field, unused for new accounts
 * @property {string} email
 * @property {string} password
 * @property {string=} full_name
 * @property {string=} phone
 * @property {string=} city
 * @property {string=} address
 * @property {Date=} birth_date
 * @property {'en' | 'bg'=} preferred_language
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
 * @property {string=} postal_code
 * @property {string=} address_line_2
 * @property {string=} country
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
