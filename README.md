# high.school_subject

高中學科筆記與學習資源整理。

## Windows 使用 Claude Code

### 安裝方式

**方法一：原生 Windows（建議）**

需先安裝 [Git for Windows](https://git-scm.com/downloads/win)，然後在 PowerShell 執行：

```powershell
irm https://claude.ai/install.ps1 | iex
```

或用 WinGet：

```powershell
winget install Anthropic.ClaudeCode
```

**方法二：WSL**

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

### 常見問題

**找不到 Git Bash**：在 Claude Code 的 `settings.json` 加入：

```json
{
  "env": {
    "CLAUDE_CODE_GIT_BASH_PATH": "C:\\Program Files\\Git\\bin\\bash.exe"
  }
}
```

**中文資料夾顯示亂碼**：

```bash
git config --global core.quotePath false
git config --global i18n.logOutputEncoding utf-8
git config --global i18n.commitEncoding utf-8
```

**診斷工具**：遇到問題可執行 `claude doctor` 檢查環境設定。

## 學科目錄

| 學科 | 說明 |
|------|------|
| [國文](國文/) | 語文、文學、作文 |
| [英文](英文/) | 文法、閱讀、寫作 |
| [數學](數學/) | 代數、幾何、微積分 |
| [物理](物理/) | 力學、電磁、光學 |
| [化學](化學/) | 有機、無機、化學反應 |
| [生物](生物/) | 細胞、遺傳、生態 |
| [地球科學](地球科學/) | 大氣、地質、天文 |
