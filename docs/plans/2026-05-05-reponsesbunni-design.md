# Page ReponsesBunni Design

## Goal

Add a private `/reponsesbunni` page for the site owner to read submitted responses in arrival order without changing the public anonymity model for visitors.

## Constraints

- The public site must keep using the anonymous Supabase client.
- Reading `responses` must happen server-side with the service role key only.
- Access must be protected by a single password stored in an environment variable.
- The route should remain simple and maintainable inside the App Router.

## Chosen Approach

- Create a server-only Supabase admin client using `SUPABASE_SERVICE_ROLE_KEY`.
- Add a lightweight password gate for `/reponsesbunni` using a server action and an `httpOnly` cookie.
- Sign the cookie value deterministically from the configured password so a forged static cookie cannot bypass access.
- Render the page as a server component. If the cookie is invalid, show the password form. If valid, fetch and render rows from `responses` ordered by `created_at` ascending.

## Security Notes

- The page is private by route-level password, not by public RLS changes.
- No public read policy is added to Supabase.
- The cookie is `httpOnly`, `sameSite=lax`, scoped to `/reponsesbunni`, and marked `secure` in production.

## Testing

- Unit test the authentication helpers: matching password, signed session token validation, invalid token rejection.
- Verify the page/build locally once dependencies are installed.
