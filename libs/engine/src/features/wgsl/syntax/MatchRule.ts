import { isToken } from "../tokens.ts";
import type { RuleName } from "./RuleRegistry.ts";

export interface MatchRuleResult<R extends RuleName, A extends MatchRule<any, any> | undefined> {
  type: R;
  subtype: A;
  from: number;
  to: number;
  size: number;
}

export interface MatchRuleContext {
  source: string;
  indexAt: number;
  match?: MatchRuleResult<any, any>;
}

export interface Match {
  (context: MatchRuleContext): number | undefined;
}

export interface MatchRule<R extends RuleName, A extends MatchRule<any, any> | undefined> {
  rule: R;
  (context: MatchRuleContext): MatchRuleResult<R, A> | undefined;
  matches(context: MatchRuleContext): boolean;
  advance(context: MatchRuleContext): number | undefined;
}

const createMatchResult = <R extends RuleName, A extends MatchRule<any, any> | undefined>(
  type: R,
  subtype: A,
  from: number,
  size: number,
  into: MatchRuleResult<R, A> = { type, subtype, from, to: from + size, size },
): MatchRuleResult<R, A> => {
  into.type = type;
  into.subtype = subtype;
  into.from = from;
  into.to = from + size;
  into.size = size;

  return into;
};

export const createMatch = <R extends RuleName>(name: R, match: Match): MatchRule<R, undefined> => {
  const rule: MatchRule<R, undefined> = (context) => {
    const size = match(context);

    if (size === undefined) return;

    return createMatchResult(name, undefined, context.indexAt, size, context.match);
  };

  rule.rule = name;
  rule.matches = (context) => match(context) !== undefined;
  rule.advance = (context) => {
    const size = match(context);
    if (size === undefined) return;
    return size;
  };

  return rule;
};

export const composeAlternatives = <R extends RuleName, A extends MatchRule<any, any>>(
  name: R,
  alternatives: A[],
): MatchRule<R, A> => {
  const rule: MatchRule<R, A> = (context) => {
    let bestCandidate: MatchRuleResult<R, A> | undefined;
    let bestAlternative: A | undefined;

    for (let i = 0; i < alternatives.length; ++i) {
      const alternative = alternatives[i];
      const candidate = alternative(context);

      if (!candidate) continue;

      if (bestCandidate === undefined || bestCandidate.size < candidate.size) {
        bestCandidate = candidate;
        bestAlternative = alternative;
      }
    }

    return bestCandidate === undefined
      ? undefined
      : createMatchResult(name, bestAlternative, context.indexAt, bestCandidate.size, context.match);
  };

  rule.rule = name;
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

export const createMatchRegex = <R extends RuleName>(name: R, regexes: RegExp[]) =>
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

export const createMatchToken = <R extends RuleName>(name: R, tokens: string[]) =>
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
