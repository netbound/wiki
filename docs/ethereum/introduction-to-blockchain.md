---
sidebar_position: 1
---

# Introduction to Blockchain

A **blockchain** is a chain of blocks, filled with data, that are cryptographically chained together by hash functions.
Because they are chained together by hashes, we can't change any data in already included blocks, because that would change
all the following hashes, and thus invalidate the chain.
This gives us an **append-only** database for storing data, which is nothing special. The special thing arises when
we make everyone in the network run this database, with the same rules for what data can be added.

More concretely, we can replace the data we're talking about with **transactions**, and the database becomes a **ledger**.
Because a network of computers is running the ledger, we often speak about **distributed ledger technology**. If we're talking about
transactions that can be tracked on a distributed network, we have a potential form of **decentralized currency**.
But how can we trust that the ledger is correct, without trusting the people that are maintaining that ledger?

## Consensus Algorithms