# Fixed bugs
25.09.2023 - unChoices did not reflect always, fixed now.

# Custom Permutation Generator

## 1. require / import
```ts
const CustomPermutation = require('custom-permutation')
```

## 2. Constructor
```ts
CustomPermutation(elList:[els...], choices:{ index: [els...]] }, nonChoices:{ index: [els...]] })
```

## 3. Usage explanation

_example:_

```ts
CustomPermutation(["a", "b", "c"], {1: ["a", "b"]}, {0: ["a"]})
```

Permutate 3 elements which are "a", "b" and "c" with below rules

__- choices rule:__
```json
{ "1": ["a", "b"] }
```

    At index=1 there can only be the element "a" or "b"

__- nonChoices rule:__
```json
{ "0": ["a"] }
```

    At index=0 there can NOT be the element "a"

_Note: given index are considered as 0 based: [index=0, index=1, etc.]_

## 4. Result set explanation:

Let's see all permutations, and which ones are valid or not.
- `["a", "b", "c"]` : violates nonChoices rule: _first element is `"a"`, but shouldn't be `"a"`
- `["a", "c", "b"]` : violates nonChoices rule: _first element is `"a"`, but shouldn't be `"a"`_
- `["b", "a", "c"]` : [x] OK
- `["b", "c", "a"]` : violates choices rule: _second element is `"c"` but `"a"` or `"b"` is desired_
- `["c", "a", "b"]` : [x] OK
- `["c", "b", "a"]` : [x] OK

So there are just 3 results that should be generated with this parameters.

## 5. Complete example

### 1. Create permutation

```ts
let customPerm = new CustomPermutation(
    ["a", "b", "c"],
    { "1": ["a", "b"] },
    { "0": ["a"] }
);
```

### 2. Get next value

#### 2.1. Use with next

```ts
let next = customPerm.next();

while (next) {
    console.log(next)
    next = customPerm.next();
}
```

#### 2.2. Or use with generator

```ts
let generator = customPerm.generator();
let next = generator.next();

while (!next.done) {
    console.log(next.value)
    next = generator.next();
}
```

### 3. Output

__Console__

```sh
["b", "a", "c"]
["c", "a", "b"]
["c", "b", "a"]
```