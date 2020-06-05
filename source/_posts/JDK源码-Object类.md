---
title: JDK源码 Object类
date: 2020-06-05 15:23:21
id: 202006051524
tags:
	java
categories:
	[java,jdk源码]
---

Obejct类是所有其他类的父类，所有的对象，包括数组对象，都实现了该类的方法，它提供了以下11个方法：

1. public final native Class<?> getClass()
2. public native int hashCode()
3. public boolean equals(Object obj)
4. protected native Object clone() throws CloneNotSupportedException
5. public String toString()
6. public final native void notify()
7. public final native void notifyAll()
8. public final native void wait(long timeout) throws InterruptedException
9. public final void wait(long timeout, int nanos) throws InterruptedException
10. public final void wait() throws InterruptedException
11. protected void finalize() throws Throwable { }

<!-- more -->

## 一、源码分析

### 1.1 getClass()

native方法，final修饰，子类不可重写。

函数功能：

返回当前运行时对象的Class对象（注意：是运行时，例如，下面代码中n是Number类型的实例，但java中数值默认是Integer类型的，所以getClass返回的是Integer）。

```java
"str".getClass() 				// class java.lang.String
"str".getClass == String.class 	// true
Number n = 0;
Class<? extends Number> c = n.getClass(); 	// class java.lang.Integer
```

### 1.2 hashCode()

native方法，返回对象的哈希码，主要用于HashMap等数据结构。

哈希码的通用阅读如下：

* 在java程序执行过程中，在一个对象没有被改变的前提下，无论这个对象被调用多少次，hashCode方法都会返回相同的整数值。
* 对象的哈希码没有必要在不同的程序中保持相同的值。
* 如果2个对象使用equals方法进行比较并且相同的话，那么这2个对象的hashCode方法的值也必须相等。
* 如果根据equals方法，得到两个对象不相等，那么这2个对象的hashCode值不需要必须不相同。但是，不相等的对象的hashCode值不同的话可以提高哈希表的性能。

注意：**如果2个对象的equals方法相等，那么他们的hashCode值也必须相等，反之，如果2个对象hashCode值相等，但是equals不相等，这样会影响性能，所以还是建议2个方法都一起重写。**

### 1.3 equals()

比较两个对象是否相等。Object类的默认实现是比较2个对象的内存地址是否相等：

```java
public boolean equals(Object obj) {
    return (this == obj);
}
```

注意：**如果重写了equals方法，通常有必要重写hashCode方法，这点已经在hashCode方法中说明了。**

### 1.4 clone()

native方法，创建并返回当前对象的一份拷贝。

一般情况下，对于任何对象 x，表达式 x.clone() != x 为true，x.clone().getClass() == x.getClass() 也为true。

由于Object本身没有实现Cloneable接口，所以不重写clone方法并且进行调用的话会发生CloneNotSupportedException异常。

### 1.5 toString()

Object对象的默认实现，即输出类的名字@实例的哈希码的16进制：

```java
public String toString() {
	return getClass().getName() + "@" + Integer.toHexString(hashCode());
}
```

### 1.6 notify()

native方法，final修饰，不允许子类重写。

唤醒一个在此对象监视器上等待的线程(监视器相当于就是锁的概念)。如果所有的线程都在此对象上等待，那么只会选择一个线程，选择是任意性的。

直到当前线程放弃对象上的锁之后，被唤醒的线程才可以继续处理。被唤醒的线程将以常规方式与在该对象上主动同步的其他所有线程进行竞争。例如，唤醒的线程在作为锁定此对象的下一个线程方面没有可靠的特权或劣势。

notify方法只能被作为此对象监视器的所有者的线程来调用。一个线程要想成为对象监视器的所有者，可以使用以下3种方法：

1. 执行对象的同步实例方法
2. 使用synchronized内置锁
3. 对于Class类型的对象，执行同步静态方法

一次只能有一个线程拥有对象的监视器。

如果当前线程不是此对象监视器的所有者的话会抛出IllegalMonitorStateException异常

注意点：

**因为notify只能在拥有对象监视器的所有者线程中调用，否则会抛出IllegalMonitorStateException异常**

### 1.7 notifyAll()

跟notify一样，唯一的区别就是会唤醒在此对象监视器上等待的所有线程，而不是一个线程。

同样，如果当前线程不是对象监视器的所有者，那么调用notifyAll同样会发生IllegalMonitorStateException异常。

### 1.8 wait(long timeout) throws InterruptedException

native方法，final修饰，子类不可重写。

wait方法会让当前线程等待直到另外一个线程调用对象的notify或notifyAll方法，或者超过参数设置的timeout超时时间。

跟notify和notifyAll方法一样，当前线程必须是此对象的监视器所有者，否则还是会发生IllegalMonitorStateException异常。

wait方法会让当前线程(我们先叫做线程T)将其自身放置在对象的等待集中，并且放弃该对象上的所有同步要求。出于线程调度目的，线程T是不可用并处于休眠状态，直到发生以下四件事中的任意一件：

1. 其他某个线程调用此对象的notify方法，并且线程T碰巧被任选为被唤醒的线程
2. 其他某个线程调用此对象的notifyAll方法
3. 其他某个线程调用Thread.interrupt方法中断线程T
4. 时间到了参数设置的超时时间。如果timeout参数为0，则不会超时，会一直进行等待

所以可以理解wait方法相当于放弃了当前线程对对象监视器的所有者(也就是说释放了对象的锁)。之后，线程T会被等待集中被移除，并且重新进行线程调度。然后，该线程以常规方式与其他线程竞争，以获得在该对象上同步的权利；一旦获得对该对象的控制权，该对象上的所有其同步声明都将被恢复到以前的状态，这就是调用wait方法时的情况。然后，线程T从wait方法的调用中返回。所以，从wait方法返回时，该对象和线程T的同步状态与调用wait方法时的情况完全相同。

### 1.9 wait(long timeout, int nanos) throws InterruptedException

同wait(long timeout)方法类似，多了一个nanos参数，这个参数表示额外时间（以毫微秒为单位，范围是 0-999999）。 所以超时的时间还需要加上nanos毫秒。需要注意的是 wait(0, 0)和wait(0)效果是一样的，即一直等待。

### 1.10 wait() throws InterruptedException

该方法一直等待，没有超时时间这个概念。

### 1.11 finalize()

finalize方法是一个protected方法，Object类的默认实现是不进行任何操作。

该方法的作用是实例被垃圾回收器回收的时候触发的操作，就好比 “死前的最后一波挣扎”。



