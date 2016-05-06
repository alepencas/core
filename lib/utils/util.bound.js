/**
 * @file bind with memoization
 */

/**
 * @param {object} ctx Context.
 * @param {String} fn Function name.
 */
export default function bound(ctx, fn) {
    return ctx['__bound_' + fn] || (ctx['__bound_' + fn] = ctx[fn].bind(ctx));
};
