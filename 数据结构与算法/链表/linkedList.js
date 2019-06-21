class Node {
  constructor(element) {
    this.element = element;
    this.next = null;
  }
}
/**
 * 1) 单链表反转
 * 2) 链表中环的检测
 * 3) 两个有序的链表合并
 * 4) 删除链表倒数第n个结点
 * 5) 求链表的中间结点
 *
 */
class LinkedList {
  constructor() {
    this.head = new Node('head'); // 默认表头为空
  }
  
  /**
   * 根据value查找节点,找到的话就返回node，否则就返回null
   * @param {*} item 
   */
  findByValue(item) {
    let currentNode = this.head.next;
    if (this.size() === 0) { // 如果是空链表的话就返回undefined
      throw new Error('链表为空');
    } else {
      if (currentNode.element === item) {
        return currentNode;
      }
      while(currentNode.next !== null) {
        currentNode = currentNode.next;
        if (currentNode.element === item) return currentNode;
      }
      return null;
    }
  }
  
  /**
   * 根据index查找节点，下标从0开始
   * @param {*} index 
   */
  findByIndex (index) {
    let count = -1;
    let currentNode = this.head.next;
    if (currentNode !== null) {
      if (index === 0) return currentNode; // 如果是查找第一个元素的话直接返回。
      ++count;
      while(currentNode.next !== null) {
        currentNode = currentNode.next;
        ++count;
        if (index === count) return currentNode;
      }
    }
    return null; // 如果是空链表的话就直接返回null
  }
  
  /**
   * 向链表末尾追加节点
   * @param {*} newElement 
   */
  append(newElement) {
    if (this.size() === 0) { // 如果是空链表的话
      this.head.next = new Node(newElement);
    } else {
      // 找到最后的结点插入
      let currentNode = this.head.next;
      while(currentNode.next !== null) {
        currentNode = currentNode.next;
      }
      currentNode.next = new Node(newElement);
    }
  }
  
  /**
   * 指定元素向后插入
   * @param {*} newElement 新添加的结点
   * @param {*} element 插入起始结点
   */
  insert (newElement, element) {
    if (!this.findByValue(element)) {
      throw new Error('没有找到指定要插入的结点');
    }
    let targetNode = this.findByValue(element);
    let nextNode = targetNode.next;
    if (nextNode === null) { // 如果要插入的结点是最后结点的话
      targetNode.next = new Node(newElement);
    } else {
      let newNode = new Node(newElement)
      newNode.next = nextNode;
      targetNode.next = newNode;
    }
  }
  
  /**
   * 查找前一个
   * @param {*} item 
   */
  findPrev (item) {
    if (this.size() === 0) throw new Error('链表为空');
    let currentNode = this.head.next;
    if (this.size() === 1) return null; // 如果只有一个结点的话返回null
    while(currentNode.next !== null) {
      if (currentNode.next.element === item) {
        return currentNode;
      }
      currentNode = currentNode.next;
    }
  }
  
  /**
   * 根据值删除,删除成功返回删除的那个结点
   * @param {*} item
   */
  remove (item)  {
    if (this.size() === 0) {
      throw new Error('空的链表'); // 如果是空链表的花就抛异常
    }
    if (!this.findByValue(item)) { // 如果删除值不存在的话。直接抛异常
      throw new Error('删除的结点值不存在');
    }
    let currentNode = this.head.next;
    
    // 如果是删除表头的结点
    if (currentNode.element === item) {
      // 如果只有一个结点
      if (currentNode.next === null) {
        return this.head.next = null;
      } else { // 如果有多个结点
        return this.head.next = currentNode.next;
      }
    }
    
    if (this.findByIndex(this.size() - 1).element === item) {  // 如果是删除最后的结点
      //找到最后一个结点的上一个结点，然后把它的next置为null
      this.findPrev(this.findByIndex(this.size() - 1).element).next = null;
    } else { // 如果是删除中间的结点
      while(currentNode.next !== null) {
        if (currentNode.next.element === item) {
          currentNode.next = currentNode.next.next;
          return item;
        }
        currentNode = currentNode.next;
      }
    }
  }
  
  /**
   * 遍历显示所有节点
   */
  display () {
    let currentNode = this.head.next // 忽略头指针的值
    let nodeStr = '';
    while (currentNode !== null) {
      nodeStr += currentNode.next ? `${currentNode.element} -> ` : `${currentNode.element}`;
      currentNode = currentNode.next
    }
    return nodeStr;
  }
  
  /**
   * 返回链表的长度
   */
  size() { 
    let count = 0;
    let currentNode = this.head.next;
    if (currentNode !== null) {
      ++count;
      while(currentNode.next !== null) {
        ++count;
        currentNode = currentNode.next;
      }
    }
    return count;
  }

  /**
   * 尾插法, 单链表反转
   */
  reverseList() {
    let currentNode = this.head.next;
    if (currentNode === null || this.size() === 1) return; // 如果是空链表或者只有一个结点的话直接退出
    const root = new Node('head');
    while(currentNode !== null) {
      let next = currentNode.next;
      currentNode.next = root.next;
      root.next = currentNode;
      currentNode = next;
    }
    this.head = root;
  }

  /**
   * 链表中环的检测
   */
  checkCircle() {
    // 这种写法的可以节省空间复杂度，少一个数组的数据结构
    let currentNode = this.head.next,
        fast = currentNode, // 每次都2步
        slow = currentNode; // 每次都1步
    // 如果是空链表和只有一个结点的链表不会形成环
    if (currentNode === null || currentNode.next === null) return false;
    while(fast && fast.next && currentNode !== null) {
      fast = fast.next.next;
      slow = slow.next;
      if (fast && fast.element === slow.element) {
        return true
      }
      currentNode = currentNode.next;
    }
    return false;
  }
}

module.exports = {
  Node,
  LinkedList
}
