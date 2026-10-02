# Custom Permutation Generator

## 1. Usage

### 1.1. `require`

```ts
const CustomPermutation = require('custom-permutation');
```

### 1.2. `import`

```ts
import CustomPermutation from 'custom-permutation';
```

## 2. Constructor

```ts
CustomPermutation(
    elList:[],
    choices:{ index: [] },
    nonChoices:{ index: [] }
)
```

## 3. Usage explanied

_example:_

```ts
CustomPermutation(['a', 'b', 'c'], { '1': ['a', 'b'] }, { '0': ['a'] });
```

Permutate 3 items which are "a", "b" and "c" with below rules

**`choices` rule:**

```json
{ "1": ["a", "b"] }
```

> At `index=1` there can only be the item `"a"` or `"b"`

**`nonChoices` rule:**

```json
{ "0": ["a"] }
```

> At `index=0` there can NOT be the item `"a"`

_Note: given index are considered as 0 based: [index=0, index=1, etc.]_

| index |     all options     | after customization |
| :---: | :-----------------: | :-----------------: |
|   0   | `"a"`, `"b"`, `"c"` |    `"b"`, `"c"`     |
|   1   | `"a"`, `"b"`, `"c"` |    `"a"`, `"b"`     |
|   2   | `"a"`, `"b"`, `"c"` | `"a"`, `"b"`, `"c"` |

## 4. Result set explanation:

Let's check all permutations, and see which ones are and are not valid.

|    Permutation    |  Violates  |              Description               |
| :---------------: | :--------: | :------------------------------------: |
| `["a", "b", "c"]` | nonChoices |         _first can't be `"a"`_         |
| `["a", "c", "b"]` | nonChoices |         _first can't be `"a"`_         |
| `["b", "a", "c"]` |     -      |                   -                    |
| `["b", "c", "a"]` |  choices   | _second is asked to be `"a"` or `"b"`_ |
| `["c", "a", "b"]` |     -      |                   -                    |
| `["c", "b", "a"]` |     -      |                   -                    |

So there are only **3** results that chould be generated with these parameters.

## 5. Complete example

### 5.1. Create object from `CustomPermutation` class

```ts
let customPerm = new CustomPermutation(['a', 'b', 'c'], { '1': ['a', 'b'] }, { '0': ['a'] });
```

### 5.2. Get next value

#### 5.2.1. With `next`

```ts
let next = customPerm.next();

while (next) {
  console.log(next);
  next = customPerm.next();
}
```

#### 5.2.2. With `generator`

```ts
let generator = customPerm.generator();
let next = generator.next();

while (!next.done) {
  console.log(next.value);
  next = generator.next();
}
```

**Output:**

```sh
["b", "a", "c"]
["c", "a", "b"]
["c", "b", "a"]
```

## 6. Command line

The package also ships a `custom-permutation` command, so you can use it without writing code:

```sh
npx custom-permutation a b c --only 1=a,b --not 0=a
```

```sh
b a c
c a b
c b a
```

| Option | Description |
| --- | --- |
| `--only <pos>=<a,b>` | Position `pos` may only hold the given elements (same as `choices`). Repeatable. |
| `--not <pos>=<a,b>` | Position `pos` may not hold the given elements (same as `nonChoices`). Repeatable. |
| `--limit <n>` | Stop after `n` permutations. Useful since the count grows factorially. |
| `--format <fmt>` | `lines` (default, space separated), `json` (one array) or `csv`. |
| `-h, --help` | Show usage. |

Elements are treated as strings on the command line. The `passFn` filter is only available from code.

## Python version of the tool

This is the python version of [custom-permutation](https://pypi.org/project/custom-permutation/) on PyPi.

## Changelog

- 02.10.2026 - Added the `custom-permutation` command line tool.

- 11.06.2026 - Better typing implemented and more test coverage added.

- 23.09.2024 - Edge cases are handled and the codespace is simplified.

- 25.09.2023 - unChoices did not reflect always, fixed now.
