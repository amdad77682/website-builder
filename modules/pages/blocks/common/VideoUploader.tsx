import { Modal } from 'antd';
import { Play, Video } from 'lucide-react';
import React, { ReactNode } from 'react';

export interface VideoData {
  url: string;
  title: string;
  source: string;
  thumbnail?: string;
}

interface PublicVideoUploaderProps {
  children?: ReactNode;
  videoModalOpen: boolean;
  setVideoModalOpen: (open: boolean) => void;
  handleSelectedVideo: (image: VideoData) => void;
}

const PublicVideoUploader: React.FC<PublicVideoUploaderProps> = ({
  children,
  videoModalOpen,
  setVideoModalOpen,
  handleSelectedVideo,
}) => {
  // Public domain/free videos from various sources
  const publicVideos: VideoData[] = [
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      title: 'Big Buck Bunny',
      source: 'Blender Foundation',
      thumbnail:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/330px-Big_buck_bunny_poster_big.jpg',
    },
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      title: 'Elephants Dream',
      source: 'Blender Foundation',
      thumbnail:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Elephants_Dream_s5_both.jpg/330px-Elephants_Dream_s5_both.jpg',
    },
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      title: 'For Bigger Blazes',
      source: 'Google',
      thumbnail:
        'https://via.placeholder.com/330x186/4338ca/ffffff?text=For+Bigger+Blazes',
    },
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      title: 'For Bigger Escapes',
      source: 'Google',
      thumbnail:
        'https://via.placeholder.com/330x186/6366f1/ffffff?text=For+Bigger+Escapes',
    },
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      title: 'For Bigger Fun',
      source: 'Google',
      thumbnail:
        'https://via.placeholder.com/330x186/818cf8/ffffff?text=For+Bigger+Fun',
    },
    {
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
      title: 'Sintel',
      source: 'Blender Foundation',
      thumbnail:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Sintel-wallpaper-dragon.jpg/330px-Sintel-wallpaper-dragon.jpg',
    },
  ];

  return (
    <>
      {children && (
        <div onClick={() => setVideoModalOpen(true)} className="">
          {children}
        </div>
      )}
      <Modal
        open={videoModalOpen}
        onCancel={() => setVideoModalOpen(false)}
        footer={null}
        width={900}
        height={600}
      >
        <div className="m p-8">
          <div className="max-w-6xl mx-auto">
            {/* Public Video Gallery */}
            <div className="bg-white rounded-lg shadow-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {publicVideos.map((video: VideoData, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectedVideo(video)}
                    className="relative cursor-pointer group overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all bg-gray-100"
                  >
                    <div className="relative w-full h-48">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
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
                        {video.title}
                      </p>
                      <p className="text-gray-300 text-xs">{video.source}</p>
                    </div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <Play className="w-12 h-12 text-white opacity-80" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PublicVideoUploader;
