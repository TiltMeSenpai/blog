---
title: 'Defcon 27 Cubcon Badge Writeup: Part 1 (Part Selection)'
date: 08-05-2019
summary: Lessons learned from the Defcon 27 Cubcon Badge
---
# Intro
This year was the second year of Cubcon, an event aimed at newcomers to Defcon
and the security/hacking community. As part of the planning for this year, we
decided to create an electronic badge to give out a prize to people who solved
the badge challenge. This served as an interesting excersise in hardware design
and firmware development, and produced a promising platform for future development
with low(ish)-cost[^1] embedded projects.

# Design Goals and Constraints
We all like to build things, I get it. However, it's too easy to run out and start
designing a project without considering what goals you're trying to accomplish and
what pitfalls you're trying to avoid. As such, it's important to slow down, take a
second, and actually lay out your design goals and constraints before you begin laying
out a design[^2].

## Design Goals
- Input and output methods that can be accessed without specialized hardware
- Decently capable hardware (In terms of hardware-specific features)
- Flexible design/reusable after Defcon (i.e. GPIO pins)
- Battery life allows for semi-continuous use throughout Defcon

## Design Constraints
- Price (Target was $10-15)
- Reasonable assembly (We chose not to use BGA/QFN packages)
- Minimal components (See constraints 1&2)
- Easy-to-use toolchains

# Part Selection
Now that we've roughly outlined what we'd like to design, we can begin actually
designing it. This begins by selecting the major components that we'd like to use,
such as our input/output devices, our microcontroller, and our power management
structure. As we select these devices, more of our design will become clear.

## Input Devices
From previous research, we knew about the ALPS SLLB120200. It's a 5-way switch
that provides soft-tilt, hard-tilt, and a click functionality. In our design,
we're only using 3 inputs, the soft-tilt in either direction and the click
functionality. Because of this, utilizing this component turned out to be a
missed opportunity for cost savings, as 3 normal switches costs less.
Additionally, the microcontroller we chose provides hardware-assisted capacitive
touch, although utilizing physical buttons was an intentional decision to minimize
the risk of a user accidentally triggering a button.

| ![SLLB120200 Switch](/static/dc27_board/SLLB120200.jpg "Our chosen switch") |
|:---:|
| *Our chosen switch* |

## Output Devices
From the beginning, we decided we wanted to include a screen on the devices.
Because of this, the primary questions in part selection were what interface
do we want to use with the display, and what display did we want to use. A
common display controller in many generic display modules is the
[SSD1306](https://cdn-shop.adafruit.com/datasheets/SSD1306.pdf), which provides
a parallel bus, SPI, and I2C interface. We knew we wanted to provide unused
GPIO(General Purpose Input/Output) pins so badge holders could do more things
with the badge after Defcon, and the parallel bus required 12 pins, so the parallel
bus was quickly ruled out[^3]. Choosing between SPI and I2C took a bit more thought,
however we chose I2C simply because more display modules in our desired form factor
utilized and I2C bus.
| ![Generic SSD1306 Display](/static/dc27_board/display.jpg "There's a bunch of these out there") |
|:---:|
| *There's a bunch of these out there* |

## Microcontroller
This was by far the most interesting part of the badge. Being a project for a
security conference, we knew we wanted a microcontroller capable of basic security
protections (Secure boot, encrypted flash, ect.) As it turns out, Atmel/Microchip
recently released the ATSAML11, a secure application microprocessor that implements
a full ARM TrustZone. This allows firmware engineers to divide their code into 2
separate processor contexts, a "Secure world" and an "Insecure world." By carefully
controlling what code is allowed to run in Secure world, engineers can further protect
security-critical device functions such as credential storage and encryption functions[^4].

## Power Management
At this point, we *should* know about all of our power consumers, so we can start
thinking about how to provide power. The first step in this process is to decide what
type of power we need to provide. Thankfully, both the microcontroller and display
require 3.3 volts, and switches should generally use whatever operating voltage the
rest of your system uses. With these constraints, we know our power scheme will look
like "Something-to-3.3v".

From our design goals, we know we want to run our badge off of a battery, and we are
aiming for a minimum of 3-5 days of battery life with semi-continuous use. Thankfully,
the parts selected so far are relatively power efficient, and we shouldn't need a very
large battery. After some "definitely complicated" (AKA total guesswork) math, we decided
that 3-5 days of battery life on a button cell would be a bit of a stretch, but using an
AAA should give us enough battery life.

This leaves us with a minor problem. An AAA battery provides 1.5 volts[^5], but as stated
earlier, our components expect 3.3 volts. To fix this, we need a DC-DC power converter
(Batteries produce DC voltage, our components also expect DC voltage). Specifically,
since our supply (battery) voltage is lower than our system (microcontroller/other things)
voltage, we need a boost(step-up) converter. After a bit of googling, we found the
Texas Instruments TLV61225. This worked out fine, however during board assembly and testing,
we noticed a couple things:
1. This converter lacks a "lock out" voltage. This means that once the voltage supplied
by the battery cannot be converted to 3.3v by the converter, it will simply pass through
the battery voltage. This can result in some hard to diagnose behavior with a dead battery.
2. This part is ***tiny***. The entire package is approximately 2mm x 2mm, with 6 pins, making
it by far the hardest component to solder on the board.

| ![Highlighted voltage regulator](/static/dc27_board/badge_1.jpg "USB plug for scale?") |
|:---:|
| *USB plug for scale?[^6]* |

# Overview
At this point we've decided on our design goals and limitations, outlined what goals the major
parts need to fulfill, and selected parts for each role. Next up, we will decide which miscellaneous
parts we need (passives), and design the circuit boards.


[^1]: The total bill of materials actually ended up being around $15, and after
we finished assembling boards, we identified several areas where we could have
made the cost a bit less. Lessons learned, move on.

[^2]: There's a story here. There's actually a couple stories here.

[^3]: Our microcontroller also didn't have a hardware module for the parallel
bus, but this would have been easy enough to work around.

[^4]: The common explanation is "Only trusted code is allowed in the TrustZone",
but as we're developing most of the firmware, the 2-world explanation is a critical
distinction.

[^5]: Technically, our components can run between ~1.6-3.3v, but they all "expect"
3.3v. It's still a good idea to keep the microcontroller as close to its expected
voltage as possible, because while the microcontroller "may" work at a lower voltage,
you still can expect to run into intermittent and rather strange issues. In either case,
1.5 is definitely a bit to low to run our microcontroller.

[^6]: I actually couldn't find any coins for scale, and for some reason I doubt
"banana for scale" works here.