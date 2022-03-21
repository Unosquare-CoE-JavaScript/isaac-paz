# Task

## Task Monad

It is basically as Promise, but with the difference that you actually has to know if you are going to return another task to chain them

```
import { Task } from "types";

const t1 = Task((reJ, res) => res(2))
  .chain((two) => Task.of(two + 1))
  .map((three) => three * 2);

t1.fork(console.error, console.log);

```

## Refactoring Node IO with Task

we could refactor the app to pass from this:

```
const app_ = () =>
  fs.readFile("config.json", "utf-8", (err, contents) => {
    console.log(err, contents);
    if (err) throw err;

    const newContents = contents.replace(/3/g, "6");

    fs.writeFile("config1.json", newContents, (err, _) => {
      if (err) throw err;
      console.log("success!");
    });
  });
```

To this:

```
const readFile = (path, enc) =>
  Task((rej, res) =>
    fs.readFile(path, enc, (err, contents) => (err ? rej(err) : res(contents)))
  );

const writeFile = (path, contents) =>
  Task((rej, res) =>
    fs.writeFile(path, contents, (err, contents) =>
      err ? rej(err) : res(contents)
    )
  );

  const app = () =>
  readFile("config.json", "utf-8")
    .map((contents) => contents.replace(/3/g, "6"))
    .chain((newContent) => writeFile("config1.json", newContent));

```

### Task Practices

if you don't want to use the typical constructor for Task:

```
const t = Task((rej, res) => res(2))
```

you can initialized a Task with a minimal context as it is call like this:

```
const t = Task.of(2)
```

it is equivalent, this is also called a appointed functor

## transform & Monad Patterns

If you need to transforms a [Task, Task] into Task[] or traverse other king of types you can use a method called
Traverse on the lib of 'immutable-ext'

it is basically ty flip types around

```
List([graterThan5, looksLikeEmail]).traverse(Either.of, v => (email))
```

Example:

```
const greaterThan5 = (x) =>
  x.length > 5 ? Right(x) : Left("not greater than 5");

const looksLikeEmail = (x) =>
  x.match(/@/gi) ? Right(x) : Left("not an email");

const email = "blahh@yadda.com";
const res = List([greaterThan5, looksLikeEmail]).traverse(Either.of, (v) =>
  v(email)
);

res.fold(console.log, (x) => console.log(x.toJS()));

```

Or a more real case application when flipping out the types makes sense to flat them out:

```

Either.of(List.of(4)).chain((xs) => Either.of(3));
// Either (List(Either))
// Either (Either(List))
// Either (List)

```

## Natural Transformation

Example to change an either type to a Task type
in order to be a natural transformation you don't have to touch the value just flip the type

```
const eitherToTask = e =>
e.fold(Task.rejected, Task.of)
```

Example on manipulating types can make things simpler

From
```
Db.find(1)
  .chain(eu =>
    eu.fold(
      e => Task.of(eu),
      u => Db.find(u.best_friend_id)
    )
  )
  .fork(
    error => send(500, { error }),
    eu =>
      eu.fold(
        error => send(404, { error }),
        x => send(200, x)
      )
  );
```
To
```
Db.find(3)
  .chain(eitherToTask)
  .chain(u => Db.find(u.best_friend_id))
  .chain(eitherToTask)
  .fork(error => send(500, { error }),
    u => send(200, u))
```
