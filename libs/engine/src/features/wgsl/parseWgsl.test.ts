import { expect } from "@std/expect/expect";
import { describe, it } from "@std/testing/bdd";
import { Str } from "../../../../shared/src/mod.ts";
import { ASTNode, parseWgsl } from "./parseWgsl.ts";
import { RuleType } from "./syntax/RuleRegistry.ts";
import { TokenKeyword } from "./tokens/MatchTokenKeyword.ts";
import { TokenSyntactic } from "./tokens/MatchTokenSyntacticToken.ts";
import { TokenDiagnosticName } from "./tokens/names/MatchTokenDiagnosticName.ts";
import { TokenEnableExtensionName } from "./tokens/names/MatchTokenEnableExtensionName.ts";
import { TokenSeverityControlName as TokenDiagnosticSeverityName } from "./tokens/names/MatchTokenSeverityControlName.ts";
import { TokenSoftwareExtensionName } from "./tokens/names/MatchTokenSoftwareExtensionName.ts";

type Tree = { type: RuleType; children: Tree[] } | { type: RuleType; value: string };

export const createNode = (node: Tree): ASTNode => {
  if ("value" in node) {
    return ASTNode.create(node.type, node.value, []);
  }

  return ASTNode.fromChildren(node.type, node.children.map(createNode));
};

