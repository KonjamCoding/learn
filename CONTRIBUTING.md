# Contributing

Corrections are the most useful thing anyone sends here. A broken install command stops a
beginner completely, and the person who wrote it has usually moved on and cannot see it
any more.

You do not need to ask permission, and you do not need to be an expert. "This command
fails on Humble" is a good issue.

## The quickest route

**Found a typo or a wrong command?** Click "Fix this page on GitHub" at the bottom of the
page. That opens the file in GitHub's editor. Change it, describe the change in a
sentence, and submit. You do not need to clone anything.

**Not sure what the fix should be?** Open an
[issue](https://github.com/KonjamCoding/learn/issues) saying what you ran, what you
expected, and what happened. Include your ROS distro and Ubuntu version; most reports come
down to a version difference.

**No GitHub account?** Comment on the video. It gets read.

## House rules

Three, and they are not negotiable.

1. **No personal information about anyone, including yourself.** This is an anonymous
   channel on purpose. Do not add real names, personal email addresses, personal domains,
   workplaces or photos, to pages, commit messages or issues. If you want credit for a
   contribution, your GitHub handle is credit.
2. **No politics, religion or caste.** Not in tutorials, not in comments, not in issues.
   There is nothing to debate on this one.
3. **Do not machine-translate tutorials into Tamil.** A wrong technical translation is
   worse than no translation. Tamil pages are waiting for a paid human translator. If that
   is work you can do, say so in an issue.

## Writing a new tutorial

If you want to write a whole page, open an issue first so two people do not write the same
thing.

What a good page here looks like:

- **Every command is one you actually ran**, not one you believe should work. Paste the
  real output, including the ugly parts.
- **Say what you tested on**, in the `testedOn` frontmatter. ROS renames things between
  distros and a page without a version is a trap.
- **Show the errors.** The "When it does not work" section at the bottom of a tutorial is
  often the most valuable part, because it is what someone actually searches for at 1am.
- **English, plainly.** Short sentences. The reader may be reading their second or third
  language, and they are also debugging. Do not make them do both.
- **No screenshots of text.** Nobody can copy, search or screen-read a screenshot. Paste
  the text in a code block.

Code samples should run as written. If a snippet is deliberately incomplete, say so right
there.

## Comments (giscus), for maintainers

Comments are GitHub Discussions on this repo, through [giscus](https://giscus.app). They
are off until these steps are done, and the site shows a plain notice in the meantime
rather than a broken widget.

1. **Enable Discussions**: repo Settings, General, Features, tick Discussions.
2. **Create a category** called `Comments`. Set its format to **Announcement**, so only
   maintainers can open threads and giscus creates them on demand. Discussions, the
   category dropdown, New category.
3. **Install the giscus app** on this repo: <https://github.com/apps/giscus>.
4. **Get the IDs**: fill the form at <https://giscus.app> with `KonjamCoding/learn` and the
   `Comments` category. It gives you a script tag; you want four values out of it.
5. **Set them in Cloudflare Pages**, Settings, Environment variables, for production and
   preview:

   ```
   PUBLIC_GISCUS_REPO         KonjamCoding/learn
   PUBLIC_GISCUS_REPO_ID      R_kgDO…
   PUBLIC_GISCUS_CATEGORY     Comments
   PUBLIC_GISCUS_CATEGORY_ID  DIC_kwDO…
   ```

6. Redeploy. The comment box appears on every tutorial page.

These four values are not secrets; they appear in the page source of every giscus site.
They live in env vars only so the box stays switched off until the repo is actually ready.

**This repo has to stay public for comments to work.** Discussions on a private repo are
not readable by visitors, so making it private would break every comment thread on the
site.
