# AI Usage Review

**Tool:** Claude (Anthropic), used through Claude Code in the terminal.

**How I used it.** I worked step by step: for each step, the AI proposed a plan and asked about decisions it shouldn't make alone. I approved or changed the plan, the AI wrote the code, and I committed each step.

**Key prompts**
1. Pasted the brief: "Don't assume anything, ask me if you have any doubts… we both have to work in a collaborative manner so that I know things."
2. Answers to its clarifying questions (mock approach, KYC source, Bootstrap usage, currency, link behaviour, KYC error handling, yield input).
3. "Go ahead with Step N" for each of the seven steps, after reviewing each plan.

**What the AI got right**
- Governance enforced by tooling: Stylelint rejects hardcoded design values outside `_theme.scss`, and it proved this against the Stage 1 violations (`8px`, `#1A3A5C`, `12px`).
- Separate empty states for "nothing listed" and "no matches for your filters", because they need different actions.
- Showing existing data when a background refetch fails, instead of replacing the listings with an error screen.
**What was wrong or needed correcting**
- Its plan assumed ESLint and an explicit `"strict": true`. The template ships oxlint and no `strict` line, so we added it explicitly.
- Its Stage 1 `ApiError` used constructor parameter properties, which don't compile with the template's `erasableSyntaxOnly` setting. It was rewritten.
- The Stage 1 answer cast responses with `as T`. Here every response goes through a runtime parser instead.
- Its own progress bar used an inline `style`, which the lint rule we added then flagged. We kept it as a documented exception, because the width is data, not a design value.
- It added things beyond the brief (a "Sold out" state, a yield row on the card, a `?kyc=error` toggle). I reviewed each one and kept all three, because each fixes a real gap: a sold-out property shouldn't say "Low availability", users filter by yield so the card should show it, and reviewers need a way to see the fail-closed KYC state.

**What I changed myself**
My role was directing and reviewing rather than typing. I set the ground rule up front: no assumptions, ask before every decision. Then I made the calls that shaped the code:
- **Currency as a typed prop** instead of a fixed currency, so the card scales across UAE and US markets.
- **A real link to `/properties/:id`** instead of the callback prop the AI listed first, so the card behaves like production navigation.
- **KYC fails closed:** if the status can't be loaded, investing is shown as unavailable rather than silently looking "approved". On a regulated platform, that was the deciding factor.
- **Filters in the URL**, so a filtered view survives refresh and can be shared.
I verified the mock API scenarios in the browser before building on them. I also rewrote two mismatched commit messages with an interactive rebase so the history matches the code.
