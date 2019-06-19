const { Node, LinkedList } = require('./linkedList');

test('Node instance should have next property ', () => {
  expect(new Node('linked node')).toHaveProperty('next');
});

test('Node instance should have element property ', () => {
  expect(new Node('linked node')).toHaveProperty('element');
});

test('Node instance next prototype to be null', () => {
  expect(new Node('linked node').next).toBeNull();
});

test('Node instance element prototype to be linked node', () => {
  expect(new Node('linked node').element).toBe('linked node');
});

test('linkedList append', () => {
  let list = new LinkedList();
  list.append('one');
  list.append('two');
  list.append('three');
  expect(list.size()).toBe(3);
  expect(list.display()).toBe('one -> two -> three');
});

test('linkedList remove', () => {
  let list = new LinkedList();
  expect(list.size()).toBe(0);
  list.append('tom');
  expect(list.size()).toBe(1);
  list.remove('tom');
  expect(list.size()).toBe(0);
  list.append('paul');
  list.append('alison');
  list.remove('alison');
  expect(list.display()).toBe('paul');
  list.remove('paul');
  expect(list.size()).toBe(0);
});

test('linkedList find', () => {
  let list = new LinkedList();
  expect(list.findByIndex(0)).toBeNull();
  expect(() => {
    list.findPrev()
  }).toThrow();
  expect(() => {
    list.findByValue('one')
  }).toThrow();
  list.append('one');
  expect(list.findPrev('one')).toBeNull();
  expect(list.findByIndex(0).element).toBe('one');
  expect(list.findByValue('one').element).toBe('one');
  list.remove('one');
  expect(() => {
    list.findByValue('one')
  }).toThrow();
  list.append('beijing');
  list.append('hongkong');
  expect(list.findPrev('hongkong').element).toBe('beijing');
  expect(list.findByIndex(1).element).toBe('hongkong');
  list.append('tokyo');
  list.append('taipei');
  expect(list.findPrev('tokyo').element).toBe('hongkong');
});

test('linkedList insert', () => {
  let list = new LinkedList();
  expect(() => {
    list('one', 'two')
  }).toThrow();
  list.append('two')
  list.insert('one', 'two'); // two one 
  list.insert('six', 'one'); // two one six
  list.insert('seven', 'one'); // two one seven six
  list.insert('eight', 'one'); // two one eight seven six
  list.remove('two'); // one eight seven six
  list.remove('seven'); // one eight six
  expect(() => {
    list.insert('four', 'three');
  }).toThrow();
  expect(list.size()).toBe(3);
  expect(list.findByIndex(1).element).toBe('eight');
  expect(list.display()).toBe('one -> eight -> six');
});

test('remove', () => {
  let list = new LinkedList();
  expect(() => {
    list.remove('one');
  }).toThrow();
  list.append('one');
  expect(() => {
    list.remove('two');
  }).toThrow();
  list.append('three');
  list.append('four');
  list.remove('three');
  expect(list.size()).toBe(2);
});