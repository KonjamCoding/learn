---
title: Your first node
description: Write a ROS 2 publisher and a subscriber in Python, build them with colcon, run them, and prove with ros2 topic hz that messages are actually moving.
sidebar:
  order: 1
testedOn: ["ROS 2 Jazzy", "Ubuntu 24.04", "Python 3.12"]
# Add the video id when the episode is up:
# youtube: dQw4w9WgXcQ
---

By the end of this page you will have two programs talking to each other through ROS 2,
and you will have proved it with numbers rather than hope.

This assumes ROS 2 is already installed. If it is not, the install guide is part 2, or
follow the [official installation docs](https://docs.ros.org/en/jazzy/Installation.html)
and come back.

## 1. Check what you have

```bash
printenv ROS_DISTRO
```

You should see `jazzy` or `humble`. If you see nothing, ROS 2 is installed but not sourced
in this terminal:

```bash
source /opt/ros/jazzy/setup.bash
```

:::tip[Do not put this in .bashrc yet]
Plenty of guides tell you to add that line to `~/.bashrc` on day one. Resist it for now.
Sourcing by hand means that when something cannot be found, you know exactly why. Once
you are tired of typing it, add it.
:::

## 2. Make a workspace

A workspace is just a folder with a `src` inside it. Nothing is registered anywhere.

```bash
mkdir -p ~/ros2_ws/src
cd ~/ros2_ws/src
```

## 3. Create a package

```bash
ros2 pkg create --build-type ament_python konjam_demo --dependencies rclpy std_msgs
```

- `ament_python` means a pure Python package. There is also `ament_cmake` for C++.
- `--dependencies` writes `rclpy` and `std_msgs` into `package.xml` for you. You can add
  them later by hand; this just saves a step.

You now have this:

```
~/ros2_ws/src/konjam_demo/
├── konjam_demo/          ← your Python code goes in here
│   └── __init__.py
├── resource/
├── test/
├── package.xml           ← dependencies and metadata
├── setup.cfg
└── setup.py              ← where you register commands
```

The doubled `konjam_demo/konjam_demo/` is not a mistake. The outer one is the package
folder, the inner one is the Python module.

## 4. Write the talker

```python title="~/ros2_ws/src/konjam_demo/konjam_demo/talker.py"
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class Talker(Node):
    def __init__(self):
        super().__init__("talker")
        self.publisher = self.create_publisher(String, "chatter", 10)
        self.timer = self.create_timer(0.1, self.tick)
        self.count = 0

    def tick(self):
        msg = String()
        msg.data = f"vanakkam {self.count}"
        self.publisher.publish(msg)
        self.get_logger().info(f'publishing "{msg.data}"')
        self.count += 1


def main(args=None):
    rclpy.init(args=args)
    node = Talker()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        if rclpy.ok():
            rclpy.shutdown()


if __name__ == "__main__":
    main()
```

Four things worth knowing:

- `super().__init__("talker")` is the **node name**, which is what shows up in
  `ros2 node list`. It is not the file name and not the command name. All three can differ,
  which is confusing exactly once.
- `create_publisher(String, "chatter", 10)` takes the message type, the topic name, and a
  queue depth. The `10` means "keep up to 10 messages for a subscriber that is briefly too
  slow". It is a simplified quality-of-service setting, covered properly in part 3.
- `create_timer(0.1, self.tick)` calls `tick` every 0.1 seconds, so 10 Hz. ROS 2 does not
  want you writing your own `while True` loop with a `sleep`; the timer lets it manage
  timing and shutdown.
- `rclpy.spin(node)` hands control to ROS. It blocks and processes callbacks until the
  node is shut down.

## 5. Write the listener

```python title="~/ros2_ws/src/konjam_demo/konjam_demo/listener.py"
import rclpy
from rclpy.node import Node
from std_msgs.msg import String


class Listener(Node):
    def __init__(self):
        super().__init__("listener")
        self.subscription = self.create_subscription(
            String, "chatter", self.on_message, 10
        )

    def on_message(self, msg):
        self.get_logger().info(f'heard "{msg.data}"')


def main(args=None):
    rclpy.init(args=args)
    node = Listener()
    try:
        rclpy.spin(node)
    except KeyboardInterrupt:
        pass
    finally:
        node.destroy_node()
        if rclpy.ok():
            rclpy.shutdown()


if __name__ == "__main__":
    main()
```

:::caution[Keep the subscription in a variable]
`self.subscription = ...` looks pointless because nothing reads it back. It is not. If
you drop the assignment, Python garbage collects the subscription and your callback
silently stops firing. You get no error, just silence. This catches everyone once.
:::

The topic name `"chatter"` has to match the talker exactly. ROS 2 turns it into
`/chatter` for you.

## 6. Register the commands

Open `setup.py` and find `entry_points`. Replace it with:

```python title="~/ros2_ws/src/konjam_demo/setup.py" ins={3,4}
entry_points={
    "console_scripts": [
        "talker = konjam_demo.talker:main",
        "listener = konjam_demo.listener:main",
    ],
},
```

The format is `command = module.file:function`. The name on the left is what you type
after `ros2 run konjam_demo`. **Forgetting this step is the single most common reason a
new package "does not exist".**

## 7. Build

```bash
cd ~/ros2_ws
colcon build --packages-select konjam_demo --symlink-install
```

- `--packages-select` builds only this package instead of everything in the workspace.
- `--symlink-install` links your Python files instead of copying them, so editing
  `talker.py` takes effect without rebuilding. For a Python package this is almost always
  what you want.

:::note[colcon: command not found]
```bash
sudo apt install python3-colcon-common-extensions
```
:::

You may see a `SetuptoolsDeprecationWarning` about `setup.py install`. On current Ubuntu
this is noise from setuptools, not a problem with your package. Ignore it.

## 8. Run it

ROS needs to know about your newly built package, which means sourcing the workspace:

```bash
cd ~/ros2_ws
source install/setup.bash
ros2 run konjam_demo talker
```

You should see:

```
[INFO] [1730000000.123456789] [talker]: publishing "vanakkam 0"
[INFO] [1730000000.223456789] [talker]: publishing "vanakkam 1"
```

Now open a **second terminal**. It knows nothing about any of this, so source both:

```bash
source /opt/ros/jazzy/setup.bash
source ~/ros2_ws/install/setup.bash
ros2 run konjam_demo listener
```

```
[INFO] [1730000000.323456789] [listener]: heard "vanakkam 3"
[INFO] [1730000000.423456789] [listener]: heard "vanakkam 4"
```

The listener starts at whatever number the talker is on, not at zero. It missed the
earlier ones because it was not running. That is normal, and worth understanding now: ROS
topics are a live stream, not a queue of everything that ever happened.

## 9. Prove it from the outside

Stop the listener and look at the topic directly. You never needed to write a subscriber
to do this:

```bash
ros2 topic list
```

```
/chatter
/parameter_events
/rosout
```

```bash
ros2 topic echo /chatter
```

```bash
ros2 topic hz /chatter
```

```
average rate: 10.001
	min: 0.099s max: 0.101s std dev: 0.00038s window: 11
```

There is the 10 Hz from `create_timer(0.1, ...)`, measured rather than assumed. When a
robot misbehaves later, `ros2 topic hz` is usually the fastest way to find out whether a
node has stopped publishing or is simply publishing too slowly.

```bash
ros2 topic info /chatter --verbose
```

That prints the message type, how many publishers and subscribers are attached, and the
QoS settings on each side. Mismatched QoS is a common reason two nodes that look correct
refuse to talk, which is part 3.

## When it does not work

**`Package 'konjam_demo' not found`**
: You did not `source install/setup.bash` in this terminal, or you are in the wrong
  workspace. Every new terminal needs sourcing.

**`No executable found`**
: The `entry_points` in `setup.py` do not match what you typed, or you edited `setup.py`
  and did not rebuild. Entry points are read at build time, so `--symlink-install` does
  not save you here. Run `colcon build` again.

**Talker runs, listener prints nothing**
: Check the topic name matches on both sides. Run `ros2 topic list` while the talker is
  up: if you see `/chatter` the publisher is fine, so the problem is the subscriber. Then
  check `ROS_DOMAIN_ID` is the same in both terminals with `printenv ROS_DOMAIN_ID` —
  nodes on different domain IDs cannot see each other at all, and this bites people on
  shared machines and in containers.

**`ModuleNotFoundError: No module named 'konjam_demo'`**
: You are running from inside `~/ros2_ws/src` where a folder shadows the installed
  package. `cd ~/ros2_ws` and try again.

## What you built

Two processes, in separate terminals, that found each other with no address, no port and
no configuration. That discovery is most of what ROS 2 gives you, and it is why the
framework is worth the ceremony.

Part 2 covers installing ROS 2 properly, including the parts of the official guide that
usually go wrong. Part 3 is topics in earnest: message types, queue depths, and why two
correct-looking nodes sometimes will not talk.
