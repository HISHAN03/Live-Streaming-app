const ffmpeg2 = (youtube,customRTMP) => {
    return [
      '-i',
      '-',
      '-map',
      '0',
      '-c:v',
      'libx264',
      '-preset',
      'veryfast',
      '-tune',
      'zerolatency',
      '-g:v',
      '60',
      '-c:a',
      'aac',
      '-strict',
      '-2',
      '-ar',
      '44100',
      '-b:a',
      '64k',
      '-y',
      '-use_wallclock_as_timestamps',
      '1',
      '-async',
      '1',
  
      '-flags',
      '+global_header',
      '-f',
      'tee',
      `[f=flv:onfail=ignore]${youtube}|[f=flv:onfail=ignore]${twitch}|[f=flv:onfail=ignore]${facebook}|[f=flv:onfail=ignore]${customRTMP}`,
    ]
  }
  
  module.exports.ffmpeg2 = ffmpeg2