---
title: ROS 2 from zero
description: A twelve part track through ROS 2, from a fresh Ubuntu install to a launch file that starts a working robot stack.
sidebar:
  order: 0
  label: Overview
testedOn: ["ROS 2 Jazzy", "ROS 2 Humble"]
---

Twelve parts, in order, from nothing installed to a launch file that brings up a small
stack. Each part is short enough to finish in one sitting.

You do not need a robot. Everything here runs on a laptop.

## What you need

- Ubuntu 24.04 for Jazzy, or Ubuntu 22.04 for Humble. A virtual machine is fine, though
  anything involving a GUI will be slow.
- Comfort with a terminal: `cd`, `ls`, editing a file, reading an error.
- Basic Python. Classes and functions, nothing clever.

No C++ in this track. ROS 2 is usually taught in C++ first, which adds a compiler's worth
of problems on top of a new framework. Python first means the errors you hit are ROS
errors.

## The parts

| # | Part | Status |
| --- | --- | --- |
| 1 | [Your first node](/ros2-from-zero/first-node/) | Published |
| 2 | Installing ROS 2 properly | Writing |
| 3 | Topics, and what a QoS profile is for | Writing |
| 4 | Services and when not to use them | Planned |
| 5 | Parameters and config files | Planned |
| 6 | Launch files | Planned |
| 7 | Reading someone else's package | Planned |
| 8 | Custom messages | Planned |
| 9 | Actions | Planned |
| 10 | rviz without the guesswork | Planned |
| 11 | Recording and replaying with rosbag | Planned |
| 12 | Putting a small stack together | Planned |

Part 1 comes before the install guide on purpose. If ROS 2 is already on your machine, you
should be writing something before you read three pages of apt commands.

:::note[Which distro?]
Pick **Jazzy** if you are starting now and on Ubuntu 24.04. Pick **Humble** if you are on
22.04 or following along with a course or a job that uses it. Humble is supported until
May 2027, so it is not a bad choice, just an older one.

Where a command differs between the two, the page says so.
:::

## A word on versions

ROS renames things. A command that worked on Humble can be moved or dropped in Jazzy, and
a tutorial that does not say which distro it was written for wastes your evening.

Every page here says what it was tested against, right under the title. If yours differs
and something breaks, leave a comment on that page. It gets fixed and the next person
does not lose the same evening.
