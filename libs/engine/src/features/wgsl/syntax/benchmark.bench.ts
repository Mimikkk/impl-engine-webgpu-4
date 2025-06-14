import { TemplateListParser } from "../TemplateListParser.ts";
import { WGSLSource } from "../tokens.ts";
import { parseTemplateLists } from "./parseTemplateLists.ts";

// Sample WGSL code snippets with template lists
const testCases: { name: string; code: WGSLSource }[] = [
  {
    name: "Simple template",
    code: "fn foo<T>() {}",
  },
  {
    name: "Multiple parameters",
    code: "fn bar<T, U, V>(x: T, y: U, z: V) {}",
  },
  {
    name: "Nested templates",
    code: "fn baz<T<U<V>>>(x: T<U<V>>) {}",
  },
  {
    name: "Complex template with expressions",
    code: "fn qux<T, U>(x: T, y: U) where T: Add<U> { return x + y; }",
  },
  {
    name: "Multiple template lists",
    code: "fn complex<T, U>(x: T, y: U) where T: Add<U>, U: Mul<T> { return x + y * x; }",
  },
  {
    name: "Template with comments",
    code: "fn withComments<T, /* type param */ U>(x: T, y: U) {}",
  },
  {
    name: "Template with whitespace",
    code: "fn withSpaces<T,  U,  V>(x: T, y: U, z: V) {}",
  },
  // New complex test cases
  {
    name: "Deep nested templates",
    code: "fn deepNested<T<U<V<W<X<Y<Z>>>>>>>(x: T<U<V<W<X<Y<Z>>>>>>) -> T<U<V<W<X<Y<Z>>>>>> { return x; }",
  },
  {
    name: "Multiple nested constraints",
    code:
      "fn complexConstraints<T, U, V>(x: T, y: U, z: V) where T: Add<U> & Mul<V>, U: Sub<T> & Div<V>, V: Mod<T> & Pow<U> { return x + y * z; }",
  },
  {
    name: "Long template parameter list",
    code:
      "fn longParams<A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T>(a: A, b: B, c: C, d: D, e: E, f: F, g: G, h: H, i: I, j: J, k: K, l: L, m: M, n: N, o: O, p: P, q: Q, r: R, s: S, t: T) {}",
  },
  {
    name: "Complex nested with constraints",
    code:
      "fn complexNested<T<U<V>>, W<X<Y>>>(a: T<U<V>>, b: W<X<Y>>) where T<U<V>>: Add<W<X<Y>>>, W<X<Y>>: Mul<T<U<V>>> { return a + b * a; }",
  },
  {
    name: "Multiple template lists with complex constraints",
    code:
      "fn multiTemplate<T, U, V>(x: T, y: U, z: V) where T: Add<U> & Mul<V>, U: Sub<T> & Div<V>, V: Mod<T> & Pow<U>, T<U>: Add<V>, U<V>: Mul<T>, V<T>: Sub<U> { return x + y * z; }",
  },
  {
    name: "Template with mixed comments and whitespace",
    code:
      "fn mixedFormatting<T, /* first type */ U, /* second type */ V>(x: T, /* first param */ y: U, /* second param */ z: V) where T: /* first constraint */ Add<U> & /* second constraint */ Mul<V> { return x + y * z; }",
  },
  {
    name: "Complex nested with multiple constraints",
    code:
      "fn complexNestedConstraints<T<U<V<W>>>, X<Y<Z<A>>>>(a: T<U<V<W>>>, b: X<Y<Z<A>>>) where T<U<V<W>>>: Add<X<Y<Z<A>>>> & Mul<X<Y<Z<A>>>>, X<Y<Z<A>>>: Sub<T<U<V<W>>>> & Div<T<U<V<W>>>> { return a + b * a; }",
  },
  {
    name: "Template with complex type operations",
    code:
      "fn complexTypeOps<T, U, V>(x: T, y: U, z: V) where T: Add<U> & Mul<V> & Sub<U> & Div<V>, U: Add<T> & Mul<V> & Sub<T> & Div<V>, V: Add<T> & Mul<U> & Sub<T> & Div<U> { return (x + y) * (z - x) / (y + z); }",
  },
  {
    name: "Template with nested generic functions",
    code:
      "fn nestedGenericFunc<T, U>(x: T, y: U) -> fn<V, W>(a: V, b: W) -> T where T: Add<U>, V: Mul<W> { return fn<V, W>(a: V, b: W) -> T { return x + y; }; }",
  },
  {
    name: "Template with complex return type",
    code:
      "fn complexReturn<T, U, V>(x: T, y: U, z: V) -> T<U<V>> where T<U<V>>: Add<U<V<T>>>, U<V<T>>: Mul<T<U<V>>> { return x + y * z; }",
  },
  {
    name: "Template with multiple nested generic types",
    code:
      "fn multiNestedGeneric<T<U<V<W<X<Y<Z>>>>>>, A<B<C<D<E<F<G>>>>>>>(x: T<U<V<W<X<Y<Z>>>>>>, y: A<B<C<D<E<F<G>>>>>>) where T<U<V<W<X<Y<Z>>>>>>: Add<A<B<C<D<E<F<G>>>>>>>, A<B<C<D<E<F<G>>>>>>: Mul<T<U<V<W<X<Y<Z>>>>>> { return x + y * x; }",
  },
];

const parser = TemplateListParser.create();

Deno.bench({
  group: "Parse Template Lists",
  name: "Rule Implementation",
  fn: () => {
    for (const testCase of testCases) {
      parseTemplateLists(testCase.code);
    }
  },
});

Deno.bench({
  group: "Parse Template Lists",
  name: "Matcher Implementation",
  fn: () => {
    for (const testCase of testCases) {
      parser.find(testCase.code);
    }
  },
});
