---
title: JDK源码 String类
date: 2020-06-05 17:46:07
id: 202006051746
tags:
	java
categories:
	[java,jdk源码]
---

Java中使用String类来表示字符串，每一个字符串都是String类的实例。因为String类是被final关键词修饰的，所以实际上字符串都是常亮，它们的值在创建之后不能更改，所以可以共享，并且是线程安全的。

<!-- more-->

## 源码分析

### 类定义

String类被声明为final，所以String类不能被继承。实现了三个接口：Serializable、Comparable 和 CharSequence。

### 主要字段

**value**

一个字符数组，被声明为final，是一个不可变数组，字符串实际上就是由这样一个字符数组的形式存储。

```java
    private final char value[];
```

**hash**

存储的是String实例的hash值，但是只有第一次调用hashCode()方法会计算hash值，然后会缓存下hash值，下次可以直接调用，初始时是0。

```java
    private int hash; // Default to 0
```

### 构造方法

String构造方法有很多，挑选部分分析。
**string()**

直接给成员变量赋值完成。

```java
public String() {
    this.value = "".value;
}
```

**string(String original) **

直接给成员变量赋值完成。

```java
public String(String original) {
	this.value = original.value;
	this.hash = original.hash;
}
```

**String(char value[])**

传入的参数是一个字节数组，在赋值给value的时候不是直接赋值，而是重新复制一个数组，将新数组赋值给value，避免外部通过那个数组引用修改String内部的value。

```java
public String(char value[]) {
	this.value = Arrays.copyOf(value, value.length);
}
```

**String(StringBuffer buffer) **

这个类型的实例实际上表示的是可变字符串，内部存储也是通过字节数组来存储字符串信息，所以是直接讲传入的可变字符串内部的字符数组复制后，赋值给给value。

```java
public String(StringBuffer buffer) {
	synchronized(buffer) {
		this.value = Arrays.copyOf(buffer.getValue(), buffer.length());
	}
}
```

**String(StringBuilder builder)**

这个类型的实例实际上表示的是可变字符串，内部存储也是通过字节数组来存储字符串信息，所以是直接讲传入的可变字符串内部的字符数组复制后，赋值给给value。

```java
public String(StringBuilder builder) {
    this.value = Arrays.copyOf(builder.getValue(), builder.length());
}
```

### 主要方法

**length()**

返回字符串的长度，实际上就是内部字符数组的长度。

```java
public int length() {
	return value.length;
}
```

**isEmpty()**

判断字符串是否为空，实际上就是判断内部字符数组长度是否为0。

```java
public boolean isEmpty() {
	return value.length == 0;
}
```

**charAt(int index)**

寻找指定索引处的字符，会首先判断是否越界，如果没有越界就返回内部字符数组对应索引的字符。

```java
public char charAt(int index) {
	if ((index < 0) || (index >= value.length)) {
		throw new StringIndexOutOfBoundsException(index);
	}
	return value[index];
}
```

**equals(Object anObject)**

通过字方法来判断两个字符串是否相等。具体流程如下：

1. 判断对象引用是否相等，如果想等直接返回true。
2. 判断要比较的对象是否是String类型的实例，如果是，继续进行比较。
3. 判断待比较的字符串长度是否和本字符串一致，如果一致就继续比较。
4. 循环遍历两个字符串的内部的字符数组的每一个字符是否相等（没有做大小写转换，大小写不同则视为不相同）。

```java
public boolean equals(Object anObject) {
	if (this == anObject) {//1
		return true;
	}
    if (anObject instanceof String) {//2
        String anotherString = (String)anObject;
        int n = value.length;
        if (n == anotherString.value.length) {//3
            char v1[] = value;
            char v2[] = anotherString.value;
            int i = 0;
            while (n-- != 0) {//4
                if (v1[i] != v2[i])
                return false;
                i++;
            }
            return true;
        }
    }
    return false;
}
```

**hashCode()**

计算hash值。具体流程如下：

1. 判断hash的值是否为0，如果为0，说明还没有初始化，同时判断value的长度是否大于零，如果不大于，说明次字符串时空字符串，默认hash值为0，不需要再做哈希运算。
2. 遍历字符数组，运算公式是h = 31 * h + val[i]，有两个好处：第一，字符串靠前的字符运算出来的hash值比重更大，如果是对字符串做hash运算，前缀相近的能更大几率哈希到比较近的位置，能够聚集前缀相似的数据（局部性原理）；第二，选择的31是素数，能更好的离散数据（为什么是31而不是其他素数我也不太明白，不过31的二进制表示每一位都为1）。

```java
public int hashCode() {
    int h = hash;
    if (h == 0 && value.length > 0) {//1
        char val[] = value;

        for (int i = 0; i < value.length; i++) {//2
            h = 31 * h + val[i];
        }
        hash = h;
    }
    return h;
}
```

**intern()**

native方法，可以将字符串对象进行手工加入常量池，如果常量池中存在当前字符串, 就会直接返回当前字符串. 如果常量池中没有此字符串, 会将此字符串放入常量池中后, 再返回。

**compareTo(String anotherString)**

比较两个字符串的的大小。具体流程如下：

1. 获得两个字符串中较短的那个字符串的长度，赋值给lim。
2. 循环遍历两个字符串内部的字节数组，直到遍历到第lim，比较字符是否相等，如果不相等就返回两字符之差(c1-c2)，如果都相等就返回两字符串长度之差，只有两个字符串完全相等时，才会返回0。

