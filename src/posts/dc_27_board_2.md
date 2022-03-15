---
title: 'Defcon 27 Cubcon Badge Writeup: Part 2 (Schematic Design)'
date: 08-06-2019
summary: Lessons learned from the Defcon 27 Cubcon Badge
---

# Intro
*This is the second post in a series on the design process of the
Defcon 27 Cubcon electronic badge. For part 1, see
[here](/blog/08-05-2019/defcon-27-cubcon-badge-writeup:-part-1-(part-selection)/)*  

Last time we outlined our design goals and constraints and selected
parts to fulfil the major component roles in our board. However, our
design is still incomplete. For one thing, we still need to lay out our
components on our board. For another, most complex components, such
as our microcontroller or power converter, will require additional
components to function. As it turns out, the easiest way to figure
out these components is to add them as we design our board.

# A Note on Circuit Board Design Software
I personally use KiCad for circuit board design, as it's free, relatively
capable, and well supported by most circuit board manufacturers. This isn't
intended to be a comprehensive tutorial of KiCad, and if you're more familiar
with another circuit board design software, feel free to use that, however
images and examples from this particular circuit board will be from KiCad
version 5.1.2. If your installed version of KiCad does not match this, keep
in mind that some options may have changed or moved.

# KiCad Setup
After installing KiCad and creating a new project (Generally under File > New Project),
you will be presented with a screen similar to the following:

| ![KiCad Starting screen](/static/dc27_board/kicad_open.jpg "KiCad Starting Screen") |
|:---:|
| *KiCad Starting Screen* |

The first thing that we will want to do here is make a project library. This will help
us save components specific to our board design in an easy to maintain and transfer manner.
This is *especially* important if there are multiple contributors to a hardware design,
as it will ensure that all contributors are referencing the same parts as they lay out the
design. To do this, we will open the Symbol Editor.

| ![Symbol Editor Icon](/static/dc27_board/kicad_symbol.jpg "KiCad Symbol Editor") |
|:---:|
| *KiCad Symbol Editor* |

From here, we will create a new library (File > New Library). Choose an easy to track
location, preferably in the project folder, and choose a library name (I personally use project.lib).
Finally, add the library to the project library folder.

| ![Project Library Table](/static/dc27_board/project_lib.jpg "Project Library Table") |
|:---:|
| *Project Library Table* |

This gives us a place to store logical diagrams for our components, but we will also
need to store the physical layout of the pins (Component Footprints) for our components.
For this, we will exit the Symbol Editor and open the Footprint Editor.

| ![Footprint Editor Icon](/static/dc27_board/kicad_footprint.jpg "KiCad Footprint Editor") |
|:---:|
| *KiCad Footprint Editor* |

Similarly, we will create a new library here (File > New Library), choose an easy to track
location, and an easy to track name (project.pretty). Finally, we will once again add
this library as a project library.

