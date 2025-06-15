import { expect } from "@std/expect/expect";
import { describe, it } from "@std/testing/bdd";
import { Str } from "../../../../shared/src/mod.ts";
import { createNode, parseWgsl } from "./parseWgsl.ts";
import { TokenEnableExtensionName } from "./rules/tokens/names/RuleEnableExtensionName.ts";
import { TokenKeyword } from "./rules/tokens/RuleKeyword.ts";
import { TokenSyntactic } from "./rules/tokens/RuleSyntacticToken.ts";
import { RuleType } from "./syntax/RuleRegistry.ts";

describe("WGSL - Parse", () => {
  describe("Directives", () => {
    describe("Diagnostic", () => {
      it("should handle one name", () => {
        const source = Str.trimlines`
        diagnostic 1:1: error: test
        `;
      });
    });

    describe("Enable", () => {
      it("should handle one name", () => {
        const source = Str.trimlines`
        enable f16;
        `;
        const result = parseWgsl(source);

        expect(result).toEqual(
          createNode({
            type: RuleType.TranslationUnit,
            children: [
              {
                type: RuleType.Directive,
                children: [
                  {
                    type: RuleType.DirectiveEnable,
                    children: [
                      {
                        type: RuleType.Keyword,
                        value: TokenKeyword.Enable,
                      },
                      {
                        type: RuleType.DirectiveEnableExtensionList,
                        children: [
                          {
                            type: RuleType.EnableExtensionName,
                            value: TokenEnableExtensionName.F16,
                          },
                        ],
                      },
                      {
                        type: RuleType.Syntactic,
                        value: TokenSyntactic.Semicolon,
                      },
                    ],
                  },
                ],
              },
            ],
          }),
        );
      });

      it("should handle multiple names", () => {
        const source = Str.trimlines`
        enable f16, clip_distances;
        `;
        const result = parseWgsl(source);

        expect(result).toEqual(
          createNode({
            type: RuleType.TranslationUnit,
            children: [
              {
                type: RuleType.Directive,
                children: [
                  {
                    type: RuleType.DirectiveEnable,
                    children: [
                      {
                        type: RuleType.Keyword,
                        value: TokenKeyword.Enable,
                      },
                      {
                        type: RuleType.DirectiveEnableExtensionList,
                        children: [
                          {
                            type: RuleType.EnableExtensionName,
                            value: TokenEnableExtensionName.F16,
                          },
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.Comma,
                          },
                          {
                            type: RuleType.EnableExtensionName,
                            value: TokenEnableExtensionName.ClipDistances,
                          },
                        ],
                      },
                      {
                        type: RuleType.Syntactic,
                        value: TokenSyntactic.Semicolon,
                      },
                    ],
                  },
                ],
              },
            ],
          }),
        );
      });

      it("should handle multiple names", () => {
        const source = Str.trimlines`
        enable f16, clip_distances,;
        `;
        const result = parseWgsl(source);

        expect(result).toEqual(
          createNode({
            type: RuleType.TranslationUnit,
            children: [
              {
                type: RuleType.Directive,
                children: [
                  {
                    type: RuleType.DirectiveEnable,
                    children: [
                      {
                        type: RuleType.Keyword,
                        value: TokenKeyword.Enable,
                      },
                      {
                        type: RuleType.DirectiveEnableExtensionList,
                        children: [
                          {
                            type: RuleType.EnableExtensionName,
                            value: TokenEnableExtensionName.F16,
                          },
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.Comma,
                          },
                          {
                            type: RuleType.EnableExtensionName,
                            value: TokenEnableExtensionName.ClipDistances,
                          },
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.Comma,
                          },
                        ],
                      },
                      {
                        type: RuleType.Syntactic,
                        value: TokenSyntactic.Semicolon,
                      },
                    ],
                  },
                ],
              },
            ],
          }),
        );
      });
    });

    describe.only("Requires", () => {
      it("should handle one name", () => {
        const source = Str.trimlines`
        requires 1.0;
        `;
      });
    });
  });
});
