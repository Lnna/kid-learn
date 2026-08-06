只放需要本地预录的声母：d.mp3 t.mp3 n.mp3 l.mp3 f.mp3
同步命令（PowerShell）：
  Copy-Item audio\d.mp3,audio\t.mp3,audio\n.mp3,audio\l.mp3,audio\f.mp3 src\static\audio\pinyin\ -Force
其它拼音走网络 TTS，不要往 static 里堆文件。
