import ReactPlayer from "react-player";
import {
  MediaController,
//   MediaControlBar,
//   MediaTimeRange,
//   MediaTimeDisplay,
//   MediaPlaybackRateButton,
//   MediaSeekBackwardButton,
//   MediaSeekForwardButton,
//   MediaMuteButton,
//   MediaFullscreenButton,
} from "media-chrome/react";

const PlayerView = ({ source, setIsPlaying }) => {
  return (
    <div className="rounded-xl overflow-hidden border">
      <MediaController
        style={{
          width: "100%",
          aspectRatio: "16/9",
          overflow: "hidden",  // Ensure overflow is hidden here (media-chrome may not default to it)
        }}
      >
        <ReactPlayer
          slot="media"
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
          style={{
            width: "100%",
            height: "calc(100% + 105px)",  // Make taller to allow cropping (48px top + 48px bottom for symmetry)
            position: "relative",
            top: "-52px",  // Shift up to crop the ~48px title bar
          }}
          autoPlay={true}
          controls={true}
          src={source}
          config={{
            youtube: {
                rel: 0, 
              
            },
          }}
        />
        {/* <MediaControlBar>
          <MediaSeekBackwardButton seekOffset={10} />
          <MediaSeekForwardButton seekOffset={10} />
          <MediaTimeRange />
          <MediaTimeDisplay showDuration />
          <MediaMuteButton />
          <MediaPlaybackRateButton />
          <MediaFullscreenButton />
        </MediaControlBar> */}
      </MediaController>
    </div>
  );
};

export default PlayerView;