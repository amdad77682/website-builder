import { Pause, Play, Plus } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import PublicVideoUploader, { VideoData } from './common/VideoUploader';

interface VideoBlockProps {
  content: any;
  handleUpdateBlock: (content: { mediaId: string; thumbnail?: string }) => void;
}

const VideoBlock: React.FC<VideoBlockProps> = ({
  content,
  handleUpdateBlock,
}) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setselectedVideo] = useState<VideoData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handleSelectedVideo = (video: VideoData) => {
    console.log('Selected video:', video);
    setselectedVideo(video);
    setVideoModalOpen(false);
    handleUpdateBlock({ mediaId: video.url, thumbnail: video?.thumbnail });
    setIsPlaying(false);
  };
  useEffect(() => {
    if (content?.mediaId) {
      const maybeUrl = content.mediaId;
      if (typeof maybeUrl === 'string') {
        setselectedVideo({ url: maybeUrl, title: 'Video', source: '' });
      }
    }
  }, [content]);
  console.log('selectedVideo', content, selectedVideo);

  const togglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    const el = videoRef.current;
    if (!el) return;
    if (isPlaying) {
      el.pause();
      setIsPlaying(false);
    } else {
      el.play();
      setIsPlaying(true);
    }
  };

  const onContainerClick = (e: React.MouseEvent) => {
    // Prevent opening the modal when interacting with the video/thumbnail
    e.stopPropagation();
  };
  return (
    <div className="bg-black w-full h-[400px] flex items-center justify-center">
      <PublicVideoUploader
        videoModalOpen={videoModalOpen}
        setVideoModalOpen={setVideoModalOpen}
        handleSelectedVideo={handleSelectedVideo}
      >
        {selectedVideo ? (
          <div
            className="relative w-full h-full cursor-pointer group "
            onClick={onContainerClick}
          >
            {/* Video element fills the container; shown when playing */}
            <div className="h-[400px] overflow-hidden">
              <video
                ref={videoRef}
                src={selectedVideo.url}
                className=" inset-0"
                playsInline
                controls={false}
              />
            </div>

            {/* Thumbnail overlay when not playing (or if no thumbnail, show gradient) */}
            {!isPlaying && (
              <div className="absolute inset-0">
                {content.thumbnail ? (
                  <img
                    src={content?.thumbnail}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>
            )}

            {/* Play/Pause button */}
            <button
              onClick={togglePlay}
              className="absolute top-1/2 left-1/2 z-40 -translate-x-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-3 transition"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10" color="white" />
              ) : (
                <Play className="w-10 h-10" color="white" />
              )}
            </button>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center gap-2">
            <Plus />
            <p className="text-white">Click to to upload or drag and drop</p>
            <p>Maximum file size: 50 MB.</p>
          </div>
        )}
      </PublicVideoUploader>
    </div>
  );
};

export default VideoBlock;
