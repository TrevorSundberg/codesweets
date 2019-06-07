//import TaskMeta from './modules/task-meta'
import Task from './modules/task'

import GitHubAuthorization from './modules/github-authorization'
import GitHubCreateRepository from './modules/github-create-repository'
//import GitRepository from './modules/git-repository'
//import File from './modules/file'


const owner = new Task(null);

new GitHubAuthorization(owner, { username: 'TrevorSundberg', password: '123' })

new GitHubCreateRepository(owner, { name: 'testrepo123' })

owner.initialize()

console.log(JSON.stringify(GitHubCreateRepository.meta.schema));

//new GitHubAuthorization(owner, 

/*
class Yarn extends Task {
  static meta : TaskMeta = new TaskMeta({ construct: Yarn })
}

class Hairball extends Task {
  static meta : TaskMeta = new TaskMeta({ construct: Hairball })
}

class Animal extends Task {
  static meta : TaskMeta = new TaskMeta({ construct: Animal })
}

type CatData = {
  Color : 'tabby' | 'calico' | 'black'
  Name : string 
  Hairs : number
}

class Cat extends Animal {
  static meta = new TaskMeta({
    construct: Cat,
    tsFile: __filename,
    inputs: [Yarn],
    outputs: [Animal, Hairball]
  })
  get data() : CatData { return this.rawData; }
}


const yarn = new Yarn(owner, {});

const cat = new Cat(owner, {})

const hairball = new Hairball(cat, {})

cat.process()
//fizzle.add(dizzle);
//console.log(fizzle.components);

const x = cat.has<Hairball>(Hairball);

console.log(JSON.stringify(Cat.meta.schema))
//console.log(cat.sibling<Yarn>(Yarn));

*/

//import fetch from 'node-fetch';
//const username = 'TrevorSundberg';
//const password = '123';

//async function main() {
//  const response = await fetch('https://api.github.com/user/repos', {
//    method: 'POST',
//    headers: {
//      'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
//    },
//    body: JSON.stringify({
//      name: 'test',
//      description: 'Some message',
//    })
//  });
//
//  const obj = await response.json();
//  console.log(obj);
//}
//main();
