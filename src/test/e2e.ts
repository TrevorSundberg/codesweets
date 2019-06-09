/* eslint-disable sort-keys */
/* eslint-disable max-classes-per-file */
import Task from "../core/task";
import TaskMeta from "../core/task-meta";
import TaskRoot from "../core/task-root";
import TaskWithData from "../core/task-with-data";
import assert from "assert";

const assertException = (thrower: Function, message? : string) => {
  try {
    thrower();
  } catch (err) {
    if (message && !err.message.includes(message)) {
      assert(false, "Exception did not contain the expected text");
    }
    return;
  }
  assert(false, "Exception was not thrown");
};

class Yarn extends Task {
  public static meta = new TaskMeta({construct: Yarn})
}

class Hairball extends Task {
  public static meta = new TaskMeta({construct: Hairball})
}

class Animal<T> extends TaskWithData<T> {
  public static meta = new TaskMeta({construct: Animal})
}

interface CatData {
  type: "tabby" | "calico" | "black";
  name: string;
  hairs?: number;
}

class Cat extends Animal<CatData> {
  public static meta = new TaskMeta({
    construct: Cat,
    inputs: [Yarn],
    outputs: [
      Animal,
      Hairball
    ],
    tsFile: __filename
  })
  protected async initialize () {
    assert(this.has<Hairball>(Hairball) === null);
    const hairball = new Hairball(this);
    assert(this.components[0] === hairball);
    assert(this.has<Hairball>(Hairball) === hairball);
  }
}

const root = new TaskRoot();

const yarn = new Yarn(root);
assert(root.components[0] === yarn);

assertException(() => new Cat(root, {} as any));

const cat = new Cat(root, {name: "Bob", type: "tabby"});
assert(root.components[1] === cat);
assert(cat.sibling<Yarn>(Yarn) === yarn);
assert(cat.has<Task>(Animal) === cat);

root.initialize();

const catSchema = {
  type: "object",
  properties: {
    type: {
      enum: [
        "black",
        "calico",
        "tabby"
      ],
      type: "string",
      title: "Type"
    },
    name: {
      type: "string",
      title: "Name"
    },
    hairs: {
      type: "number",
      title: "Hairs"
    }
  },
  required: [
    "name",
    "type"
  ],
  $schema: "http://json-schema.org/draft-07/schema#"
};
assert(JSON.stringify(Cat.meta.schema) === JSON.stringify(catSchema));