```java
public int compareTo(String anotherString) {
    int len1 = value.length;
    int len2 = anotherString.value.length;
    int lim = Math.min(len1, len2);//1
    char v1[] = value;
    char v2[] = anotherString.value;

    int k = 0;
    while (k < lim) {//2
        char c1 = v1[k];
        char c2 = v2[k];
        if (c1 != c2) {
            return c1 - c2;
        }
    	k++;
    }
    return len1 - len2;
}

```

## 创建字符串两种方式的区别

### 赋值创建

直接赋值方式创建对象是在方法区的常量池。

```java
String str = "hello";
```

### 通过构造方法创建

通过构造方法创建字符串对象是在堆内存。

```java
String str = new String("hello");//实例化的方式
```

### 两种方式的比较

**直接赋值**

如果采用直接赋值的方式（String str="Lance"）进行对象的实例化，则会将匿名对象“Lance”放入对象池，每当下一次对不同的对象进行直接赋值的时候会直接利用池中原有的匿名对象，这样，所有直接赋值的String对象，如果利用相同的“Lance”，则String对象==返回true。只开辟一块堆内存空间，并且会自动入池，不会产生垃圾。

**构造方法**

会开辟两块堆内存空间，其中一块堆内存会变成垃圾被系统回收，而且不能够自动入池，需要通过public  String intern()方法进行手工入池。在开发的过程中不会采用构造方法进行字符串的实例化。

```java
public static void main(String[] args) {
    String str1 = "Lance";
    String str2 = new String("Lance");
    String str3 = str2; //引用传递，str3直接指向st2的堆内存地址
    String str4 = "Lance";
    /**
    *  ==:
    * 基本数据类型：比较的是基本数据类型的值是否相同
    * 引用数据类型：比较的是引用数据类型的地址值是否相同
    * 所以在这里的话：String类对象==比较，比较的是地址，而不是内容
    */
    System.out.println(str1==str2);//false
    System.out.println(str1==str3);//false
    System.out.println(str3==str2);//true
    System.out.println(str1==str4);//true
}
```

## String的不可变性

String被final修饰，是个常量，从一出生就注定不可变。但是为什么String要使用final修饰呢？

```java
public static void main(String[] args) {
    String a = "abc";
    String b = "abc";
    String c = new String("abc");
    System.out.println(a==b);  			//true
    System.out.println(a.equals(b));  	//true
    System.out.println(a==c);  			//false
    System.out.println(a.equals(c));  	//true
}
```

因为String太过常用，JAVA类库的设计者在实现时做了个小小的变化，即采用了享元模式，每当生成一个新内容的字符串时，他们都被添加到一个共享池中，当第二次再次生成同样内容的字符串实例时，就共享此对象，而不是创建一个新对象，但是这样的做法仅仅适合于通过=符号进行的初始化。

需要说明一点的是，在object中，equals()是用来比较内存地址的，但是String重写了equals()方法，用来比较内容的，即使是不同地址，只要内容一致，也会返回true，这也就是为什么a.equals(c)返回true的原因了。

### String不可变的好处

1. 可以实现多个变量引用堆内存中的同一个字符串实例，避免创建的开销。
2. 当我们在传参的时候，使用不可变类不需要去考虑谁可能会修改其内部的值，如果使用可变类的话，可能需要每次记得重新拷贝出里面的值，性能会有一定的损失。

### 字符串常量池

**常量池表（Constant_Pool table）**

class文件中存储所有常量（包括字符串）的table。这是Class文件中的内容，还不是运行时的内容，不要理解它是个池子，其实就是Class文件中的字节码指令。

**运行时常量池（Runtime Constant Pool）**　

JVM内存中方法区的一部分，这是运行时的内容。这部分内容（绝大部分）是随着JVM运行时候，从常量池转化而来，每个class对应一个运行时常量池。上一句中说绝大部分是因为：除了 class中常量池内容，还可能包括动态生成并加入这里的内容。

**字符串常量池（String Pool）**

这部分也在方法区中，但与Runtime Constant Pool不是一个概念，String Pool是JVM实例全局共享的，全局只有一个。
JVM规范要求进入这里的String实例叫“被驻留的interned string”，各个JVM可以有不同的实现，HotSpot是设置了一个哈希表StringTable来引用堆中的字符串实例，被引用就是被驻留。

**详细分析**

```java
int x  = 10;
String y = "hello";
```

首先，`10`和`"hello"`会在经过javac（或者其他编译器）编译过后变为class文件中`constant_pool table`的内容。当程序运行时，也就是说JVM运行时，每个class的`constant_pool table`中的内容会被加载到JVM内存中的方法区中各自class的`Runtime Constant Pool。`

一个没有被String Pool包含的Runtime Constant Pool中的字符串（这里是"hello"）会被加入到String Pool中（HosSpot使用hashtable引用方式），步骤如下：　　　

1. 在Java Heap中根据"hello"字面量create一个字符串对象。
2. 将字面量"hello"与字符串对象的引用在hashtable中关联起来，键 - 值 形式是："hello" = 对象的引用地址。

另外来说，当一个新的字符串出现在Runtime Constant Pool中时怎么判断需不需要在Java Heap中创建新对象呢？

策略是这样：

1. 会先去根据equals来比较Runtime Constant Pool中的这个字符串是否和String Pool中某一个是相等的（也就是找是否已经存在）
2. 如果有那么就不创建，直接使用其引用。

如此，就实现了享元模式，提高的内存利用效率。

