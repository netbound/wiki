# Exteded Berkeley Packet Filter (eBPF)

## Loading BPF Programs
Loading eBPF programs happens through the `bpf` syscall:
```c
int bpf(int cmd, union bpf_attr *attr, unsigned int size);
```
When `cmd` is BPF_PROG_LOAD, the bytecode program (stored in `attr`) will be
verified, JIT compiled and loaded into the kernel. With BPF_PROG_LOAD, this is the `attr` struct:
```c
struct {
	__u32         prog_type;
	__u32         insn_cnt;
	__aligned_u64 insns;      /* 'const struct bpf_insn *' */
	__aligned_u64 license;    /* 'const char *' */
	__u32         log_level;  /* verbosity level of verifier */
	__u32         log_size;   /* size of user buffer */
	__aligned_u64 log_buf;    /* user supplied 'char *buffer' */
	__u32         kern_version; /* checked when prog_type=kprobe (since Linux 4.1) */
};
```

## eBPF Programs
eBPF programs are are always of a certain type. This type defines the context they can work with, which is provided
as the program input. For example, a networking program will receive the kernel representation of a packet as its input
(`__sk_buff *skb`);

The current set of eBPF program types supported by the kernel are:

* BPF_PROG_TYPE_SOCKET_FILTER: a network packet filter
* BPF_PROG_TYPE_KPROBE: determine whether a kprobe should fire or not
* BPF_PROG_TYPE_SCHED_CLS: a network traffic-control classifier
* BPF_PROG_TYPE_SCHED_ACT: a network traffic-control action
* BPF_PROG_TYPE_TRACEPOINT: determine whether a tracepoint should fire or not
* BPF_PROG_TYPE_XDP: a network packet filter run from the device-driver receive path
* BPF_PROG_TYPE_PERF_EVENT: determine whether a perf event handler should fire or not
* BPF_PROG_TYPE_CGROUP_SKB: a network packet filter for control groups
* BPF_PROG_TYPE_CGROUP_SOCK: a network packet filter for control groups that is allowed to modify socket options
* BPF_PROG_TYPE_LWT_*: a network packet filter for lightweight tunnels
* BPF_PROG_TYPE_SOCK_OPS: a program for setting socket parameters
* BPF_PROG_TYPE_SK_SKB: a network packet filter for forwarding packets between sockets
* BPF_PROG_CGROUP_DEVICE: determine if a device operation should be permitted or not

## eBPF Maps
eBPF maps are efficient key-value pairs that are stored in kernel memory. They can be shared with user-space
through file descriptors, allowing data to be shared between the kernel BPF program and a user-space application.
Sharing a map can be done through pinning it, a process that attaches an object to a BPF file system (`/sys/fs/bpf`).

* BPF_MAP_TYPE_HASH: a hash table
* BPF_MAP_TYPE_ARRAY: an array map, optimized for fast lookup speeds, often used for counters
* BPF_MAP_TYPE_PROG_ARRAY: an array of file descriptors corresponding to eBPF programs; used to implement jump tables and sub-programs to handle specific packet protocols
* BPF_MAP_TYPE_PERCPU_ARRAY: a per-CPU array, used to implement histograms of latency
* BPF_MAP_TYPE_PERF_EVENT_ARRAY: stores pointers to struct perf_event, used to read and store perf event counters
* BPF_MAP_TYPE_CGROUP_ARRAY: stores pointers to control groups
* BPF_MAP_TYPE_PERCPU_HASH: a per-CPU hash table
* BPF_MAP_TYPE_LRU_HASH: a hash table that only retains the most recently used items
* BPF_MAP_TYPE_LRU_PERCPU_HASH: a per-CPU hash table that only retains the most recently used items
* BPF_MAP_TYPE_LPM_TRIE: a longest-prefix match trie, good for matching IP addresses to a range
* BPF_MAP_TYPE_STACK_TRACE: stores stack traces
* BPF_MAP_TYPE_ARRAY_OF_MAPS: a map-in-map data structure
* BPF_MAP_TYPE_HASH_OF_MAPS: a map-in-map data structure
* BPF_MAP_TYPE_DEVICE_MAP: for storing and looking up network device references
* BPF_MAP_TYPE_SOCKET_MAP: stores and looks up sockets and allows socket redirection with BPF helper functions

## Traffic Control Programs

## Sources
### Performance
* [Performance Implications of Packet Filtering with Linux eBPF [PDF]](https://www.net.in.tum.de/fileadmin/bibtex/publications/papers/ITC30-Packet-Filtering-eBPF-XDP.pdf)
* [Capturing Millions of Packets Per Second [Article]](https://kukuruku.co/post/capturing-packets-in-linux-at-a-speed-of-millions-of-packets-per-second-without-using-third-party-libraries/)
### Fundamentals
* [BPF and XDP Reference Guide - Cilium [Docs]](https://docs.cilium.io/en/latest/bpf/)
### Guides
* [A thorough introduction to eBPF [Article]](https://lwn.net/Articles/740157/)
### Examples
* [eBPF samples in the Linux kernel](https://github.com/torvalds/linux/tree/master/samples/bpf)
* [BCC tools](https://github.com/iovisor/bcc/tree/master/libbpf-tools)