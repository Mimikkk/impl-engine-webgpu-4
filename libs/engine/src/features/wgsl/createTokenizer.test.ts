import { expect } from "@std/expect";
import { describe, it } from "@std/testing/bdd";
import { createTokenizer } from "./createTokenizer.ts";
import { RuleType } from "./syntax/RuleRegistry.ts";

describe("createTokenizer", () => {
  it("should tokenize stream of tokens", () => {
    const source = "";
    const tokenizer = createTokenizer(source);

    expect(tokenizer.isDone()).toBe(false);

    expect(tokenizer.peek()).toEqual({ type: RuleType.ProgramStart, value: "" });

    expect(tokenizer.isDone()).toBe(false);

    expect(tokenizer.next()).toEqual({ type: RuleType.ProgramStart, value: "" });

    expect(tokenizer.isDone()).toBe(false);

    expect(tokenizer.peek()).toEqual({ type: RuleType.ProgramEnd, value: "" });

    expect(tokenizer.isDone()).toBe(false);

    expect(tokenizer.next()).toEqual({ type: RuleType.ProgramEnd, value: "" });

    expect(tokenizer.isDone()).toBe(true);

    expect(tokenizer.peek()).toEqual(undefined);

    expect(tokenizer.next()).toEqual(undefined);

    expect(tokenizer.isDone()).toBe(true);
  });
});