describe("WGSL - Parse", () => {
  describe("Directives", () => {
    describe("Diagnostic", () => {
      it("should handle diagnostic", () => {
        const source = Str.trimlines`
        diagnostic (${TokenDiagnosticSeverityName.Error}, ${TokenDiagnosticName.DerivativeUniformity});
        `;
        const result = parseWgsl(source);

        expect(result).toEqual(
          createNode({
            type: RuleType.TranslationUnit,
            children: [
              {
                type: RuleType.GlobalDirective,
                children: [
                  {
                    type: RuleType.DirectiveDiagnostic,
                    children: [
                      {
                        type: RuleType.Keyword,
                        value: TokenKeyword.Diagnostic,
                      },
                      {
                        type: RuleType.DiagnosticControl,
                        children: [
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.LeftParenthesis,
                          },
                          {
                            type: RuleType.DiagnosticSeverityName,
                            value: TokenDiagnosticSeverityName.Error,
                          },
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.Comma,
                          },
                          {
                            type: RuleType.DiagnosticName,
                            value: TokenDiagnosticName.DerivativeUniformity,
                          },
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.RightParenthesis,
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

      it("should handle diagnostic with comma", () => {
        const source = Str.trimlines`
        diagnostic (${TokenDiagnosticSeverityName.Error}, ${TokenDiagnosticName.DerivativeUniformity},);
        `;
        const result = parseWgsl(source);

        expect(result).toEqual(
          createNode({
            type: RuleType.TranslationUnit,
            children: [
              {
                type: RuleType.GlobalDirective,
                children: [
                  {
                    type: RuleType.DirectiveDiagnostic,
                    children: [
                      {
                        type: RuleType.Keyword,
                        value: TokenKeyword.Diagnostic,
                      },
                      {
                        type: RuleType.DiagnosticControl,
                        children: [
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.LeftParenthesis,
                          },
                          {
                            type: RuleType.DiagnosticSeverityName,
                            value: TokenDiagnosticSeverityName.Error,
                          },
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.Comma,
                          },
                          {
                            type: RuleType.DiagnosticName,
                            value: TokenDiagnosticName.DerivativeUniformity,
                          },
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.Comma,
                          },
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.RightParenthesis,
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
                type: RuleType.GlobalDirective,
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

      it("should handle one name with comma at the end", () => {
        const source = Str.trimlines`
        enable f16,;
        `;
        const result = parseWgsl(source);

        expect(result).toEqual(
          createNode({
            type: RuleType.TranslationUnit,
            children: [
              {
                type: RuleType.GlobalDirective,
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
                type: RuleType.GlobalDirective,
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

      it("should handle multiple names with comma at the end", () => {
        const source = Str.trimlines`
        enable f16, clip_distances,;
        `;
        const result = parseWgsl(source);

        expect(result).toEqual(
          createNode({
            type: RuleType.TranslationUnit,
            children: [
              {
                type: RuleType.GlobalDirective,
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

    describe("Requires", () => {
      it("should handle one name", () => {
        const source = Str.trimlines`
        requires ${TokenSoftwareExtensionName.ReadonlyAndReadwriteStorageTextures};
        `;
        const result = parseWgsl(source);

        expect(result).toEqual(
          createNode({
            type: RuleType.TranslationUnit,
            children: [
              {
                type: RuleType.GlobalDirective,
                children: [
                  {
                    type: RuleType.DirectiveRequires,
                    children: [
                      {
                        type: RuleType.Keyword,
                        value: TokenKeyword.Requires,
                      },
                      {
                        type: RuleType.DirectiveRequiresSoftwareExtensionList,
                        children: [
                          {
                            type: RuleType.SoftwareExtensionName,
                            value: TokenSoftwareExtensionName.ReadonlyAndReadwriteStorageTextures,
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

      it("should handle one name with comma at the end", () => {
        const source = Str.trimlines`
        requires ${TokenSoftwareExtensionName.ReadonlyAndReadwriteStorageTextures},;
        `;
        const result = parseWgsl(source);

        expect(result).toEqual(
          createNode({
            type: RuleType.TranslationUnit,
            children: [
              {
                type: RuleType.GlobalDirective,
                children: [
                  {
                    type: RuleType.DirectiveRequires,
                    children: [
                      {
                        type: RuleType.Keyword,
                        value: TokenKeyword.Requires,
                      },
                      {
                        type: RuleType.DirectiveRequiresSoftwareExtensionList,
                        children: [
                          {
                            type: RuleType.SoftwareExtensionName,
                            value: TokenSoftwareExtensionName.ReadonlyAndReadwriteStorageTextures,
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

      it("should handle multiple names", () => {
        const source = Str.trimlines`
        requires ${TokenSoftwareExtensionName.ReadonlyAndReadwriteStorageTextures}, ${TokenSoftwareExtensionName.Packed4x8IntegerDotProduct};
        `;
        const result = parseWgsl(source);

        expect(result).toEqual(
          createNode({
            type: RuleType.TranslationUnit,
            children: [
              {
                type: RuleType.GlobalDirective,
                children: [
                  {
                    type: RuleType.DirectiveRequires,
                    children: [
                      {
                        type: RuleType.Keyword,
                        value: TokenKeyword.Requires,
                      },
                      {
                        type: RuleType.DirectiveRequiresSoftwareExtensionList,
                        children: [
                          {
                            type: RuleType.SoftwareExtensionName,
                            value: TokenSoftwareExtensionName.ReadonlyAndReadwriteStorageTextures,
                          },
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.Comma,
                          },
                          {
                            type: RuleType.SoftwareExtensionName,
                            value: TokenSoftwareExtensionName.Packed4x8IntegerDotProduct,
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

      it("should handle multiple names with comma at the end", () => {
        const source = Str.trimlines`
        requires ${TokenSoftwareExtensionName.ReadonlyAndReadwriteStorageTextures}, ${TokenSoftwareExtensionName.Packed4x8IntegerDotProduct},;
        `;
        const result = parseWgsl(source);

        expect(result).toEqual(
          createNode({
            type: RuleType.TranslationUnit,
            children: [
              {
                type: RuleType.GlobalDirective,
                children: [
                  {
                    type: RuleType.DirectiveRequires,
                    children: [
                      {
                        type: RuleType.Keyword,
                        value: TokenKeyword.Requires,
                      },
                      {
                        type: RuleType.DirectiveRequiresSoftwareExtensionList,
                        children: [
                          {
                            type: RuleType.SoftwareExtensionName,
                            value: TokenSoftwareExtensionName.ReadonlyAndReadwriteStorageTextures,
                          },
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.Comma,
                          },
                          {
                            type: RuleType.SoftwareExtensionName,
                            value: TokenSoftwareExtensionName.Packed4x8IntegerDotProduct,
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

    describe("All", () => {
      it("should handle all", () => {
        const source = Str.trimlines`
        enable f16;
        requires ${TokenSoftwareExtensionName.ReadonlyAndReadwriteStorageTextures};
        diagnostic (${TokenDiagnosticSeverityName.Error}, ${TokenDiagnosticName.DerivativeUniformity});
        `;

        const result = parseWgsl(source);

        expect(result).toEqual(
          createNode({
            type: RuleType.TranslationUnit,
            children: [
              {
                type: RuleType.GlobalDirective,
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
              {
                type: RuleType.GlobalDirective,
                children: [
                  {
                    type: RuleType.DirectiveRequires,
                    children: [
                      {
                        type: RuleType.Keyword,
                        value: TokenKeyword.Requires,
                      },
                      {
                        type: RuleType.DirectiveRequiresSoftwareExtensionList,
                        children: [
                          {
                            type: RuleType.SoftwareExtensionName,
                            value: TokenSoftwareExtensionName.ReadonlyAndReadwriteStorageTextures,
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
              {
                type: RuleType.GlobalDirective,
                children: [
                  {
                    type: RuleType.DirectiveDiagnostic,
                    children: [
                      {
                        type: RuleType.Keyword,
                        value: TokenKeyword.Diagnostic,
                      },
                      {
                        type: RuleType.DiagnosticControl,
                        children: [
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.LeftParenthesis,
                          },
                          {
                            type: RuleType.DiagnosticSeverityName,
                            value: TokenDiagnosticSeverityName.Error,
                          },
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.Comma,
                          },
                          {
                            type: RuleType.DiagnosticName,
                            value: TokenDiagnosticName.DerivativeUniformity,
                          },
                          {
                            type: RuleType.Syntactic,
                            value: TokenSyntactic.RightParenthesis,
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
  });
});
