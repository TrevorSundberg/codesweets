import Task from '../core/task'
import TaskRoot from '../core/task-root'
import TaskMeta from '../core/task-meta'
import assert from 'assert'
import TaskWithData from '../core/task-with-data';

const assertException = (callback: Function, message? : string) => {
  try {
    callback()
  } catch (err) {
    if (message && !err.message.includes(message)) {
      assert(false, 'Exception did not contain the expected text')
    }
    return
  }
  assert(false, 'Exception was not thrown')
}

class Yarn extends Task {
  public static meta = new TaskMeta({ construct: Yarn })
}

class Hairball extends Task {
  public static meta = new TaskMeta({ construct: Hairball })
}

class Animal<T> extends TaskWithData<T> {
  public static meta = new TaskMeta({ construct: Animal })
}

interface CatData {
  type: 'tabby' | 'calico' | 'black';
  name: string; 
  hairs?: number;
}

class Cat extends Animal<CatData> {
  public static meta = new TaskMeta({
    construct: Cat,
    tsFile: __filename,
    inputs: [Yarn],
    outputs: [Animal, Hairball]
  })

  public async initialize() {
    assert(this.has<Hairball>(Hairball) == null)
    const hairball = new Hairball(this)
    assert(this.components[0] === hairball)
    assert(this.has<Hairball>(Hairball) === hairball)
  }
}

const root = new TaskRoot();

const yarn = new Yarn(root);
assert(root.components[0] === yarn)

assertException(() => new Cat(root, {} as any))

const cat = new Cat(root, { type: 'tabby', name: 'Bob' })
assert(root.components[1] === cat)
assert(cat.sibling<Yarn>(Yarn) === yarn)
assert(cat.has<Task>(Animal) === cat)

root.initialize()

const catSchema = {"type":"object","properties":{"type":{"enum":["black","calico","tabby"],"type":"string","title":"Type"},"name":{"type":"string","title":"Name"},"hairs":{"type":"number","title":"Hairs"}},"required":["name","type"],"$schema":"http://json-schema.org/draft-07/schema#"}
assert(JSON.stringify(Cat.meta.schema) === JSON.stringify(catSchema))
