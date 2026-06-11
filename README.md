# Custom Permutation Generator

## Usage

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

Permutate 3 elements which are "a", "b" and "c" with below rules

**`choices` rule:**

```json
{ "1": ["a", "b"] }
```

> At `index=1` there can only be the element `"a"` or `"b"`

**`nonChoices` rule:**

```json
{ "0": ["a"] }
```

> At `index=0` there can NOT be the element `"a"`

_Note: given index are considered as 0 based: [index=0, index=1, etc.]_

| index |     all options     | after customization |
| :---: | :-----------------: | :-----------------: |
|   0   | `"a"`, `"b"`, `"c"` |    `"b"`, `"c"`     |
|   1   | `"a"`, `"b"`, `"c"` |    `"a"`, `"b"`     |
|   2   | `"a"`, `"b"`, `"c"` | `"a"`, `"b"`, `"c"` |

## 4. Result set explanation:

Let's check all permutations, and see which ones are and are not valid.

|    Permutation    | Is valid |  Violates  |                  Description                   |
| :---------------: | :------: | :--------: | :--------------------------------------------: |
| `["a", "b", "c"]` |    No    | nonChoices |         _first elemen can't be `"a"`_          |
| `["a", "c", "b"]` |    No    | nonChoices |         _first elemen can't be `"a"`_          |
| `["b", "a", "c"]` |   Yes    |     -      |                       -                        |
| `["b", "c", "a"]` |    No    |  choices   | _second element is asked to be `"a"` or `"b"`_ |
| `["c", "a", "b"]` |   Yes    |     -      |                       -                        |
| `["c", "b", "a"]` |   Yes    |     -      |                       -                        |

So there are just **3** results that chould be generated with these parameters.

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

## Fixed bugs

11.06.2026 - Better typing implemented and more test coverage added.
23.09.2024 - Edge cases are handled and the codespace is simplified.
25.09.2023 - unChoices did not reflect always, fixed now.
