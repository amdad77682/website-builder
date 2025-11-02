import { Play, Plus, Video } from 'lucide-react';
import { useState } from 'react';
import PublicVideoUploader, { VideoData } from './common/VideoUploader';

interface VideoBlockProps {
  content: any;
}

const VideoBlock: React.FC<VideoBlockProps> = ({ content }) => {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [selectedVideo, setselectedVideo] = useState<VideoData | null>(null);
  const handleSelectedVideo = (video: VideoData) => {
    console.log('Selected video:', video);
    setselectedVideo(video);
    setVideoModalOpen(false);
  };
  return (
    <div className="bg-black w-full h-[400px] flex items-center justify-center">
      <PublicVideoUploader
        videoModalOpen={videoModalOpen}
        setVideoModalOpen={setVideoModalOpen}
        handleSelectedVideo={handleSelectedVideo}
      >
        {selectedVideo ? (
          <div className="relative cursor-pointer  group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all bg-gray-100">
            <div className="relative w-full h-48">
              {selectedVideo.thumbnail ? (
                <img
                  src={selectedVideo.thumbnail}
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                  <Video className="w-16 h-16 text-white opacity-50" />
                </div>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
              <p className="text-white text-sm font-medium">
                {selectedVideo.title}
              </p>
              <p className="text-gray-300 text-xs">{selectedVideo.source}</p>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Play className="w-12 h-12 text-white opacity-80" />
            </div>
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
