#!/bin/sh
for i in *.mp4;
  do name=`echo "$i" | cut -d'.' -f1`
  echo "$name"
  ffmpeg -y -i "$i" -r 20 -s 352x288 -vb 400k -acodec aac -strict experimental -ac 1 -ar 8000 -ab 24k "$name.3gp"
  ffmpeg -i "$i" -c:v libvpx -crf 10 -b:v 1M -c:a libvorbis "$name.webm"
done
