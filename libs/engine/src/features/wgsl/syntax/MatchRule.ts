import type { RuleName } from "./RuleRegistry.ts";

export interface RuleMatchResult<T extends RuleName, A extends RuleMatch<T, A> | undefined = undefined> {
  rule: T;
  child: A;
  from: number;
  to: number;
  length: number;
}

export interface MatchContext {
  source: string;
  indexAt: number;
}

export interface MatchResult {
  from: number;
  to: number;
}

export interface Match {
  (context: MatchContext): MatchResult | undefined;
}

export interface RuleMatch<T extends RuleName, A extends RuleMatch<T, A> | undefined = undefined> {
  (context: MatchContext): RuleMatchResult<T, A> | undefined;
}

export interface MatchComposeStrategy<T extends RuleName, A extends RuleMatch<T, A> | undefined> {
  (best: RuleMatchResult<T, A>, current: RuleMatchResult<T, A>): boolean;
}

export const createComposeStrategy = <T extends RuleName, A extends RuleMatch<T, A> | undefined>(
  strategy: MatchComposeStrategy<T, A>,
): MatchComposeStrategy<T, A> => strategy;

const createMatchResult = <R extends RuleName, A extends RuleMatch<R, A> | undefined>(
  name: R,
  child: A,
  { from, to }: MatchResult,
): RuleMatchResult<R, A> => ({
  rule: name,
  child,
  from,
  to,
  length: to - from,
});

export const createRuleMatcher = <T extends RuleName>(
  name: T,
  match: Match,
): RuleMatch<T> =>
(context) => {
  const result = match(context);
  return result ? createMatchResult(name, undefined, result) : undefined;
};

export const composeRuleAlternatives = <T extends RuleName, A extends RuleMatch<T, A>>(
  name: T,
  rules: A[],
  strategy: MatchComposeStrategy<T, A>,
): RuleMatch<T, A> =>
(context) => {
  let best: RuleMatchResult<T, A> | undefined;
  let bestrule: A | undefined;

  for (const rule of rules) {
    const candidate = rule(context) as unknown as RuleMatchResult<T, A>;

    if (candidate) {
      if (!best || strategy(best, candidate)) {
        best = candidate;
        bestrule = rule;
      }
    }
  }

  return best ? createMatchResult(name, bestrule!, best) : undefined;
};

const LongestStrategy = createComposeStrategy((a, b) => a.length < b.length);
export const composeLongestRuleMatcher = <R extends RuleName, A extends RuleMatch<any, any>>(
  name: R,
  alternatives: A[],
): RuleMatch<R, A> => composeRuleAlternatives(name, alternatives, LongestStrategy);

export const createLongestRegexRuleMatcher = <R extends RuleName>(name: R, regexes: RegExp[]) =>
  createRuleMatcher(
    name,
    ({ source, indexAt }) => {
      let longestMatch = -1;

      for (let i = 0; i < regexes.length; ++i) {
        const regex = regexes[i];
        regex.lastIndex = indexAt;

        const match = regex.exec(source);

        if (match) {
          const length = match[0].length;

          if (longestMatch < length) {
            longestMatch = length;
          }
        }
      }

      if (longestMatch > 0) {
        return { from: indexAt, to: indexAt + longestMatch };
      }

      return undefined;
    },
  );