Finally, since we are intending to purchase all our components from Mouser, we will utilize
pre-generated symbols and footprints provided by Mouser to save us time. To do this, we will
need to download and install the [Library Loader](http://mouser.componentsearchengine.com/pcb-libraries.php)
provided by Mouser to simplify this process. Follow the instructions given on the site to
download, install, and set up the program.

# Beginning Schematic Design

The first step in our board design will be to lay out a logical diagram of our board design.
First of all, this will help us mentally track what parts of the our design we've
completed and what remains. Second of all, our PCB design software requires
these logical schematics to properly lay out the components on our board.
To begin this process, we open the ".sch" file from the starting screen.
This will present us with a blank schematic sheet, the starting point of our design.

| ![Empty Schematic](/static/dc27_board/kicad_schematic.jpg "Empty Schematic") |
|:---:|
| *Empty Schematic* |

We now are ready to place our first component, but where to begin? Most designers will
break up this task by dividing a board design into logical modules, each accomplishing
a single task, and develop a single module at a time. In my personal opinion, a good
way to begin this design process is by starting with the power regulation module, as
most simple designs will be relatively "isolated" compared to the rest of our design.

## The Power Regulation Module

Our power regulation module will need to take the battery voltage (Denoted VBAT), and
convert it into the system voltage (Denoted VCC). As discussed in
[Part 1](/blog/08-08-2019/defcon-27-cubcon-badge-writeup:-part-1-(part-selection)/),
we will be using the Texas Instruments TLV61225 to accomplish this. Searching Mouser
for "TLV61225" gives us 2 results, the "TLV61225DCKR" and the "TLV61225DCKT". Since
all the specifications look the same, and the TLV61225DCKR is cheaper[^1], this is
the part that we will be using in our design.

From the product details page, we will need 2 things: The component symbols and footprints,
and the component datasheet. Click on the links labeled "ECAD Model" and "Datasheet"
to obtain these. Next, the component symbols and footprints will be loaded into
the Library Loader Library in KiCad. We want these symbols and footprints associated
with the project library so we can share them with contributors and distribute them
with our board designs.

## Importing Component Symbols and Footprints

To do this, we open the Symbol Editor again, find our voltage regulator, right click
and select "Save As".
 
| ![Save As](/static/dc27_board/symbol_save_copy.jpg "Save As") |
|:---:|
| *Save As* |

Next, select our project library (Named "project" here) from the dialog.

| ![Project Library](/static/dc27_board/symbol_save_library.jpg "Project Library") |
|:---:|
| *Project Library* |

Next, select the Symbol Properties (Edit > Properties), take note of the footprint,
then close the Symbol Editor. Finally, open the Footprint Editor and repeat this
process for the component footprint.

## Designing our Power Regulation

Next, we open the the datasheet for our power regulator and begin looking for
an application schematic. In our case, this is extremely simple, as the on the
very first page, there is a diagram labeled "Typical Application Schematic."
Since our design doesn't require any differences from this design
(1.5V is between 0.8V and 3.3V and our voltage regulator doesn't need to be
disabled), completing our power regulation module is a simple matter of copying
this schematic into our board schematic.

| ![Application Schematic](/static/dc27_board/power_circuit.jpg "Our target schematic") |
|:---:|
| *Our target schematic* |

To start this process, select (Place > Symbol) click on the schematic sheet near
a corner of the sheet, and search for our power regulator (TLV61225DCKR).

| ![Power Regulator](/static/dc27_board/regulator.jpg "Keep some room for wires and components") |
|:---:|
| *Keep some room for wires and components* |

Next, we will begin placing support components into our schematic. To keep
everything organized and ensure that we don't miss parts, I generally work from
top-left to bottom-right (On the datasheet). This makes our first support component
L1, a 4.7 uH inductor (See table below for common component names).

| Abbreviation | Component | Units |
|:---:|---|---|
| L | Inductor | H (Henry's) |
| R | Resistor | Ω (Ohms)[^2] |
| C | Capacitors | F (Farads) |
| D | Diode | N/A[^3] |
| Q | Transistor | N/A[^4] |A

To find our inductor, click again on the schematic and type in "Inductor". Select
the inductor under "Device".

| ![Generic Inductor](/static/dc27_board/select_inductor.jpg "Inductor under \"Device\"") |
|:---:|
| *Inductor under "Device"* |

Since our datasheet shows the inductor between the L and VIN pins, place the inductor next to
the L pin.

| ![Placed Inductor](/static/dc27_board/placed_inductor.jpg "Initial Inductor Placement") |
|:---:|
| *Initial Inductor Placement* |

Next, select (Place > Wire), then click on the circle next to the L pin on the power regulator,
then click on the circle on the nearest inductor pin.

| ![Wired Inductor](/static/dc27_board/wired_inductor.jpg "Wired Inductor") |
|:---:|
| *Wired Inductor* |

Similarly, connect the other pin of the inductor to the VIN pin of the power regulator,
making sure to avoid covering the label of the power regulator
(You can click at any place on the schematic to place an angle in a wire).

| ![Completed Inductor](/static/dc27_board/full_wired_inductor.jpg "Completed Inductor") |
|:---:|
| *Completed Inductor* |

Next, (This can be the most tedious part of schematic design), repeat this process
for the remaining pins and components in the Application Schematic. After this process,
the schematic will look somewhat similar to the following:

| ![Completed Power Regulator](/static/dc27_board/completed_power.jpg "Completed Power Regulator") |
|:---:|
| *Completed Power Regulator* |

Finally, select (Place > Power Port) and place VCC, VBAT, and GND nodes (The little fork on the
datasheet schematic is ground). This finishes our power regulator design.

| ![Finished Power Regulator](/static/dc27_board/power_ports.jpg "Finished Power Regulator") |
|:---:|
| *Finished Power Regulator* |

## Microcontroller Layout
Next, I tend to lay out the microcontroller design, as in most cases, this forms the center
of our design. As with before, we begin this process by searching Mouser for our component
and selecting a result. In this case, we have an additional few considerations, as Atmel
manufactures the ATSAML11 in several different form factors. The ATSAML11 also comes in a
TSSOP package, however, this comes with less pins, so we want to avoid this to give our badge
as much flexibility down the line as possible. We also want to avoid QFN (Quad-Flat No-lead)
packages, as they tend to be more difficult to hand solder. This leaves us with the -AU and -AF
packages, as they are in a hand solderable QFP-32 package, and have the most number of pins
available. We will choose the -AU package, as it has more ROM and RAM, allowing us to write
more complex programs

| ![QFN Package](/static/dc27_board/QFN.webp "Not what we want") |
|:---:|
| *Not what we want* |

Additionally, some of the options provided by Mouser come pre-provisioned with Atmel identity
keys that help you assert that your code is running on the microcontroller that you intend it
to. In our case, however, we won't need this function. Additionally, as we may with to experiment
with our own identity assertations, we may not even want this pre-provisioned key. With this
information, we narrow ourselves down to the "ATSAML11E16A-AU."

As with the power regulator, we will once again download a component symbol and footprint
from Mouser and search through the datasheet for a reference schematic. In this case, it's
on Page 29. For the sake of simplicity, we will chose the LDO (Low-Dropout Regulator) configuration,
and copy this into our schematic. Next, select (Place > Global Label), and add global labels to
all the GPIO pins (PA02-27). Note that PA30 and PA31 are our debug pins, and should be labeled
as SWCLK and SWDIO. Additionally, PA00, PA01, PA14, and PA15 are used for external
oscillators, so these are left unused. Select (Place > No Connect Flag) on these oscillator pins
and VDDOUT.

| ![Finished MCU Design](/static/dc27_board/finished_mcu.jpg "Your design should look something like this") |
|:---:|
| *Your design should look something like this.[^5]* |

## Button Layout
Next up, we will design the circuitry for our input switch. This time, however, we do not
have a datasheet or reference schematic, as applications for a switch are too varied for
manufacturers to provide substantial guidance. Because of this, we will need to create our
own circuit design.

### Pull Resistors
One of the first things to deal with is creating known values for "Button Pressed" and
"Button Released". This is done through something called a
[Pull-Up (or Pull-Down) Resistor](https://learn.sparkfun.com/tutorials/pull-up-resistors/all).
While there is some explanation to choosing pull-up or pull-down configurations and values for
these resistors, the important part of this process is that we will connect the common pins
of our switch to ground, and a resistor of a unspecified value between VCC and the switch
pins[^6]. 

| ![Switch with Pull-Up Resistors](/static/dc27_board/pull_up.jpg "Our switch design so far") |
|:---:|
| *Our switch design so far* |

### Switch Debouncing
The second thing we have to deal with is the fact that our switch physically consists of two
pieces of metal that come into contact when the switch is pressed. Because these pieces of metal
are flexible (They have to move with the button), they can "bounce" when they come into contact,
and cause our microcontroller to read multiple inputs. THere are multiple ways we can handle this,
however, the easiest (for our switch configuration) will be by adding a capacitor between the input
and ground lines. This capacitor will store voltage while the switch isn't depressed, and release it
right after the switch is first depressed, smoothing out the bouncing of the switch contacts. Since
our switch is sitting between the input line and ground, we will also place our debouncing capacitor
between the input line and ground.

| ![Switch with Debounce Capacitors](/static/dc27_board/debounce.jpg "After the debounce caps") |
|:---:|
| *After the debounce caps* |

Finally, we can choose values for these capacitors. Since the values of debouncing capacitors
don't matter a whole lot, we choose 4.7uf here, as it's a common value for ceramic capacitors.
Additionally, we can hook up the input lines. Through other discussions, we decided that up will
be pin PA02, "click" will be pin PA03, and down will be PA04. As with the microcontroller, we will
use (Place > Global Label) to label these pins. KiCad will recognize that these wires share
the same name and automatically connect them, allowing us to easily organize our schematics.

| ![Finished Switch Design](/static/dc27_board/switch_finished.jpg "After capacitor values and global labels") |
|:---:|
| *After capacitor values and global labels* |

## Other Components
### Display Header
From the product photos, we know that the order of the pins for our display (From top to bottom)
are GND, VCC, SCL, and SDA. With this knowledge, we will add a new header with 4 pins
(Any 01x04 connector will work here, I used the most generic one). Generally, when working
with hardware-assisted communication on microcontrollers, you will assign hardware instances
in order. Since this is our first serial device, we will call SDA and SCL "S1_SDA" and "S1_SCL".
As before, add global labels to our header pins as GND, VCC, S1_SCL, and S1_SDA.

| ![Display Header With Labels](/static/dc27_board/display_headers.jpg "Display Header with Labels") |
|:---:|
| *Display Header with Labels* |

### I2C Pullups
According to the I2C specification, all devices on an I2C bus should include pullup resistors.
Importantly [(As Raspberry Pi designers discovered)](https://www.theverge.com/2019/7/10/20688655/raspberry-pi-4-usb-c-port-bug-e-marked-cables-audio-accessory-charging), if you need pullup
or pulldown resistors on 2 lines, you will need 2 resistors. Additionally, as these resistors
need to bring the I2C lines close to VCC, we need to choose a sufficiently low resistor value.
However, the lower our pullup resistor values are, the more power our design will consume.
After some experimentation, we discovered that a value of 1 kohm works well in our design.
To minimize the number of unique parts ordered, we can also use this value for pullup resistors
on our switches. Once again, use global labels to create pullup resistors on S1_SCL and S1_SDA.

| ![I2C Pullup Resistors](/static/dc27_board/i2c_pullup.jpg "I2C Pullup Resistors") |
|:---:|
| *I2C Pullup Resistors* |

### Reset Button
In general, it's nice to have a way to trigger a hardware reset on any microcontroller
board you design. To do this, we simply need to put a button on the reset line of the
microcontroller. If we read through the datasheet, we will find out that the microcontroller
will reset when the RESET line is pulled low, so we will place a button between RESET
and GND. Any momentary pushbutton symbol will work here, but as in previous places,
I used the most generic option.

| ![Reset Button](/static/dc27_board/reset_btn.jpg "Reset Button") |
|:---:|
| *Reset Button[^7]* |

### Debug Header
We will also need a way to program and debug our microcontroller. Conveniently,
KiCad contains a footprint and symbol for an ARM SWD connector, the connector and
protocol utilized by our microcontroller. Add this symbol and connect the signals
as described on the symbol. Note that our microcontroller does not have TDO/TDI pins,
so these should be marked as No Connect.

| ![SWD Connector](/static/dc27_board/swd_connector.jpg "SWD Connector") |
|:---:|
| *SWD Connector* |

### Battery
When designing our power regulation circuitry, we omitted the battery from the circuit
design. We will add it here, selecting a generic battery symbol again, and connecting
the positive pin of the symbol to "+ BATT", and the second pin of the symbol to GND.

| ![Battery](/static/dc27_board/battery.jpg "Battery") |
|:---:|
| *Battery* |

### GPIO Pins
After some discussion, we decided to expose a total of 16 GPIO pins, including the I2C
lines for our display (To simplify debugging). Additionally, we are exposing VCC and GND
(Generally a very good practice) to make the board more flexible and again, to simplify
debugging. After deciding what 8 pins go on each header, 2 01x09 header symbols are added
and global nets are assigned to the pins. (Place > Label) is also used to add S1_SDA and
S1_SCL are added to PA22 and PA23, the I2C lines we decided to use.

| ![GPIO Pins](/static/dc27_board/gpio_pins.jpg "GPIO Pins") |
|:---:|
| *GPIO Pins* |

# Overview
After all this work, we have finally completed translating our design goals and requirements
into an actual schematic. Next, we will lay out these components onto a circuit board,
completing our hardware design.

[^1]: The price difference comes from the number of units provided per package
by Texas Instruments in this case, but this doesn't really matter to us, so
we choose the cheaper one.

[^2]: When labeling components, this unit is sometimes omitted because trying to
type this can be irritating.

[^3]: Since different diodes can have different properties, a part number is
sometimes used as a "unit" when a specific behavior is needed

[^4]: Similar to diodes, transistors can have *very* different properties.
A specific part number is nearly always given here, as designs will often not
work properly with the wrong type of transistor.

[^5]: We can move the field references (IC1 and ATSAML11E1A-AU) by right-clicking
on them and selecting "Move Value"

[^6]: We aren't choosing values for these yet, because the values don't matter
too much (Pull-up/down resistors can be anywhere from ~200 to 100k ohms), and
we will have other resistors on the board whose values actually matter.

[^7]: The line over the RESET line denotes that it's an active-low signal,
aka pulling the line low will "activate" the signal