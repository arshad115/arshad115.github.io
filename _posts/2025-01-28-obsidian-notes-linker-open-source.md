---
title: "Obsidian Notes Linker - Open Source"
category: Software
tags: 
  - Obsidian
  - Markdown
  - Linker
  - Python
  - Open Source
header:
  image: https://www.sciencealert.com/images/2020-11/processed/galaxy-cluster-simulation_1024.jpg
  caption: "Photo credit: [**Illustris Collaboration**](https://www.illustris-project.org/media/)"
  teaser: https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/2023_Obsidian_logo.svg/768px-2023_Obsidian_logo.svg.png
comments: true
---

Obsidian Notes Linker is a new open-source project designed to help users of Obsidian, a popular markdown-based note-taking app, to automatically link their markdown files. This tool is written in Python and is available on GitHub for anyone to use and contribute to.

Project can be found on Github [Obsidian Linker](https://github.com/arshad115/obsidian-linker)

## Features

- **Automatic Linking**: The tool scans your markdown files and automatically creates links between notes based on their content.
- **Efficient**: Handles large collections of notes quickly and efficiently.
- **Uses Wikilink Format**: Links are created using the Wikilink format, which is compatible with Obsidian.
- **Skip Links in Metadata**: The tool intelligently skips linking within metadata sections of your notes.
- **Skip Links in Codeblocks and Inline Code**: Ensures that links are not created within code blocks or inline code, preserving the integrity of your code snippets.

## Installation

To install the Obsidian Notes Linker, you can clone the repository from GitHub and install the required dependencies:

```bash
git clone https://github.com/arshad115/obsidian-linker.git
cd obsidian-linker
pip install -r requirements.txt
```

## Usage

To use the tool, simply run the following command in your terminal:

```bash
python obsidianlinker.py /path/to/vault/
```
![Usage]({{ "/assets/images/posts/ol-usage.png" | absolute_url }})

This will scan your notes and add links where appropriate.

## Example

I ran the obsidian linker on my digital garden with 430 markdown notes and it added 17,191 links. I had not linked notes except for the ones in one folder and it did an amazing job of making the graph travel easy and it just looks beautiful!

### Before Linking
![Before Linking]({{ "/assets/images/posts/ol-before.png" | absolute_url }})

### After Linking
![After Linking]({{ "/assets/images/posts/ol-after.png" | absolute_url }})

> **Warning**: Make sure to back up your vault before using this tool, as it can make irreversible edits.

## Contributing

Contributions are welcome! If you have any ideas for new features or improvements, feel free to open an issue or submit a pull request on [Obsidian Linker GitHub](https://github.com/arshad115/obsidian-linker).

## Conclusion

Obsidian Notes Linker is a powerful tool for anyone looking to enhance their note-taking experience in Obsidian. By automating the process of linking notes, it saves time and helps you create a more interconnected and useful knowledge base. Check out the project on GitHub and start linking your notes today!