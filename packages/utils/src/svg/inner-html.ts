// @ts-nocheck
interface Policy {
   createHTML: (s: string) => string
}

let policy: undefined | null | Policy

/**
 * Attempt to create policy
 */
function createPolicy() {
   try {
      policy = window.trustedTypes.createPolicy('iconizza', {
         createHTML: s => s,
      }) as Policy
   }
   catch (err) {
      policy = null
   }
}

/**
 * Clean up value for innerHTML assignment
 *
 * This code doesn't actually clean up anything.
 * It is intended be used with Iconizza icon data, which has already been validated
 */
export function cleanUpInnerHTML(html: string): string {
   if (policy === undefined)
      createPolicy()

   return policy ? (policy.createHTML(html) as unknown as string) : html
}
