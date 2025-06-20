import type { RuleRegistry } from "./RuleRegistry.ts";
import type { Alternative, Element, Group, GroupRelation, Rule, Token } from "./syntax.ts";

export type RuleString<T extends Rule> = `\n${T["name"]} :\n${AlternativesString<T["alternatives"]>}\n`;

type JoinAlternatives<T extends string[]> = T extends [infer A extends string] ? `| ${A}`
  : T extends [infer A extends string, ...infer B extends string[]] ? `| ${A}\n${JoinAlternatives<B>}`
  : never;

type AsTokenStrings<T extends readonly string[]> = T extends
  readonly [infer A extends string, ...infer B extends string[]] ? [`'${A}'`, ...AsTokenStrings<B>]
  : [];

export type ParseRule<Name extends string, T extends string | string[] | readonly string[]> = T extends string[]
  ? { name: Name; alternatives: ParseAlternativesString<JoinAlternatives<T>> }
  : T extends readonly string[]
    ? { name: Name; alternatives: ParseAlternativesString<JoinAlternatives<AsTokenStrings<T>>> }
  : T extends string ? { name: Name; alternatives: ParseAlternativesString<T> }
  : never;

type Join<T extends string[], Separator extends string> = T extends [infer H extends string] ? H
  : T extends [infer H extends string, ...infer R extends string[]] ? `${H}${Separator}${Join<R, Separator>}`
  : never;

type Split<T extends string, Separator extends string> = T extends `${infer A}${Separator}${infer B}`
  ? [A, ...Split<B, Separator>]
  : [T];

type StringifyRelation<T extends GroupRelation> = {
  "optional": "?";
  "at-least-one": "+";
  "one": "";
  "zero-or-more": "*";
  "one-of": "|";
}[T];

type RelationString<T extends GroupRelation> = T extends "one" ? "" : `.${StringifyRelation<T>}`;
type TokenString<T extends Token> = `'${T["pattern"]}'`;

type AlternativeString<T extends Alternative> = `| ${ElementsString<T>}`;

type AlternativesStrings<T extends Alternative[]> = T extends
  [infer A extends Alternative, ...infer As extends Alternative[]] ? [AlternativeString<A>, ...AlternativesStrings<As>]
  : [];

type AlternativesString<T extends Alternative[]> = Join<AlternativesStrings<T>, "\n">;

type GroupString<T extends Group> = `(${GroupElementsString<T["elements"]>})${RelationString<T["relation"]>}`;

type ElementString<T extends Element> = T extends Token ? TokenString<T>
  : T extends Rule ? T["name"]
  : T extends Group ? GroupString<T>
  : never;

type ElementsStrings<T extends Element[]> = T extends [infer E extends Element, ...infer Es extends Element[]]
  ? [ElementString<E>, ...ElementsStrings<Es>]
  : [];

type ElementsString<T extends Element[]> = Join<ElementsStrings<T>, " ">;
type GroupElementsString<T extends Element[]> = Join<ElementsStrings<T>, ".">;

type SplitAlternativesString<T extends string> = Split<T, "\n">;
type ParseAlternativesString<T extends string> = ParseAlternativesStrings<SplitAlternativesString<T>>;
type ParseAlternativesStrings<T extends string[]> = T extends [infer A extends string, ...infer B extends string[]]
  ? [ParseAlternativeString<A>, ...ParseAlternativesStrings<B>]
  : [];

type ParseAlternativeString<T extends string> = T extends `| ${infer ElementsString}`
  ? Alternative<ParseElementsString<ElementsString>>
  : never;

type ParseGroupRelationString<T extends string> = T extends `.${infer GroupRelationString}`
  ? GroupRelationString extends "?" ? "optional"
  : GroupRelationString extends "+" ? "at-least-one"
  : GroupRelationString extends "*" ? "zero-or-more"
  : "one"
  : "one";

type SplitElementsString<T extends string> = Split<T, " ">;
type ParseElementsString<T extends string> = ParseElementsStrings<SplitElementsString<T>>;
type ParseElementsStrings<T extends string[]> = T extends [infer A extends string, ...infer B extends string[]]
  ? [ParseElementString<A>, ...ParseElementsStrings<B>]
  : [];

type SplitGroupElementsString<T extends string> = Split<T, ".">;
type ParseGroupElementsString<T extends string> = ParseGroupElementsStrings<SplitGroupElementsString<T>>;
type ParseGroupElementsStrings<T extends string[]> = T extends [infer A extends string, ...infer B extends string[]]
  ? [ParseElementString<A>, ...ParseGroupElementsStrings<B>]
  : [];

type ParseElementString<T extends string> = ParseGroupString<T> extends never
  ? ParseTokenString<T> extends never ? T extends keyof RuleRegistry ? RuleRegistry[T] : never
  : ParseTokenString<T>
  : ParseGroupString<T>;

type ParseTokenString<T extends string> = T extends `'${infer Pattern}'` ? Token<{ pattern: Pattern }> : never;
type ParseGroupString<T extends string> = T extends `(${infer ElementsString})${infer RelationString}`
  ? Group<{ elements: ParseGroupElementsString<ElementsString>; relation: ParseGroupRelationString<RelationString> }>
  : never;
