# Project Instructions

## 英文单词本工作流

当用户询问英文单词或短语的中文意思时，完成翻译后必须将该词条追加到 `docs/ninetrans-blog/vocabulary.md` 文件中。

格式：`| 单词/短语 | 中文意思 | 备注 |`

示例：用户问 "rank beginner 是什么意思" → 翻译后自动执行文件编辑，把 `rank beginner | 彻头彻尾的初学者 | ...` 加入表格。

**重要**：翻译必须结合项目上下文，不要给出通用解释。先查看项目内容，理解该词在本项目中的具体含义再翻译。

**关键规则**：用户请求翻译的单词/短语出自九变博客的博文。必须先在 `public/ninetrans-blog/posts/` 中搜索该词所在的博文原文，理解原文语境后再翻译。不可脱离博文内容做泛泛的字典解释。

**同步规则**：`docs/ninetrans-blog/vocabulary.md` 是 Nine Transitions 词条的源文件。应用加载的是 `public/ninetrans-blog/vocabulary.md`（`src/App.tsx` 中 `markdownUrl: "/ninetrans-blog/vocabulary.md"` 映射到此文件）。每次更新源文件后，必须同步修改 `public/ninetrans-blog/vocabulary.md`，确保两文件内容一致。

## 个人学习笔记本

`reference-notes.md` 是个人学习笔记的源文件。应用通过 References 板块的 "Personal Reference Notes" 资源加载 `public/reference-notes.md`（`src/App.tsx:419` 附近定义）。

当用户说 **"把这个加入到笔记本中"** 或类似表述时，将当前讨论的结论整理后追加到 `reference-notes.md` 的表格中，格式为：`| 主题 | 一句话总结 | 详细讨论要点 |`。每次更新后同步到 `public/reference-notes.md`。
