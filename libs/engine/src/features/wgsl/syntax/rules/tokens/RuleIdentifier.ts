import { isSomeToken } from "../../../tokens.ts";
import { createRuleMatcher } from "../../MatchRule.ts";
import { ParseRuleString } from "../../ParseSyntax.ts";
import { RuleName } from "../../RuleRegistry.ts";
import { keywords } from "./RuleKeyword.ts";
import { reservedWords } from "./RuleReservedWord.ts";

export type Identifier = ParseRuleString<
  `
${RuleName.Identifier} :
| 'abc'
`
>;

export type IdentifierPattern = ParseRuleString<
  `
${RuleName.IdentifierPattern} :
| ' /([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/u'
`
>;

const regex = /([_\p{XID_Start}][\p{XID_Continue}]+)|([\p{XID_Start}])/uy;

const invalid = [...keywords, ...reservedWords, "_", "__"];

export const RuleIdentifierPattern = createRuleMatcher(
  RuleName.IdentifierPattern,
  ({ source, indexAt }) => {
    regex.lastIndex = indexAt;
    const match = regex.exec(source);

    if (match) {
      if (isSomeToken(source, indexAt, invalid)) return undefined;

      return { from: indexAt, to: indexAt + match[0].length };
    }

    return undefined;
  },
);
