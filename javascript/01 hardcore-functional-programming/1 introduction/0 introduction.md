# Introduction

## 1 Mathematical, Pure, Functions

### Definition
Programming with functions

**Function**
From the perspective of Set theory it is a Single value collection of pairs 
For every input it should have a different output.
If it does not apply it is not a function.

| Function | Not a Function |
| -------- | -------------- |
| (a -> 2) | (a -> 2)       |
| (b -> 3) | **(b -> 3)**   |
| (b -> 3) | **(b -> 4)**   |
| (c -> 5) | (c -> 5)       |
**One input, One output**

**Input** is defined as Domain
**Output** is defines as Range

### Validations

**Total**
* ==For Every input there is a corresponding output==
* You will always have a value in the Range (Output)
* Null, is not a valid output, 
* Functions must consider all input

* Non total function

```
const inc = i => {
    if (i === 0 ) return 1 
    if (i === 1 ) return 2 
    if (i === 2 ) return 3 
  }
```


* Total Function
```
const inc = i => { 
  return i + 1 
}

const inc = i => { 
  if (i === 0 ) return 1 
  if (i === 1 ) return 2
  if (i === 2 ) return 3
  return 100
}
```

==It all depends how you frame it, if you say this first function written in this example return either a number of a null it would make it Total.==

**Deterministic**
* ==Always receive the same output for a given input==

* Non Deterministic Function
  ```
  const timeSince = comment => {
    const now = new Date()
    const then = new Date(comment.createdAt)
    return getDifference(now, then)
  }
  ```
* Deterministic Function
  ```
  const getDifference = (now, then) => {
    const days = Math.abs(now.getDate() - then.getDate());
    const hours = Math.abs(now.getHours() - then.getHours());
    return {days, hours}
  }

  ```

**No Observable Side-Effects**
* ==No observable effects besides computing a value==

* Function with Observable Side Effects (Write and output besides the returned value)
```
const add = (x, y) => {
    console.log(`Adding ${x} ${y}`)
    return x + y
}
```
* Function with No Observable Side Effects(All data is in the returned value)

```
const add = (x, y) => {
    return {result: x + y, log: `Adding ${x} ${y}`}
}
```

==it's depends also pretty much how you defined a side effect, most of the times it refers to some effect that client of the software can see==

## 2 Pure Function Checklist
Examples

Deterministic

```
// not a function
xs.splice(0,3)
//=> [1,2,3]
 
xs.splice(0,3)
//=> [4,5]
 
xs.splice(0,3)
//=> []

// function
xs.slice(0,3)
//=> [1,2,3]
 
xs.slice(0,3)
//=> [1,2,3]
 
xs.slice(0,3)
//=> [1,2,3]
```

You can return an error as a value, blowing the program with an error is not compatible with the mathematical definition

```
// not a function
const toSlug = (title) => {
    const urlFriendly = title.replace(/\W+/ig, '-')
    if(urlFriendly.length < 1) {
        throw new Error('is bad')
    }
    return urlFriendly
}

// function
const toSlug = (title) => {
    return new Promise((res, rej) => {
        const urlFriendly = title.replace(/\W+/ig, '-')
 
        if(urlFriendly.length < 1) {
            rej(new Error('is bad'))
        }
        return res(urlFriendly)
    })
}

```

This case is probably a observable side effect, one way we can push the problem
down the road is returning a function

```
// not a function
const toSlug = (title) => {
    const urlFriendly = title.replace(/\W+/ig, '-')
    if(urlFriendly.length < 1) {
        throw new Error('is bad')
    }
    return urlFriendly
}

// function
const toSlug = (title) => {
    return new Promise((res, rej) => {
        const urlFriendly = title.replace(/\W+/ig, '-')
 
        if(urlFriendly.length < 1) {
            rej(new Error('is bad'))
        }
        return res(urlFriendly)
    })
}
```


### Function or not Function

Not a function it is not deterministic
```
const birthday = user => {                                                                                                                                                   
    user.age += 1;                                                                                                                                                                  
    return user;                                                                                                                                                                    
} 
```

It is a Function
```
const shout = word =>
    word.toUpperCase().concat("!")
```

It is not a function, because querySelector will return different values depending on the time it is called. so it is not deterministic
```
const headerText = header_selector =>
    querySelector(header_selector).text()
```

Location is global it is not deterministic because same input different output
```
const parseQuery = () =>
    location.search.substring(1).split('&').map(x => x.split('=')) 
```


It is a function
```
var parseQueryString = function(queryString) {                           
    var params = {}, queries, temp, i, l;                                  
 
    queries = queryString.split("&");                                      
 
    for ( i = 0, l = queries.length; i < l; i++ ) {                        
        temp = queries[i].split('=');                                      
        params[temp[0]] = temp[1];                                         
    }                                                                      
 
    return params;                                                         
};
```

## 3 Pure Function Advantages
* Reliable (same input, same output)
* Portable 
* Reusable (They are not dependent of the environment)
* Testable 
* Composable
* Properties/Contract

PPTX Link: https://docs.google.com/presentation/d/1nj5xmsHeJh-6RdjLs1190Hwl8smclvFLePqPCTVsrYw/edit#slide=id.g61c861d54_010
