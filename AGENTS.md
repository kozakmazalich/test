# Project Agent Workflow

Use the globally installed `agent-skills` pack as the default development workflow for this repository.

## Default skill selection

Start with `using-agent-skills` to choose the right workflow for the task.

For most non-trivial changes, follow this sequence:

1. `spec-driven-development`
2. `planning-and-task-breakdown`
3. `incremental-implementation`
4. `test-driven-development`
5. `code-review-and-quality`

## Apply additional skills when relevant

- `frontend-ui-engineering` for UI and accessibility work
- `api-and-interface-design` for APIs and module boundaries
- `debugging-and-error-recovery` for failing builds, tests, or runtime bugs
- `security-and-hardening` for auth, secrets, input handling, and external integrations
- `performance-optimization` for performance-sensitive changes
- `documentation-and-adrs` for documenting important technical decisions
- `shipping-and-launch` before production release work

## Expectations

- Prefer small, verifiable changes
- Verify behavior with tests or other concrete evidence
- Avoid unrelated refactors
- Surface assumptions and tradeoffs before making non-obvious decisions
