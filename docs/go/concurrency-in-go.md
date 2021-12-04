# Concurrency in Go

## Communicating Sequential Processes
Go concurrency is based on [Communicating Sequential Processes](https://www.cs.cmu.edu/~crary/819-f09/Hoare78.pdf), a paper
from C.A.R. Hoare, in 1978.

Go has 4 tools to achieve concurrency:
* Go routines
* Channels
* Select
* Sync package

We'll go over all 4 of them in depth.

## Goroutines

## Channels
Channels can be thought of as a bucket chain. We have a **sender**, passing buckets down the chain, the **buffer**,
which is the chain itself, and then the **receiver**. The buffer is optional. It helps to think of channels as data streams,
and there are a lot of patterns that follow from this:
* Fan-out
* Funnel
* Turnout

There's a lot of situations where channels can be blocking. Here are some examples:
```go
unbuffered := make(chan int)

// This blocks, no receiver
unbuffered <- 1
// This also blocks, no sender
i := <- unbuffered

// We have to add a receiver in a separate goroutine:
go func() {
	i := <- unbuffered
}()

// This will synchronise both goroutines
unbuffered <- 1
```

Channels can be closed. This should **always** happen on the sender side!

## Sources
* [Concurrency Patterns in Go [Video]](https://www.youtube.com/watch?v=YEKjSzIwAdA)
* [Concurrency Patterns in Go - Google I/O [Video]](https://www.youtube.com/watch?v=f6kdp27TYZs)
* [Concurrency made easy [Video]](https://www.youtube.com/watch?v=DqHb5KBe7qI)
* [Communicating Sequential Process [PDF]](https://www.cs.cmu.edu/~crary/819-f09/Hoare78.pdf)