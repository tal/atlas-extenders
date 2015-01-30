# Extandable Extenders

Extendable etenders are a way of making advance javascript objects with inheritance.

They work by creating new functions that extend classes. Think of `Backbone.Model.extend` but
with the ability to customize what happens.

It does this by chaining "extenders" so that you can mix and match what logic you want.

## Basic extenders

As a basic example you could use an extender to make your class `Backbone.Events` compatible

```js
var _      = require('lodash');
var Events = require('backbone-events-standalone');

var extender = require('atlas-extenders');

module.exports = extender.extend({
  beforeExtend: function(opts) {
    _.assign(opts.child.prototype, Events);
  }
});
```

You extend the base extender and it will call the hook `beforeExtend` before it applies the properties of the new class to it. The hook recieves an options object which contains:

* opts.child - the child class that will come out of the extension call
* opts.parent - the parent being extended
* opts.protoProps - the properties passed into the extender that will be applied to the child's prototype

Also passed but less used:

* opts.mixinsAndSelf - an array of every extender that's being used in this extender
* opts.staticProps - properties that have already been assigned statically to the child

## Chaining extenders

The power of extenders is that you can chain many of them together to create advanced options.

```js
var modelExtender = eventsExtender.extend(initializeExtender).extend(attributesExtender);
```

This will create an extender which will apply the logic for the three extenders;

## Applying Extenders

To apply extenders for the first time you can do:

```js
function Class() {}

var Model = modelExtender.call(Class, {
  updated: function() {
    console.log('model was updated');
  }
});

var PostModel = Model.extend({
  defaults: {
    id: null,
    type: 'text',
    body: null
  }

  initialize: function(opts) {
    this.listenTo(globalEvents, 'post:' + this.id + ':updated', this.updated);
  }
});
```

Another option is:

```js
function Class() {}
Class.extend = modelExtender;

var Model = Class.extend({ ...
```

## Provided extenders

The module includes many extenders to get you going.

### [events](https://github.com/tal/atlas-extenders/blob/master/lib/events.js)

When extended instances of the class will work with `Backbone.Events`

### [initialize](https://github.com/tal/atlas-extenders/blob/master/lib/initialize.js)

Will call the method initialize on the prototype durring in the constructor.

### [assign-properties](https://github.com/tal/atlas-extenders/blob/master/lib/assign-properties.js)

This is a helper extender, it's a dependency for extenders which want to apply prototype values when they're used. See [initialize](https://github.com/tal/atlas-extenders/blob/master/lib/initialize.js) for a basic example of how it works.

### [concat-array](https://github.com/tal/atlas-extenders/blob/master/lib/concat-array.js)

This one works a little differently as its a builder for extenders. It allows you to define
an array property that will get added to whenever you extend the class.

```js
var concatArrayBuilder = require('atlas-extenders/concat-array');
var concatArray = concatArrayBuilder('arr');

var Base = concatArray.call(Class, {
  arr: [1,2]
});

var Sub = Base.extend({
  arr: ['four', 'five']
});

var base = new Base();
var sub  = new Sub();

base.arr; //=> [1,2]
sub.arr; //=> [1,2,'four','five']
```

### [merge-object](https://github.com/tal/atlas-extenders/blob/master/lib/merge-object.js)

Just like `concat-array` but for merging objects:

```js
var concatArrayBuilder = require('atlas-extenders/concat-array');
var concatArray = concatArrayBuilder('obj');

var Base = concatArray.call(Class, {
  obj: {
    'foo': 'bar',
    'omg': 'base'
  }
});

var Sub = Base.extend({
  obj: {
    'bar': 'baz',
    'omg': 'sub'
  }
});

var base = new Base();
var sub  = new Sub();

base.obj; //=> {foo: 'bar', omg: 'base'}
sub.obj; //=> {foo: 'bar', omg: 'sub', bar: 'baz'}
```

### [lazy-getter](https://github.com/tal/atlas-extenders/blob/master/lib/lazy-getter.js)

Defines properties that are called lazily.

```js
var LazyClass = laxyExtender.call(Class, {
  lazy: {
    get incrementOne() {
      this._count || (this._count = 0);
      this._count += 1;
      return this._count;
    },
    two: function() {
      this._count || (this._count = 0);
      this._count += 2;
      return this._count;
    }
  }
});

var instance = new LazyClass();
instance.incrementOne //=> 1
instance.incrementOne //=> 1
instance.two //=> 3
instance.two //=> 3
instance.incrementOne //=> 1
instance.reset_incrementOne();
instance.incrementOne //=> 4

instance = new LazyClass();
instance.two //=> 2
instance.incrementOne //=> 3
```

### [attributes](https://github.com/tal/atlas-extenders/blob/master/lib/attributes.js)

Attributes allow you to have values that act like a model. With default values and trigger
events when set/updated. Two different events can be fired: `set:<attr-name>` any time you
call set or `update:<attr-name>` which is called any time you change the value away from
the default.

To use:

```js
var Post = attributesExtender.call(Class, {
  defaults: {
    id: null,
    type: 'text',
    body: null
  }
});

var PhotoPost = Post.extend({
  defaults: {
    type: 'photo',
    photoURL: null
  }
});

var post = new PhotoPost();
post.id = _.uniqId();
post.set('body', 'omg text');
post.photoURL = 'http://...';

var postId = post.get('id');
var postBody = post.body;
```

### [delegate-attributes](https://github.com/tal/atlas-extenders/blob/master/lib/delegate-attributes.js)

Delegate attributes lets you have a local model with its own values but also delegate getters
or perhaps setters to another model. This is useful when you have one core data structure that
many parts of your app share but is used multiple times and in different ways.

```js
var CoreModel = attributesExtend.call(BaseClass, {
  attributes: {
    coreStr: 'core_str',
    coreInt: 123
  }
});

var WrapperModel = attributesExtend.extend(delegateExtend).call(BaseClass, {
  delegate: function() {
    return coreInstance || new CoreModel();
  },

  attributes: {
    wrapper: 'wrapper'
  }
});

coreInstance = new CoreModel();
instance = new WrapperModel();

coreInstance.coreStr = 'test'; //=> triggers events on both coreInstance & instance
instance.coreStr; //=> 'test'
instance.coreStr = 'change'; // no change.
```

### [polymorphic-constructor](https://github.com/tal/atlas-extenders/blob/master/lib/polymorphic-constructor.js)

Polymorphic constructor allows you to specify a class that when instantiated will actually
yield different classes depending on an attribute. By default this is the value of `type` but
you can override the checker to have it base the return on anything you want.

```js
var BasePropClass = polymorphicConstructor.call(BaseClass, {
  polymorphicTypes: function() {
    return {
      omg: OmgClass,
      base: BaseClass
    };
  }
});

var OmgClass = BasePropClass.extend({
  isOmg: true
});

var instance = new BasePropClass({
  type: 'omg'
}); //=> class of type `OmgClass`
```

the reason `polymorphicTypes` is a function is so that you can require subclasses of the class
which is constructing it without causing a syncronous circular dependencies.

## Todo

## Contributing

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Added some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request
