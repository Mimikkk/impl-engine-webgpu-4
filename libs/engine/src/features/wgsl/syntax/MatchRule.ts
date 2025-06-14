import { isToken } from "../tokens.ts";

export interface MatchRuleResult<Ts extends string[]> {
  types: Ts;
  from: number;
  to: number;
  size: number;
}

export interface MatchRuleContext {
  source: string;
  indexAt: number;
  match?: MatchRuleResult<any>;
}

export interface Match {
  (context: MatchRuleContext): number | undefined;
}

export interface MatchRule<T extends string[]> {
  (context: MatchRuleContext): MatchRuleResult<T> | undefined;
  matches(context: MatchRuleContext): boolean;
  advance(context: MatchRuleContext): number | undefined;
}

const createMatchResult = <Ts extends string[]>(
  types: Ts,
  from: number,
  size: number,
  into: MatchRuleResult<Ts> = { types, from, to: from + size, size },
): MatchRuleResult<Ts> => {
  into.types = types;
  into.from = from;
  into.to = from + size;
  into.size = size;

  return into;
};

export const createMatch = <T extends string>(type: T, match: Match): MatchRule<[T]> => {
  const rule: MatchRule<[T]> = (context) => {
    const size = match(context);

    if (size === undefined) return;

    return createMatchResult([type], context.indexAt, size, context.match);
  };

  rule.matches = (context) => match(context) !== undefined;
  rule.advance = (context) => {
    const size = match(context);
    if (size === undefined) return;
    return size;
  };

  return rule;
};

type InferRuleName<T> = T extends MatchRule<infer R> ? R : never;
type InferRuleNames<T extends any[]> = T extends [infer R, ...infer RA] ? [InferRuleName<R>, ...InferRuleNames<RA>]
  : [];

export const composeAlternatives = <R extends string, const A extends MatchRule<any>[]>(
  name: R,
  alternatives: A,
): MatchRule<[R, ...InferRuleNames<A>[number]]> => {
  const rule: MatchRule<[R, ...InferRuleNames<A>]> = (context) => {
    let best: MatchRuleResult<InferRuleNames<A>> | undefined;

    for (let i = 0; i < alternatives.length; ++i) {
      const alternative = alternatives[i];
      const candidate = alternative(context);

      if (!candidate) continue;

      if (best === undefined || best.size < candidate.size) {
        best = candidate;
      }
    }

    return best ? createMatchResult([name, ...best.types], context.indexAt, best.size, context.match) : undefined;
  };

  rule.matches = (context) => alternatives.some((alternative) => alternative.matches(context));

  rule.advance = (context) => {
    let bestSize: number | undefined;

    for (let i = 0; i < alternatives.length; ++i) {
      const alternative = alternatives[i];
      const size = alternative.advance(context);
      if (size === undefined) continue;
      if (bestSize === undefined || bestSize < size) {
        bestSize = size;
      }
    }

    return bestSize;
  };

  return rule;
};

export const createMatchRegex = <R extends string>(name: R, regexes: RegExp[]) =>
  createMatch(name, ({ source, indexAt }) => {
    let bestSize: number | undefined;

    for (let i = 0; i < regexes.length; ++i) {
      const regex = regexes[i];
      regex.lastIndex = indexAt;

      const match = regex.exec(source);

      if (!match) continue;
      const size = match[0].length;

      if (bestSize === undefined || bestSize < size) {
        bestSize = size;
      }
    }

    return bestSize;
  });

export const createMatchToken = <R extends string>(name: R, tokens: string[]) =>
  createMatch(name, ({ source, indexAt }) => {
    let bestSize: number | undefined;

    for (let i = 0; i < tokens.length; ++i) {
      const token = tokens[i];

      if (!isToken(source, indexAt, token)) continue;
      const size = token.length;

      if (bestSize === undefined || bestSize < size) {
        bestSize = size;
      }
    }

    return bestSize;
  });
