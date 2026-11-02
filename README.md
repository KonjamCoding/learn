# learn

Written robotics tutorials from **Konjam Coding**, served at
[learn.konjamcoding.me](https://learn.konjamcoding.me).

The videos are on [YouTube](https://www.youtube.com/@konjamcoding), spoken in Tamil. These
pages are the part you copy and paste from: the commands, the files, the output you should
expect, and the errors you will probably hit.

**Found something wrong?** That is the most useful thing you can send. Every page has a
"Fix this page on GitHub" link at the bottom, or
[open an issue](https://github.com/KonjamCoding/learn/issues). See
[CONTRIBUTING.md](CONTRIBUTING.md).

## Running it locally

```bash
npm install
npm run dev
```

```bash
npm run build && npm run preview
```

## Writing a tutorial

One Markdown file in `src/content/docs/`. The sidebar group comes from the folder.

```markdown
---
title: Your first node
description: One sentence, used for search results and link previews.
sidebar:
  order: 1
testedOn: ["ROS 2 Jazzy", "Ubuntu 24.04", "Python 3.12"]
youtube: dQw4w9WgXcQ
---
```

`testedOn` and `youtube` are specific to this site: they render the strip under the title
that says what the page was verified against and links the matching episode. Both are
optional, and `testedOn` matters more than it looks. A ROS tutorial goes stale quietly,
and saying so out loud is the difference between a reader debugging their own setup and a
reader knowing the page is simply old.

More on structure, the brand, comments and deployment: [docs/README.md](docs/README.md).

## Licence

Writing is [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Code samples
are MIT. See [LICENSE](LICENSE).
