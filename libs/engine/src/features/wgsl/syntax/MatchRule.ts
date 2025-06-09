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
}

export interface Match {
  (context: MatchRuleContext): number | undefined;
}

export interface MatchRule<R extends RuleName, A extends MatchRule<any, any> | undefined> {
  (context: MatchRuleContext): MatchRuleResult<R, A> | undefined;
}

const createMatchResult = <R extends RuleName, A extends MatchRule<any, any> | undefined>(
  type: R,
  subtype: A,
  from: number,
  size: number,
): MatchRuleResult<R, A> => ({ type, subtype, from, to: from + size, size });

export const createMatch = <R extends RuleName>(name: R, match: Match): MatchRule<R, undefined> => (context) => {
  const result = match(context);

  return result ? createMatchResult(name, undefined, context.indexAt, result) : undefined;
};

export const composeAlternatives =
  <R extends RuleName, A extends MatchRule<any, any>>(name: R, alternatives: A[]): MatchRule<R, A> => (context) => {
    let bestSize: number | undefined;
    let bestAlternative: A | undefined;

    for (let i = 0; i < alternatives.length; ++i) {
      const alternative = alternatives[i];
      const candidate = alternative(context);

      if (!candidate) continue;

      if (bestSize === undefined || bestSize < candidate.size) {
        bestSize = candidate.size;
        bestAlternative = alternative;
      }
    }

    return bestSize === undefined || bestAlternative === undefined
      ? undefined
      : createMatchResult(name, bestAlternative, context.indexAt, bestSize);
  };

export const createMatchRegex = <R extends RuleName>(name: R, regexes: RegExp[]) =>
  createMatch(name, ({ source, indexAt }) => {
    let bestSize: number | undefined;

    for (let i = 0; i < regexes.length; ++i) {
      const regex = regexes[i];
      regex.lastIndex = indexAt;

      const match = regex.exec(source);

      if (!match) continue;
      const length = match[0].length;

      if (bestSize === undefined || bestSize < length) {
        bestSize = length;
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
