---
title: Wtf IP?
layout: post.hbs
tags: lab-note
date: 2022-03-24
summary: |
    Cursed bits of IPv4 knowledge that you probably didn't ask for
---

*Some notes:* These were tested on Linux using `ping.` They may not apply to other operating systems.
If I *know* something is a Linux-specific quirk, I'll note that. Other tools may also have specific
restrictions on IPv4 formats, in particular, Rust tends to be pretty picky.

## Localhost has an Entire /8 Block
As listed in RFC 6890, Section 2.2.2 Table 4, the entire 127.0.0.0/8 block is assigned to "Loopback".
This means that *all* IP's between 127.0.0.1 and 127.255.255.254 are routed back to the local host.

*Side note:* 127.255.255.255 is a broadcast address, but where does that go?

## Address Segments don't Have to be Decimal
Most of the time, IPv4 addresses are written as 4 decimal segments between 0 and 255. However,
segments don't have to be written in decimal. Here are some other addresses that resolve to 127.0.0.1:

- 0x7f.0.0.1
- 0177.0.0.1

## IPv4 Addresses don't need 4 Segments
Most of the time, IPv4 addresses don't need *4* segments, Linux appears to begin filling an IP address
from the high-order bytes, then assumes the last segment fills from the lowest-order byte. Here's more
ways to write 127.0.0.1

- 127.1
- 127.0.1

## IPv4 Segments don't need to be < 255
Internally, the Linux kernel actually defines `in_addr_t` as `uint32_t`
([reference](https://elixir.bootlin.com/uclibc-ng/latest/source/include/netinet/in.h#L142)). Effectively,
this means that Linux will accept any number of 32 bit representations as an IPv4 address. Yet more ways
to write 127.0.0.1:

- 0x7f000001
- 2130706433
- 017700000001

## 0?
Linux also appears to interpret "0" as 127.0.0.1 for some reason? This one seems like a linux-specific behavior,
neither Windows or MacOS replicate this.