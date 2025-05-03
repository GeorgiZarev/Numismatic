/**
 * @typedef {Object} Coin
 * @property {string} id
 * @property {string} name
 * @property {string} photo_url
 * @property {number} price
 * @property {string=} monarch
 * @property {number} year
 * @property {'Montenegro' | 'Bulgaria' | 'Serbia' | 'Romania' | 'Greece'} country
 * @property {string=} price_value
 * @property {string} currency
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
 * @property {Date} created_at
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} username
 * @property {string} email
 * @property {string} password
 * @property {Date} created_at
 * @property {Date} updated_at
 */

/**
 * @typedef {Object} Database
 * @property {import('kysely').Table<Coin>} coins
 * @property {import('kysely').Table<User>} users
 */
